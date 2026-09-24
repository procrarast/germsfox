/**
 *  Runs the REAL SplitScheduler out of bundle.js against a fake clock and a simulated server.
 *
 *  The scheduler's source is lifted verbatim, so a test that passes here passes in the game.
 *  The server is a model, and every rule in it is one measured live (see the SplitScheduler
 *  comment in bundle.js and OUTLINE's measured facts):
 *
 *  - It ticks every PERIOD ms and performs at most one split per tick; any other split packet
 *    processed in that tick is dropped.
 *  - A packet reaches it UP ms after it is sent and its reports reach us DOWN ms after the
 *    tick that performed it, so send-to-confirmation is never less than UP + DOWN (~57ms).
 *  - It sometimes performs a split one or two ticks late (`slip`), and processes packets in
 *    order, so a late packet holds back the ones behind it.
 *  - A tick's own-cell reports arrive just ahead of that tick's node packet.
 *
 *  Used by splittest.js (behaviour) and ticksim.js (distributions over phase and slip).
 */
const fs = require('fs');
const path = require('path');

const BUNDLE = path.join(__dirname, '..', 'src', 'overrides', 'bundle.js');
const bundle = fs.readFileSync(BUNDLE, 'utf8');

// Constants are read from the bundle rather than restated, so changing one there fails these
// instead of silently testing stale numbers.
const constOf = (name) => {
    const m = bundle.match(new RegExp('const ' + name + ' = ([\\d.]+);'));
    if (!m) throw new Error('constant not found in bundle.js: ' + name);
    return Number(m[1]);
};

function classSource(name) {
    const start = bundle.indexOf(`        class ${name} {`);
    if (start < 0) throw new Error(`class ${name} not found in bundle.js - the harness anchor moved`);
    let depth = 0;
    for (let i = start; i < bundle.length; i++) {
        if (bundle[i] === '{') depth++;
        else if (bundle[i] === '}' && --depth === 0) return bundle.slice(start, i + 1);
    }
    throw new Error(`class ${name} never closes`);
}

const C = {};
for (const name of ['SPLIT_QUEUE_MAX', 'SPLIT_RUSH_COPIES', 'SPLIT_LATENCY_DEFAULT', 'SPLIT_SLIP_TICKS',
                    'SPLIT_SAMPLE_WINDOW', 'SPLIT_SAMPLES_MIN', 'SPLIT_RUSH_EXTEND_MAX']) {
    C[name] = constOf(name);
}

// ---- fake clock -------------------------------------------------------------------------
const clock = { now: 0, timers: [], nextId: 1 };
const performance = { now: () => clock.now };
const setTimeout_ = (fn, ms) => {
    const t = { id: clock.nextId++, at: clock.now + Math.max(0, ms || 0), fn };
    clock.timers.push(t);
    return t.id;
};
const clearTimeout_ = (id) => { clock.timers = clock.timers.filter(t => t.id !== id); };

/** Runs every timer and scheduled event due up to `to`, in time order. */
function advance(to) {
    while (true) {
        let next = null;
        for (const t of clock.timers) if (t.at <= to && (!next || t.at < next.at)) next = t;
        if (!next) break;
        clock.timers = clock.timers.filter(t => t !== next);
        clock.now = next.at;
        next.fn();
    }
    clock.now = to;
}

const packet = { Split: class Split {} };
const SplitScheduler = new Function(
    ...Object.keys(C), 'packet', 'performance', 'setTimeout', 'clearTimeout',
    `return ${classSource('SplitScheduler').trim()};`
)(...Object.values(C), packet, performance, setTimeout_, clearTimeout_);

// ---- seeded randomness ------------------------------------------------------------------
function rng(seed) {
    let z = (seed * 0x9e3779b9) >>> 0;
    return () => {
        z = (z + 0x6d2b79f5) >>> 0;
        let t = z;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** Slip measured live for lone splits: a tick late ~17%, two ticks ~6%. */
const LIVE_SLIP = { one: 0.17, two: 0.06 };

/**
 *  A server plus a game stub around one SplitScheduler.
 *
 *  `phase` places the server's tick grid against the client clock. `cells`/`cap` bound how
 *  many splits can actually happen, the way the cell cap does in the game.
 */
function world({ period = 40, up = 28, down = 29, phase = 0, slip = { one: 0, two: 0 },
                 cells = 1, cap = 1e9, frozen = false, skip = null, seed = 1 } = {}) {
    clock.now = 0;
    clock.timers = [];
    const random = rng(seed);

    const server = {
        cells, cap,
        sent: [],            // client send times
        splitTicks: [],      // server tick indices that performed a split
        reportedAt: [],      // client time each split's report arrived
        lastTick: -Infinity, // in-order processing: no packet is performed before an earlier one
        pending: new Map(),  // tick index -> packets processed in it
        tickAt: (k) => phase + k * period,
        splitsDone: 0,
        skipped: 0,
    };

    const game = {
        network: {
            tickPeriod: period,
            send() {
                const at = clock.now;
                server.sent.push(at);
                // `server.stall`: the line holds everything sent in [from, to] and delivers it
                // in one burst when it clears - the other way a max split was seen to lose splits
                const stall = server.stall;
                const arrives = stall && at >= stall.from && at <= stall.to ? stall.to + up : at + up;
                // The first tick at or after its arrival, plus any slip, but never ahead of
                // the packet in front of it
                let k = Math.ceil((arrives - phase) / period);
                const r = random();
                if (r < slip.two) k += 2;
                else if (r < slip.two + slip.one) k += 1;
                k = Math.max(k, server.lastTick);
                server.lastTick = k;
                server.pending.set(k, (server.pending.get(k) || 0) + 1);
            },
        },
        splitsWillCap(count) {
            return server.cells * Math.pow(2, count) >= server.cap;
        },
    };

    const splits = new SplitScheduler(game);
    game.splits = splits;

    // Every server tick: perform at most one split, then report it DOWN ms later - own-cell
    // packets first, then the tick's node packet.
    let k = Math.ceil(-phase / period);
    const scheduleTick = () => {
        const at = server.tickAt(k);
        const index = k;
        setTimeout_(() => {
            let grew = 0;
            /**
             *  `skip(n)`: the server's nth split-bearing tick runs late - it performs nothing
             *  and its packets are performed with the next tick's, where only one can count.
             *  That is a skip, the way a max split loses a split live.
             */
            if (server.pending.has(index) && skip && !server.skipOff && skip(server.splitsDone + server.skipped)) {
                server.skipped++;
                server.pending.set(index + 1, (server.pending.get(index + 1) || 0) + server.pending.get(index));
                server.pending.delete(index);
            }
            // `frozen`: cells too small to divide - the server takes the packet and does nothing
            if (server.pending.has(index) && !frozen && server.cells * 2 <= server.cap) {
                server.splitsDone++;
                grew = server.cells;
                server.cells *= 2;
                server.splitTicks.push(index);
            }
            server.pending.delete(index);
            setTimeout_(() => {
                if (grew) server.reportedAt.push(clock.now);
                for (let i = 0; i < grew; i++) splits.onOwnCell();
                splits.onTick();
            }, down);
            k++;
            scheduleTick();
        }, at - clock.now);
    };
    scheduleTick();

    return { splits, server, game, run: (ms) => advance(clock.now + ms) };
}

module.exports = { world, clock, advance, performance, rng, SplitScheduler, C, LIVE_SLIP };
