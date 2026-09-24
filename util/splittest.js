/**
 *  Behaviour tests for SplitScheduler, driving the REAL source from bundle.js against a fake
 *  clock and a simulated server (see splitharness.js). Run with:  node util/splittest.js
 */
const { world, clock, LIVE_SLIP, C } = require('./splitharness.js');

let failures = 0;
function check(name, cond, detail) {
    if (cond) console.log(`  ok   ${name}`);
    else { console.log(`  FAIL ${name}${detail ? ' -> ' + detail : ''}`); failures++; }
}
const gaps = (times) => times.slice(1).map((t, i) => t - times[i]);
const near = (a, b) => Math.abs(a - b) < 1e-6;
const sweep = (fn, { phases = 40, seeds = 1 } = {}) => {
    const out = [];
    for (let p = 0; p < phases; p++) for (let seed = 1; seed <= seeds; seed++) out.push(fn(p + 0.37, seed));
    return out;
};

// ---------------------------------------------------------------------------------------
console.log('\n1. exact splits (Space, 2x, 3x) are closed-loop');
{
    const w = world();
    w.run(500);
    const t0 = clock.now;
    w.splits.queue(1);
    check('an idle single split goes out immediately', w.server.sent.length === 1 && w.server.sent[0] === t0);
}
{
    const w = world();
    w.run(500);
    w.splits.queue(3);
    check('3x sends only its first split up front', w.server.sent.length === 1);
    w.run(40);
    check('...and nothing more before the server has confirmed it', w.server.sent.length === 1,
        `${w.server.sent.length} sent`);
    w.run(2000);
    check('3x sends exactly three packets', w.server.sent.length === 3, `${w.server.sent.length}`);
    check('3x performs exactly three splits', w.server.splitTicks.length === 3, `${w.server.splitTicks.length}`);
    const ticks = w.server.splitTicks;
    check('no two splits share a tick', new Set(ticks).size === ticks.length, JSON.stringify(ticks));
}
{
    const counts = sweep((phase, seed) => {
        const w = world({ phase, seed, slip: LIVE_SLIP });
        w.run(500); w.splits.queue(3); w.run(3000);
        return w.server.splitTicks.length;
    }, { seeds: 50 });
    check('3x is exactly three at every phase under the live slip (2,000 draws)',
        counts.every(n => n === 3), JSON.stringify(counts.filter(n => n !== 3).slice(0, 5)));
}
{
    const counts = sweep((phase, seed) => {
        const w = world({ phase, seed, slip: { one: 0.3, two: 0.12 } });
        w.run(500); w.splits.queue(2); w.run(3000);
        return w.server.splitTicks.length;
    }, { seeds: 50 });
    check('2x is exactly two on a line twice as bad as the live one',
        counts.every(n => n === 2), JSON.stringify(counts.filter(n => n !== 2).slice(0, 5)));
}
{
    // 16 own-cell packets in one tick are one split, not sixteen confirmations
    const w = world({ cells: 8 });
    w.run(500);
    w.splits.queue(2);
    w.run(2000);
    check('a split into many cells confirms once (8 -> 32 cells is 2 splits)',
        w.server.splitTicks.length === 2 && w.server.cells === 32, `${w.server.splitTicks.length}, ${w.server.cells} cells`);
}

// ---------------------------------------------------------------------------------------
console.log('\n2. an exact split that cannot happen is given up on, never re-sent');
{
    // Cells too small to divide: the server takes each packet and performs nothing
    const w = world({ frozen: true });
    w.run(500);
    w.splits.queue(3);
    w.run(3000);
    check('with nothing able to split, 3x still sends exactly three packets', w.server.sent.length === 3, `${w.server.sent.length}`);
    check('...one confirm window apart', gaps(w.server.sent).every(g => near(g, w.splits.confirmWindow)),
        JSON.stringify(gaps(w.server.sent)));
    check('...and the queue empties rather than hanging', w.splits.queued === 0 && !w.splits.awaiting);
    w.splits.queue(1);
    check('a press afterwards goes out at once', w.server.sent.length === 4 && w.server.sent[3] === clock.now);
}

