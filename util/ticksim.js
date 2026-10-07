/**
 *  How many splits does a macro ACTUALLY produce?  Run with:  node util/ticksim.js
 *
 *  Drives the real SplitScheduler (see splitharness.js) against the simulated server, over
 *  every tick phase and many slip draws, and reports the distribution of splits performed and
 *  when the last one's confirmation arrived (the moment the player can see it happened).
 *
 *  The model is only worth anything if it reproduces what was measured live, so section 1
 *  replays the schedules the live trials used - the old paced 58ms 3x and the trimmed 16x
 *  blanket - beside the live numbers. If those stop agreeing, fix the model before believing
 *  anything in section 2.
 */
const { world, clock, LIVE_SLIP, C } = require('./splitharness.js');

const PHASES = 40, SEEDS = 60;

function distribution(fn) {
    const counts = {}, times = [];
    let n = 0;
    for (let p = 0; p < PHASES; p++) {
        for (let seed = 1; seed <= SEEDS; seed++) {
            const { splits, time } = fn(p * 40 / PHASES + 0.37, seed);
            counts[splits] = (counts[splits] || 0) + 1;
            if (time != null) times.push(time);
            n++;
        }
    }
    times.sort((a, b) => a - b);
    const pct = Object.entries(counts).sort((a, b) => a[0] - b[0])
        .map(([k, v]) => `${k}: ${(100 * v / n).toFixed(0).padStart(3)}%`).join('   ');
    return pct + (times.length ? `     median ${Math.round(times[times.length >> 1])}ms` : '');
}

/** Sends an open-loop schedule straight at the server, as the live trials did. */
function openLoop(offsets, { slip, phase, seed }) {
    const w = world({ slip, phase, seed });
    w.run(1000);
    const t0 = clock.now;
    for (const t of offsets) {
        w.run(t0 + t - clock.now);
        w.game.network.send();
    }
    w.run(1000);
    return { splits: w.server.splitTicks.length };
}

const paced = (n) => Array.from({ length: n }, (_, i) => i * 58);
const trimmedBlanket = (n) => Array.from({ length: (n - 1) * 3 + 1 }, (_, i) => i * 40 / 3);

console.log('\n1. The model against what was measured live (slip: a tick late 17%, two 6%)\n');
console.log('   old paced 3x (58ms)   model  ' + distribution((phase, seed) => openLoop(paced(3), { slip: LIVE_SLIP, phase, seed })));
console.log('                         live   2:  39%   3:  61%                 (23 presses)');
console.log('   16x trimmed blanket   model  ' + distribution((phase, seed) => openLoop(trimmedBlanket(4), { slip: LIVE_SLIP, phase, seed })));
console.log('                         live   3:  14%   4:  73%   5:  14%       (22 presses)');

/**
 *  A press through the real scheduler, optionally after `learn` earlier 16x presses on the
 *  same line.
 */
function press(count, rush, { slip, phase, seed, learn = 0 }) {
    const w = world({ slip, phase, seed });
    for (let i = 0; i < learn; i++) { w.server.cells = 1; w.splits.queue(4, true); w.run(600); }
    w.server.splitTicks.length = 0;
    w.server.reportedAt.length = 0;
    w.server.cells = 1;
    w.run(1000);
    const t0 = clock.now;
    w.splits.queue(count, rush);
    w.run(2000);
    const reports = w.server.reportedAt;
    return { splits: w.server.splitTicks.length, time: reports.length >= count ? reports[count - 1] - t0 : null };
}

const LINES = [
    ['clean line', { one: 0, two: 0 }],
    ['live slip, 17% / 6%', LIVE_SLIP],
    ['bad line, 30% / 12%', { one: 0.30, two: 0.12 }],
];
for (const [label, slip] of LINES) {
    console.log(`\n2. SplitScheduler, ${label}\n`);
    console.log('   2x exact              ' + distribution((phase, seed) => press(2, false, { slip, phase, seed })));
    console.log('   3x exact              ' + distribution((phase, seed) => press(3, false, { slip, phase, seed })));
    console.log('   16x blanket           ' + distribution((phase, seed) => press(4, true, { slip, phase, seed })));
    console.log(`   16x, line learned     ` + distribution((phase, seed) => press(4, true, { slip, phase, seed, learn: 8 })));
}
console.log(`\n   ("line learned": 8 earlier 16x presses first.)`);
console.log('   Section 1 shows this model gets the open-loop blanket\'s odds wrong, so read the 16x rows as');
console.log('   a check that the adaptation engages and in which direction - not as a forecast.\n');
