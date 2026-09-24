/**
 *  Measures where a frame's JavaScript goes, live or under a synthetic crowd.
 *
 *  Paste into the germs.io PAGE console (not the extension's) while spectating, then:
 *
 *      await gfPerfProbe()                        // the lobby as it is
 *      await gfPerfProbe({ scenario: 'churn4k' }) // ~5.5k nodes, 7,500 spawns+eats a second
 *
 *  Scenarios: 'live', 'static2k', 'churn2k', 'churn4k', or an object of the same shape as the
 *  presets below. Every perf change should quote the same scenario before and after.
 *
 *  ---------------------------------------------------------------------------------------
 *  How it measures, and the traps it is built around
 *
 *  - Phases are timed by wrapping what Game.render() calls, rather than editing render():
 *    camera.updateBounds() opens the frame and is immediately followed by the node loop, and
 *    camera.tick() is the first thing after it. PIXI's own work is split with the render-group
 *    system's _buildInstructions (a full rebuild) and _updateRenderables (the no-rebuild path).
 *  - Synthetic scenarios feed crafted opcode-16 packets through the REAL Network.onMessage, so
 *    the pool, the renderers and PIXI are the production path. Fake ids start at 0x70000000 and
 *    are all destroyed afterwards. noteServerTick() is stubbed for the run, or the fake 25Hz
 *    would drag the split-pacing tick estimate around.
 *  - PIXI calls cellContainer.sortChildren() a second time inside its own rebuild, which finds
 *    nothing to do. Only the game's call - the first in a frame - says whether the sort was dirty.
 *  - Chrome pauses requestAnimationFrame for an occluded window while timers keep running, so a
 *    run can silently record a fraction of its frames. `wallCoverage` is recorded frame time over
 *    wall time and should read ~1.0; anything well under means the window was hidden, re-run.
 *  - performance.now() is coarsened to 100us on this page (no cross-origin isolation). Single
 *    frames are quantised; the means over hundreds of frames are what to compare.
 *  - The cursor is pinned to the middle of the screen, as in leadprobe.js, so free spectate
 *    cannot drift the camera off the synthetic crowd mid-run.
 */