// ---------------------------------------------------------------------------------------
console.log('\n3. the line is learned from lone splits');
{
    const w = world({ up: 28, down: 29 });
    check('latency starts at the default', w.splits.latency === C.SPLIT_LATENCY_DEFAULT);
    for (let i = 0; i < 30; i++) { w.run(123); w.splits.queue(1); w.run(300); }
    check('latency converges on the send-to-confirmation floor (57ms)',
        w.splits.latency >= 57 && w.splits.latency < 58, `${w.splits.latency.toFixed(2)}`);
    check('confirm window follows it', Math.abs(w.splits.confirmWindow - (w.splits.latency + (C.SPLIT_SLIP_TICKS + 1) * 40 + 10)) < 1e-9);
    check('a clean line reads a slip rate of zero', w.splits.slipRate === 0, `${w.splits.slipRate}`);
    check(`only the last ${C.SPLIT_SAMPLE_WINDOW} are kept`, w.splits.samples.length === C.SPLIT_SAMPLE_WINDOW);
}
{
    const w = world({ slip: { one: 0.3, two: 0 }, seed: 7 });
    for (let i = 0; i < 60; i++) { w.run(97); w.splits.queue(1); w.run(300); }
    const rate = w.splits.slipRate;
    check('a line slipping 30% reads roughly that', rate > 0.12 && rate < 0.5, `${rate.toFixed(2)}`);
    w.splits.forgetNetwork();
    check('a new connection forgets it', w.splits.samples.length === 0 && w.splits.latency === C.SPLIT_LATENCY_DEFAULT);
}

// ---------------------------------------------------------------------------------------
console.log('\n4. 16x blankets for speed');
const TRIM = (ticks) => (ticks - 1) * C.SPLIT_RUSH_COPIES + 1;
{
    const w = world();
    w.run(500);
    w.splits.queue(4, true);
    w.run(2000);
    check(`16x sends ${TRIM(4)} packets (trimmed blanket)`, w.server.sent.length === TRIM(4), `${w.server.sent.length}`);
    check('a third of a tick apart', gaps(w.server.sent).every(g => near(g, 40 / 3)), JSON.stringify(gaps(w.server.sent)));
}
{
    const counts = sweep((phase) => {
        const w = world({ phase });
        w.run(500); w.splits.queue(4, true); w.run(2000);
        return w.server.splitTicks.length;
    });
    check('on a clean line it is exactly four at every phase', counts.every(n => n === 4), JSON.stringify(counts));
}
{
    const w = world({ cells: 32, cap: 200 });
    w.run(500);
    w.splits.queue(4, true);
    w.run(2000);
    check('bound for the cap it keeps the full blanket', w.server.sent.length === 4 * C.SPLIT_RUSH_COPIES, `${w.server.sent.length}`);
}
{
    const w = world({ cells: 32, cap: 200 });
    w.run(500);
    w.splits.queue(3);
    check('a 3x that will reach the cap blankets too', w.splits.runs.length === 0 || w.splits.runs[0].blanket);
}

// ---------------------------------------------------------------------------------------
console.log('\n5. 16x makes up the splits it loses');
// Lone splits first, as ordinary Space presses would, so the latency floor is learned
const learn = (w) => {
    for (let i = 0; i < 10; i++) { w.run(113); w.splits.queue(1); w.run(300); }
};
const press16 = (opts = {}, { cells = 1, stall = null } = {}) => {
    const w = world({ ...opts, cap: opts.cap || 1e9 });
    w.server.skipOff = true;
    learn(w);
    w.server.skipOff = false;
    w.server.splitsDone = 0; w.server.skipped = 0;
    w.server.splitTicks.length = 0;
    w.server.cells = cells;
    w.run(500);
    const before = w.server.sent.length, t0 = clock.now;
    if (stall) w.server.stall = { from: t0 + stall[0], to: t0 + stall[1] };
    w.splits.queue(4, true);
    w.run(1500);
    return { w, packets: w.server.sent.length - before, splits: w.server.splitTicks.length };
};
{
    const counts = sweep((phase) => press16({ phase }).splits);
    check('a clean 16x is exactly four at every phase', counts.every(c => c === 4), JSON.stringify(counts));
    const { w, packets } = press16({});
    check('...and adds nothing', packets === TRIM(4) && w.splits.extensions === 0, `${packets} packets, ${w.splits.extensions} added`);
}
for (const drift of [39.9, 40.1]) {
    // The client's estimate of the tick drifts during the press - live it read 39.9-40.1 - so
    // copies laid out at one period are measured at another
    const counts = sweep((phase) => {
        const w = world({ phase });
        w.run(500); w.splits.queue(4, true);
        w.run(30); w.game.network.tickPeriod = drift;
        w.run(1500);
        return `${w.server.splitTicks.length}/${w.splits.extensions}`;
    });
    check(`the tick estimate moving to ${drift}ms mid-press adds nothing to a clean 16x`,
        counts.every(c => c === '4/0'), JSON.stringify(counts));
}
for (const n of [1, 2]) {
    // The nth split-bearing tick runs late: its copies collide with the next tick's
    const counts = sweep((phase) => press16({ phase, skip: (k) => k === n }).splits);
    check(`a late tick mid-run (split ${n + 1}) is made up - four at every phase`,
        counts.every(c => c === 4), JSON.stringify(counts));
}
{
    const counts = sweep((phase) => press16({ phase, skip: (k) => k === 3 }).splits);
    check('a late last tick loses nothing and is not made up - four at every phase',
        counts.every(c => c === 4), JSON.stringify(counts));
}
{
    const counts = sweep((phase) => press16({ phase, skip: (k) => k === 1 || k === 2 }).splits);
    check('two late ticks in one press are both made up', counts.every(c => c === 4), JSON.stringify(counts));
}
{
    // The live failure: the line holds the first 90ms of copies and delivers them in one burst
    const counts = sweep((phase) => press16({ phase }, { stall: [0, 90] }).splits);
    check('a stall at the start of the press is made up - at least four at every phase',
        counts.every(c => c >= 4), JSON.stringify(counts));
    check('...and usually exactly four', counts.filter(c => c === 4).length >= counts.length * 0.75,
        JSON.stringify(counts));
}
{
    const { packets } = press16({ cap: 2 });
    check(`a 16x that cannot finish stops after ${C.SPLIT_RUSH_EXTEND_MAX} extra ticks`,
        packets <= TRIM(4) + C.SPLIT_RUSH_EXTEND_MAX * C.SPLIT_RUSH_COPIES, `${packets}`);
}
{
    const { w } = press16({ cap: 200 }, { cells: 32 });
    check('a press bound for the cap is not watched', w.splits.extensions === 0 && !w.splits.watch);
}

