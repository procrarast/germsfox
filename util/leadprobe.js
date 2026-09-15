/**
 *  Measures the server-side wait that Game.leadMs() compensates for.
 *
 *  Paste into the germs.io PAGE console (not the extension's) while free-spectating, then:
 *
 *      await gfLeadProbe()
 *
 *  It reports the wait in tick periods. leadMs() currently assumes 1.5. If a server, a region
 *  or a mode reports something well away from that, leadMs() is the thing to adjust.
 *
 *  ---------------------------------------------------------------------------------------
 *  What it measures, and why it is done this way
 *
 *  The question is how long the server takes to act on a spectate position we send. Timing it
 *  is the only approach that works, and three more obvious ones do not:
 *
 *  - The centre of the streamed node set looks like it should track the served view, but it
 *    trails: the client holds nodes until their destroy packets land, so the set extends behind
 *    the view by however long that takes. The bias is proportional to pan speed and looks
 *    exactly like view lag. Measured against a deliberately changed lead it barely moved, which
 *    is how we know it is artefact, not signal. Its noise floor is ~700 units either way - it
 *    cannot resolve the few hundred units a lead change is worth.
 *  - Synthetic `mousemove` events get overridden by the real cursor sitting over the page.
 *    rawMouseX/Y are pinned through an accessor here instead, which also survives a stray timer.
 *  - Panning into a map border clamps the camera AND truncates the node set against the map
 *    edge, so anything measured near one is contaminated twice over. This holds the camera
 *    still instead and steps the *requested* position, which needs no runway at all.
 */
window.gfLeadProbe = async function gfLeadProbe({ trials = 3, step = 20000, sampleMs = 20 } = {}) {
    const D = window.__gfDiag;
    // The extension can serve the bundle a revision stale, sometimes for several reloads.
    // Refuse to measure against one that is not the instrumented build.
    if (!D || !D.marker) throw new Error('Instrumented bundle is not live (window.__gfDiag missing). ' +
        'Reload the extension at chrome://extensions, then hard-reload germs.io.');
    const g = D.game;
    if (!g) throw new Error('__gfDiag.game not set - bundle loaded but bootstrap did not run.');
    if (!g.freeSpec) throw new Error('Not in free spectate. Click Spectate first, then re-run.');

    // requestAnimationFrame is paused for an occluded or minimised window while setInterval
    // keeps firing, which freezes the camera and silently invalidates everything below.
    const framesIn = await new Promise(res => {
        let n = 0, stop = false;
        const loop = () => { if (!stop) { n++; requestAnimationFrame(loop); } };
        requestAnimationFrame(loop);
        setTimeout(() => { stop = true; res(n); }, 500);
    });
    if (framesIn < 5) throw new Error('The render loop is not running (' + framesIn + ' frames in 500ms). ' +
        'Bring the Chrome window to the front and keep it visible, then re-run.');

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const savedMove = window.onmousemove;
    const hadX = Object.getOwnPropertyDescriptor(g, 'rawMouseX');

    // Pin the cursor dead centre so the camera cannot drift: scale is 0 at zero offset. An
    // accessor rather than an assignment, so the real mouse cannot overwrite it mid-run.
    window.onmousemove = null;
    Object.defineProperty(g, 'rawMouseX', { get: () => g.width / 2, set: () => {}, configurable: true });
    Object.defineProperty(g, 'rawMouseY', { get: () => g.height / 2, set: () => {}, configurable: true });

    const rows = [];
    try {
        // Camera still and parked, so Game.sendMouse() sends one position and then goes quiet -
        // its lastMouseSent dedupe stops it re-sending an unchanged one. The socket is ours.
        const trial = async (from, to) => {
            const dir = Math.sign(to - from);
            // Far enough outside the old viewport that nothing already on screen can trip it.
            const thresh = from + dir * 11000;
            g.camera.x = g.camera.targetX = from;
            g.camera.y = g.camera.targetY = 0;
            g.network.sendMouse({ x: from, y: 0 });
            await sleep(2200);

            const beyond = () => {
                for (const n of g.nodes.values()) {
                    if (!n.eaten && (dir > 0 ? n.x > thresh : n.x < thresh)) return true;
                }
                return false;
            };
            if (beyond()) return null;                       // start state dirty, discard

            let onset = null;
            const t0 = performance.now();
            const sampler = setInterval(() => { if (onset === null && beyond()) onset = performance.now() - t0; }, sampleMs);
            await sleep(120);
            const tStep = performance.now() - t0;
            const driver = setInterval(() => g.network.sendMouse({ x: to, y: 0 }), 40);
            await sleep(1400);
            clearInterval(driver);
            clearInterval(sampler);
            if (onset === null) return null;
            return { onset: Math.round(onset - tStep), ping: g.ping, tick: g.network.tickPeriod };
        };

        for (let i = 0; i < trials; i++) {
            const a = await trial(0, step); if (a) rows.push(a);
            const b = await trial(step, 0); if (b) rows.push(b);
        }
    } finally {
        // Always hand the real mouse back, even if a trial threw.
        delete g.rawMouseX; delete g.rawMouseY;
        if (hadX && 'value' in hadX) { g.rawMouseX = g.width / 2; g.rawMouseY = g.height / 2; }
        window.onmousemove = savedMove || g.onMouseMove.bind(g);
        D.stop();
    }

    if (rows.length < 2) throw new Error('No usable trials - every run started with nodes already past the threshold.');

    const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
    // onset is (up + server wait + down), so subtracting the round trip leaves the server's own.
    const waits = rows.map(r => r.onset - r.ping);
    const tick = avg(rows.map(r => r.tick));
    const inTicks = avg(waits) / tick;

    const result = {
        trials: rows.length,
        onsetsMs: rows.map(r => r.onset),
        meanPingMs: +avg(rows.map(r => r.ping)).toFixed(1),
        tickPeriodMs: +tick.toFixed(1),
        serverWaitMs: waits.map(Math.round),
        meanServerWaitMs: +avg(waits).toFixed(1),
        serverWaitInTicks: +inTicks.toFixed(2),
        leadMsAssumes: 1.5,
        // Sampling quantises each onset, so treat anything inside a sample period as agreement.
        verdict: Math.abs(inTicks - 1.5) * tick <= sampleMs * 1.5
            ? 'MATCHES leadMs() - no change needed.'
            : inTicks > 1.5
                ? 'Server is slower than leadMs() assumes (load, or a different server). It leads short here; ' +
                  'raising the multiplier trades that against starving the edge behind you.'
                : 'Server is faster than leadMs() assumes - it is over-leading, which starves the trailing edge.',
    };
    console.table([result]);
    console.log('%c' + result.verdict, 'font-weight:bold');
    return result;
};
console.log('gfLeadProbe ready - free-spectate, then run:  await gfLeadProbe()');
