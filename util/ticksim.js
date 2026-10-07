/**
 *  How many splits does a macro ACTUALLY produce?  Run with:  node util/ticksim.js
 *
 *  Packet timings come from the real queue code (splitharness.js). This adds the one server
 *  rule that matters: a tick takes at most one split and collapses anything else that arrived
 *  since the previous tick. That rule is the premise the whole pacing design rests on - see
 *  the SPLIT_JITTER_MARGIN comment, which records it being observed.
 *
 *  The client cannot control the tick phase, so the honest question is what the distribution
 *  over phases looks like, not what one lucky alignment gives.
 */
const { fresh, advance, clock, TICK, SPLIT_RUSH_COPIES, SPLIT_SPACING } = require('./splitharness.js');

// Distinct ticks receiving at least one packet = splits the server actually performs.
const splitsFor = (times, phase) => {
    const t0 = times[0];
    const hit = new Set();
    for (const t of times) hit.add(Math.ceil((t - t0 - phase) / TICK));
    return hit.size;
};

const distribution = (times) => {
    const counts = {};
    let total = 0;
    for (let phase = 0; phase < TICK; phase += 0.05) {
        const n = splitsFor(times, phase);
        counts[n] = (counts[n] || 0) + 1;
        total++;
    }
    return Object.entries(counts).sort((a, b) => a[0] - b[0])
        .map(([n, c]) => `${n} splits: ${(100 * c / total).toFixed(0)}%`).join('   ');
};

const press = (mode, cells, count, rush) => {
    const g = fresh(mode, cells);
    g.queueSplits(count, rush);
    advance(clock.now + 5000);
    return g.sentAt;
};

const report = (label, times) => {
    console.log(`  ${label}  ${String(times.length).padStart(2)} packets, span ` +
                `${(times[times.length-1]-times[0]).toFixed(0).padStart(3)}ms`);
    console.log(`     -> ${distribution(times)}\n`);
};

console.log(`\ntick ${TICK}ms   paced spacing ${SPLIT_SPACING}ms   rush copies ${SPLIT_RUSH_COPIES}\n`);
console.log('A press asks for N splits. What the server performs, over all tick phases:\n');

// cap 200, 1 cell: 4 splits reach 16, nowhere near capping, so this stays paced
report('4x paced   (Self Feed, 1 cell, no rush flag)', press('Self Feed', 1, 4, false));
// the 16x key: rush forced by MAX_SPLIT_MODES, still far short of the cap
report('4x RUSHED  (Self Feed 16x, 1 cell)          ', press('Self Feed', 1, 4, true));
// 32 cells: 4 splits reach 512 >= 200, so here the surplus really is free
report('4x RUSHED  (Self Feed 16x, 32 cells: CAPS)  ', press('Self Feed', 32, 4, true));
report('3x RUSHED  (1 cell)                         ', press('Self Feed', 1, 3, true));
report('2x RUSHED  (1 cell)                         ', press('Self Feed', 1, 2, true));

/**
 *  A run of P packets spans (P-1)*s, and the ticks that can consume it are those in
 *  (0, span + TICK]. That count is pinned to N for every phase only when span + TICK == N*TICK,
 *  i.e. span == (N-1)*TICK. The blanket currently runs a further (TICK - TICK/COPIES) past
 *  that, which is the whole of the overshoot.
 */
console.log('If the blanket ended on the last tick it must cover, instead of short of the next:\n');
const trimmed = (count) => {
    const s = TICK / SPLIT_RUSH_COPIES;
    return Array.from({ length: (count - 1) * SPLIT_RUSH_COPIES + 1 }, (_, i) => i * s);
};
const full = (count) => {
    const s = TICK / SPLIT_RUSH_COPIES;
    return Array.from({ length: count * SPLIT_RUSH_COPIES }, (_, i) => i * s);
};
for (const count of [2, 3, 4]) report(`${count}x rushed, trimmed                        `, trimmed(count));

/**
 *  ...but the above assumes packets land exactly when sent, and they do not. A nominal spacing
 *  S reaches the server at roughly S-14ms .. S+9ms (see SPLIT_JITTER_MARGIN). That matters
 *  asymmetrically: the full blanket has three packets covering every boundary it cares about,
 *  while a trimmed run's two end ticks hold a single packet each - and a single packet pushed
 *  across a boundary is a split LOST, not merely moved.
 *
 *  Overshooting is free once genuinely at the cap; undershooting never is. So this is the
 *  number that decides whether trimming is safe to apply unconditionally.
 */
/**
 *  Caveat: this draws jitter independently per packet, which is pessimistic. These ride one
 *  ordered WebSocket (so, TCP) connection, where a delay mostly shifts the whole burst - and a
 *  shared shift only changes the phase, which the sweep above already covers. Only the
 *  *differential* jitter between packets 13ms apart stretches the span, and that is far smaller
 *  than the end-to-end spread this uses. Read the undershoot column as a worst case, not an
 *  estimate; the measured span in the page drifts by well under a millisecond.
 */
const JITTER_LO = -14, JITTER_HI = 9, DRAWS = 4000;
const withJitter = (times) => times.map(t => t + JITTER_LO + Math.random() * (JITTER_HI - JITTER_LO));
const jitterDist = (times) => {
    const counts = {};
    for (let i = 0; i < DRAWS; i++) {
        const n = splitsFor(withJitter(times).sort((a, b) => a - b), Math.random() * TICK);
        counts[n] = (counts[n] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => a[0] - b[0])
        .map(([n, c]) => `${n}: ${(100 * c / DRAWS).toFixed(0)}%`).join('   ');
};
console.log(`With per-packet jitter of ${JITTER_LO}..+${JITTER_HI}ms, ${DRAWS} draws:\n`);
for (const count of [2, 3, 4]) {
    console.log(`  ${count}x asked`);
    console.log(`     full blanket (today) -> ${jitterDist(full(count))}`);
    console.log(`     trimmed              -> ${jitterDist(trimmed(count))}\n`);
}