// ---------------------------------------------------------------------------------------
console.log('\n6. the queue');
{
    const w = world({ cap: 1e9 });
    w.run(500);
    w.splits.queue(4, true);
    w.splits.queue(4, true);
    check('two 16x fill it to exactly eight', w.splits.queued === C.SPLIT_QUEUE_MAX, `${w.splits.queued}`);
    w.splits.queue(4, true);
    check('a third adds nothing', w.splits.queued === C.SPLIT_QUEUE_MAX, `${w.splits.queued}`);
    w.run(3000);
    check('chained blankets stay continuous, a third of a tick apart', gaps(w.server.sent).every(g => near(g, 40 / 3)),
        JSON.stringify(gaps(w.server.sent)));
}
{
    const w = world();
    w.run(500);
    for (let i = 0; i < 20; i++) w.splits.queue(1);
    check('a held key queues at most eight behind the one in flight', w.splits.queued === C.SPLIT_QUEUE_MAX, `${w.splits.queued}`);
    w.run(5000);
    check('...and sends nine in all, each after the last was confirmed',
        w.server.sent.length === C.SPLIT_QUEUE_MAX + 1 && w.server.splitTicks.length === C.SPLIT_QUEUE_MAX + 1,
        `${w.server.sent.length} sent, ${w.server.splitTicks.length} splits`);
}
{
    const w = world();
    w.run(500);
    w.splits.queue(6);        // one goes out, five wait
    w.splits.queue(4, true);  // room for three
    check('a press that only partly fits is clamped, not dropped', w.splits.queued === C.SPLIT_QUEUE_MAX, `${w.splits.queued}`);
}
{
    const w = world();
    w.run(500);
    w.splits.queue(4, true);
    w.splits.queue(1);
    w.run(3000);
    const s = w.server.sent;
    const last = TRIM(4) - 1;
    check('an exact split after a blanket waits a whole tick', near(s[last + 1] - s[last], 40),
        `${(s[last + 1] - s[last]).toFixed(2)}ms`);
    check('...so the 16x and the split both land', w.server.splitTicks.length === 5, `${w.server.splitTicks.length}`);
}
{
    const w = world();
    w.run(500);
    w.splits.queue(3);
    w.splits.queue(4, true);
    w.run(3000);
    check('a blanket queued behind an exact run waits for it, then all seven land',
        w.server.splitTicks.length === 7, `${w.server.splitTicks.length}`);
}
{
    const w = world();
    w.run(500);
    w.splits.queue(3);
    w.splits.queue(4, true);
    w.run(20);
    const sent = w.server.sent.length;
    w.splits.flush();
    w.run(3000);
    check('flush stops everything - nothing fires into the next life', w.server.sent.length === sent,
        `${sent} -> ${w.server.sent.length}`);
    check('...and leaves nothing waiting', w.splits.queued === 0 && !w.splits.awaiting && !w.splits.watch);
}

console.log(failures ? `\n${failures} FAILED\n` : '\nall checks passed\n');
process.exit(failures ? 1 : 0);