window.gfPerfProbe = async function gfPerfProbe({ scenario = 'live', ms = 8000, warmup = 2000, seed = 1 } = {}) {
    const D = window.__gfDiag;
    // The extension can serve the bundle a revision stale, sometimes for several reloads.
    if (!D || !D.game) throw new Error('Germsfox bundle is not live (window.__gfDiag.game missing). ' +
        'Reload the extension at chrome://extensions, then hard-reload germs.io.');
    const g = D.game;
    if (!g.freeSpec) throw new Error('Not in free spectate. Click Spectate first, then re-run.');

    const PRESETS = {
        live: null,
        static2k: { players: 200, food: 1000, ejected: 800, churn: 0 },
        churn2k: { players: 200, food: 1000, ejected: 800, churn: 100 },
        churn4k: { players: 200, food: 2000, ejected: 2000, churn: 300 },
    };
    const cfg = typeof scenario === 'string' ? PRESETS[scenario] : scenario;
    if (cfg === undefined) throw new Error('Unknown scenario ' + scenario + ' - one of ' + Object.keys(PRESETS).join(', '));

    const sleep = t => new Promise(r => setTimeout(r, t));
    const now = () => performance.now();

    // ---- patching, undone in reverse whatever happens ---------------------------------------
    const undo = [];
    const patch = (obj, key, make) => {
        const own = Object.getOwnPropertyDescriptor(obj, key);
        const inner = obj[key];
        obj[key] = make(inner);
        undo.push(() => { if (own) Object.defineProperty(obj, key, own); else delete obj[key]; });
    };
    const define = (obj, key, desc) => {
        const own = Object.getOwnPropertyDescriptor(obj, key);
        Object.defineProperty(obj, key, { configurable: true, ...desc });
        undo.push(() => { if (own) Object.defineProperty(obj, key, own); else delete obj[key]; });
    };

    // ---- frame and packet recording ---------------------------------------------------------
    let on = false, cur = null;
    const frames = [], packets = [];
    const rg = g.renderer.renderGroup;
    const cc = g.cellContainer;

    const timed = (after) => inner => function (...a) {
        const t = now();
        const r = inner.apply(this, a);
        after(now() - t, this, a);
        return r;
    };

    const result = { scenario: typeof scenario === 'string' ? scenario : 'custom' };
    let stress = null;

    try {
        patch(g.camera, 'updateBounds', inner => function (...a) {
            if (on) cur = { t0: now(), nodes: g.nodes.size, children: cc.children.length,
                sort: 0, compact: 0, rgUpd: 0, build: 0, updR: 0, upload: 0, rebuilt: false, sortDirty: null };
            const r = inner.apply(this, a);
            if (cur) cur.loopStart = now();
            return r;
        });
        patch(g.camera, 'tick', inner => function (...a) {
            if (cur && cur.loop == null) cur.loop = now() - cur.loopStart;
            return inner.apply(this, a);
        });
        patch(cc, 'sortChildren', inner => function (...a) {
            if (cur && cur.sortDirty === null) cur.sortDirty = this.sortDirty;
            const t = now();
            const r = inner.apply(this, a);
            if (cur) cur.sort += now() - t;
            return r;
        });
        patch(g, 'compactCellContainer', timed(d => { if (cur) cur.compact += d; }));
        patch(rg, '_buildInstructions', timed(d => { if (cur) { cur.build += d; cur.rebuilt = true; } }));
        patch(rg, '_updateRenderables', timed(d => { if (cur) cur.updR += d; }));
        patch(g.renderer.renderPipes.batch, 'upload', timed(d => { if (cur) cur.upload += d; }));
        patch(rg, '_updateRenderGroups', timed((d, self, a) => { if (cur && a[0] === g.stage.renderGroup) cur.rgUpd += d; }));
        patch(g.renderer, 'render', inner => function (...a) {
            const t = now();
            const r = inner.apply(this, a);
            if (cur) {
                cur.render = now() - t;
                cur.total = now() - cur.t0;
                frames.push(cur);
                cur = null;
            }
            return r;
        });
        patch(g.network, 'handleNodes', timed(d => { if (on) packets.push(d); }));

        // Pinned dead centre: free spectate pans by the cursor's offset from the middle
        define(g, 'rawMouseX', { get: () => g.width / 2, set: () => {} });
        define(g, 'rawMouseY', { get: () => g.height / 2, set: () => {} });

        if (cfg) {
            stress = startStress(g, cfg, seed);
            undo.push(() => stress.stop());
        }

        await sleep(warmup);
        const w0 = now();
        on = true;
        await sleep(ms);
        on = false;
        cur = null;
        const wall = now() - w0;

        if (frames.length < 2) {
            throw new Error(`Only ${frames.length} frames rendered in ${Math.round(wall)}ms - the ` +
                'render loop was paused. Bring the Chrome window to the front and re-run.');
        }

        // ---- summary ------------------------------------------------------------------------
        const q = (v, p) => { const s = [...v].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
        const mean = v => v.reduce((a, b) => a + b, 0) / (v.length || 1);
        const stat = k => { const v = frames.map(f => f[k] ?? 0); return `${mean(v).toFixed(3)} / p95 ${q(v, 0.95).toFixed(3)}`; };
        const span = frames.length > 1 ? frames[frames.length - 1].t0 - frames[0].t0 : 0;

        Object.assign(result, {
            frames: frames.length,
            fps: +(frames.length / (span / 1000)).toFixed(1),
            wallCoverage: +(span / wall).toFixed(2),
            renderZoom: +g.camera.renderZoom.toFixed(4),
            nodes: Math.round(mean(frames.map(f => f.nodes))),
            children: Math.round(mean(frames.map(f => f.children))),
            totalMs: stat('total'),
            loopMs: stat('loop'),
            sortMs: stat('sort'),
            compactMs: stat('compact'),
            renderMs: stat('render'),
            rgUpdateMs: stat('rgUpd'),
            buildMs: stat('build'),
            updateRenderablesMs: stat('updR'),
            uploadMs: stat('upload'),
            rebuiltFrames: +(frames.filter(f => f.rebuilt).length / (frames.length || 1)).toFixed(2),
            sortDirtyFrames: +(frames.filter(f => f.sortDirty).length / (frames.length || 1)).toFixed(2),
            packets: packets.length,
            handleNodesMs: packets.length ? `${mean(packets).toFixed(3)} / p95 ${q(packets, 0.95).toFixed(3)}` : null,
        });
    } finally {
        while (undo.length) {
            try { undo.pop()(); } catch (error) { console.error('[gfPerfProbe] restore failed', error); }
        }
    }

    if (result.wallCoverage < 0.9) {
        console.warn(`[gfPerfProbe] Only ${Math.round(result.wallCoverage * 100)}% of the run had frames - ` +
            'the window was probably hidden or occluded. Re-run with it in front.');
    }
    console.table([result]);
    return result;
};

/**
 *  A deterministic crowd, fed through the real packet handler at 25Hz: `players` cells of one
 *  owner random-walking, `food` static pellets, `ejected` blobs, and `churn` ejections per tick
 *  - each one eaten by a player a few ticks later, so the fade and the pool both run.
 */
function startStress(g, { players, food, ejected, churn }, seed) {
    const BASE = 0x70000000;
    const OWNER = 0x7fff0001;

    // mulberry32, so a scenario is the same crowd every run
    let s = seed >>> 0;
    const rand = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const rnd = (a, b) => a + rand() * (b - a);

    const enc = new TextEncoder();
    const build = ({ eats = [], nodes = [], destroys = [] }) => {
        const bytes = [];
        const u8 = x => bytes.push(x & 255);
        const u16 = x => { u8(x); u8(x >> 8); };
        const u32 = x => { u16(x & 0xffff); u16(x >>> 16); };
        u8(16);
        u16(eats.length);
        for (const [h, e] of eats) { u32(h); u32(e); }
        for (const n of nodes) {
            u32(n.id); u32(n.x | 0); u32(n.y | 0); u16(n.size);
            let flags = 2;                       // hasColor
            if (n.ejected) flags |= 32;
            if (n.parent != null) flags |= 64;
            if (n.name) flags |= 8;
            u8(flags);
            if (n.parent != null) u32(n.parent);
            u8(n.r); u8(n.g); u8(n.b);
            if (n.name) { for (const b of enc.encode(n.name)) u8(b); u8(0); }
        }
        u32(0);
        u16(destroys.length);
        for (const id of destroys) u32(id);
        return new Uint8Array(bytes).buffer;
    };
    const send = packet => g.network.onMessage({ data: build(packet) });

    // An empty corner, sized to the current view so the whole crowd is on screen
    const b = g.border;
    const cx = b[1] - (b[1] - b[0]) * 0.15;
    const cy = b[2] + (b[3] - b[2]) * 0.15;
    g.camera.x = g.camera.targetX = cx;
    g.camera.y = g.camera.targetY = cy;
    const w = g.width / (2 * g.camera.renderZoom) * 0.75;
    const h = g.height / (2 * g.camera.renderZoom) * 0.75;

    let next = 0;
    const id = () => BASE + (++next);
    const colour = () => ({ r: 50 + rnd(0, 200) | 0, g: 50 + rnd(0, 200) | 0, b: 50 + rnd(0, 200) | 0 });

    const cells = Array.from({ length: players }, () => ({ id: id(), x: cx + rnd(-w, w), y: cy + rnd(-h, h), size: rnd(60, 400) | 0, parent: OWNER, name: 'perfprobe', r: 200, g: 60, b: 60 }));
    const pellets = Array.from({ length: food }, () => ({ id: id(), x: cx + rnd(-w, w), y: cy + rnd(-h, h), size: 12, ...colour() }));
    const blobs = Array.from({ length: ejected }, () => ({ id: id(), x: cx + rnd(-w, w), y: cy + rnd(-h, h), size: 38, ejected: true, age: 99, ...colour() }));

    const realTick = Object.getOwnPropertyDescriptor(g.network, 'noteServerTick');
    g.network.noteServerTick = function () {};

    send({ nodes: [...cells, ...pellets, ...blobs] });

    const timer = setInterval(() => {
        for (const c of cells) { c.x += rnd(-60, 60); c.y += rnd(-60, 60); }
        const eats = [];
        for (let i = 0; i < churn && blobs.length; i++) {
            eats.push([cells[(rand() * cells.length) | 0].id, blobs.shift().id]);
        }
        for (let i = 0; i < churn; i++) {
            const c = cells[(rand() * cells.length) | 0];
            blobs.push({ id: id(), x: c.x + rnd(-300, 300), y: c.y + rnd(-300, 300), size: 38, ejected: true, age: 0, ...colour() });
        }
        // New ejections slide for a few ticks, as real ones do
        const moving = [];
        for (const e of blobs) { if (e.age < 4) { e.x += rnd(-80, 80); e.y += rnd(-80, 80); moving.push(e); } e.age++; }
        send({ eats, nodes: [...cells, ...moving] });
    }, 40);

    return {
        stop() {
            clearInterval(timer);
            const fake = [...g.nodes.keys()].filter(k => k >= BASE);
            if (fake.length) send({ destroys: fake });
            if (realTick) Object.defineProperty(g.network, 'noteServerTick', realTick);
            else delete g.network.noteServerTick;
        },
    };
}

console.log("gfPerfProbe ready - spectate, then run:  await gfPerfProbe({ scenario: 'churn4k' })");
