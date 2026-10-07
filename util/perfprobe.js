/**
 *  Measures where a frame's JavaScript goes, live or under a synthetic crowd.
 *
 *  Paste into the germs.io PAGE console (not the extension's) while spectating, then:
 *
 *      await gfPerfProbe()                        // the lobby as it is
 *      await gfPerfProbe({ scenario: 'churn4k' }) // ~5.5k nodes, 7,500 spawns+eats a second
 *
 *  Scenarios: 'live', 'static2k', 'churn2k', 'churn4k', 'split200', or an object of the same
 *  shape as the presets below. Every perf change should quote the same scenario before and after.
 *
 *  'split200' is the max split in a self-feed mode: one named, skinned player goes from one cell
 *  to two hundred within a couple of ticks, flies apart, and merges back, every few seconds. That
 *  cost is a spike, not a level - the means barely move - so it is reported separately as
 *  `burst*`: frames inside a window after each burst begins, and the worst of them.
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
        split200: { players: 20, food: 1000, ejected: 200, churn: 10,
            burst: { cells: 200, ticks: 2, every: 2500, life: 1200 } },
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
        patch(g.network, 'handleNodes', timed(d => { if (on) packets.push({ t: now(), d }); }));

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
        const packetMs = packets.map(p => p.d);

        /**
         *  Frame to frame, start to start. Catches what the JS timings above cannot: a frame
         *  whose own work was cheap but that waited on the GPU, a GC pause, or a long packet
         *  handled between two frames. At 60Hz this reads ~16.7, and its max is the hitch a
         *  player actually feels.
         */
        const gaps = [];
        for (let i = 1; i < frames.length; i++) gaps.push(frames[i].t0 - frames[i - 1].t0);
        const tail = v => v.length ? `${q(v, 0.99).toFixed(1)} / max ${Math.max(...v).toFixed(1)}` : null;

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
            handleNodesMs: packets.length ? `${mean(packetMs).toFixed(3)} / p95 ${q(packetMs, 0.95).toFixed(3)}` : null,
            gapMs: gaps.length ? `${mean(gaps).toFixed(2)} / p99 ${tail(gaps)}` : null,
            worstTotalMs: tail(frames.map(f => f.total)),
            worstHandleNodesMs: tail(packetMs),
        });

        // Frames and packets in the BURST_WINDOW after each burst began
        const starts = (stress?.bursts ?? []).filter(t => t >= w0);
        if (starts.length) {
            const inBurst = t => starts.some(s => t >= s && t < s + BURST_WINDOW);
            const bf = frames.filter(f => inBurst(f.t0));
            const bg = [];
            for (let i = 1; i < frames.length; i++) if (inBurst(frames[i].t0)) bg.push(frames[i].t0 - frames[i - 1].t0);
            const bp = packets.filter(p => inBurst(p.t)).map(p => p.d);
            Object.assign(result, {
                bursts: starts.length,
                burstFrames: bf.length,
                burstTotalMs: `${mean(bf.map(f => f.total)).toFixed(3)} / ${tail(bf.map(f => f.total))}`,
                burstLoopMs: `${mean(bf.map(f => f.loop ?? 0)).toFixed(3)} / ${tail(bf.map(f => f.loop ?? 0))}`,
                burstRenderMs: `${mean(bf.map(f => f.render ?? 0)).toFixed(3)} / ${tail(bf.map(f => f.render ?? 0))}`,
                burstGapMs: tail(bg),
                burstHandleNodesMs: tail(bp),
            });
        }
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

// How long after a burst begins its frames count as burst frames: the split, the flight apart,
// and the first frames of the new cells' labels and skins all land inside it
const BURST_WINDOW = 500;

/**
 *  A deterministic crowd, fed through the real packet handler at 25Hz: `players` cells of one
 *  owner random-walking, `food` static pellets, `ejected` blobs, and `churn` ejections per tick
 *  - each one eaten by a player a few ticks later, so the fade and the pool both run.
 *
 *  `burst`, if given, adds one more player who max-splits every `every` ms: `cells` pieces
 *  arriving over `ticks` ticks, flying apart, then all eaten back into the first after `life` ms
 *  - the merge is a churn spike of its own. Named and wearing a skin borrowed from whoever in
 *  the real lobby has one, so name labels, skin holds and mass labels are all on the path.
 */
function startStress(g, { players, food, ejected, churn, burst = null }, seed) {
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
            if (n.skin) flags |= 4;
            if (n.name) flags |= 8;
            u8(flags);
            if (n.parent != null) u32(n.parent);
            u8(n.r); u8(n.g); u8(n.b);
            // The client drops the first character of a skin - see handleNodes()
            if (n.skin) { for (const b of enc.encode('%' + n.skin)) u8(b); u8(0); }
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

    // ---- the max-split player -------------------------------------------------------------------
    const BURST_OWNER = 0x7fff0002;
    const TICK = 40;
    const bursts = [];
    const borrowedSkin = [...g.nodes.values()].find(n => n.skin && n.id < BASE)?.skin ?? null;
    const splitter = burst && { mother: null, pieces: [], tick: 0, merging: 0,
        period: Math.max(1, Math.round(burst.every / TICK)), life: Math.round(burst.life / TICK) };
    const piece = (x, y, size) => ({ id: id(), x, y, size: Math.max(30, size | 0), parent: BURST_OWNER,
        name: 'max split', skin: borrowedSkin, r: 60, g: 140, b: 220, vx: 0, vy: 0 });

    // Returns this tick's eats and changed nodes for the splitter
    const burstTick = () => {
        const sp = splitter, out = { eats: [], nodes: [] };
        if (!sp.mother) sp.mother = piece(cx, cy, 1100);
        const phase = sp.tick++ % sp.period;
        const m = sp.mother;

        if (phase === 0 && !sp.pieces.length) bursts.push(performance.now());
        if (phase < burst.ticks) {
            // Mass is kept: the mother shrinks to one piece's size as the rest appear
            const each = Math.sqrt(1100 * 1100 / burst.cells);
            const n = Math.ceil((burst.cells - 1) / burst.ticks);
            for (let i = 0; i < n && sp.pieces.length < burst.cells - 1; i++) {
                const a = rand() * Math.PI * 2, v = rnd(40, 160);
                const p = piece(m.x, m.y, each);
                p.vx = Math.cos(a) * v; p.vy = Math.sin(a) * v;
                sp.pieces.push(p);
            }
            m.size = each | 0;
        }
        for (const p of sp.pieces) { p.x += p.vx; p.y += p.vy; p.vx *= 0.8; p.vy *= 0.8; }

        // Merge back over two ticks, the mother growing as she goes
        if (phase === sp.life && sp.pieces.length) {
            const half = Math.ceil(sp.pieces.length / 2);
            for (const p of sp.pieces.splice(0, half)) out.eats.push([m.id, p.id]);
            sp.merging = 1;
        } else if (sp.merging && sp.pieces.length) {
            for (const p of sp.pieces.splice(0)) out.eats.push([m.id, p.id]);
            sp.merging = 0;
            m.size = 1100;
        }
        out.nodes.push(m, ...sp.pieces);
        return out;
    };

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
        const split = splitter ? burstTick() : { eats: [], nodes: [] };
        send({ eats: [...eats, ...split.eats], nodes: [...cells, ...moving, ...split.nodes] });
    }, TICK);

    return {
        bursts,
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
