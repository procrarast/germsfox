/**
 *  Behaviour tests for the split queue, driving the REAL source from bundle.js against a fake
 *  clock (see splitharness.js). Run with:  node util/splittest.js
 */
const { fresh, advance, clock, Net, feedTicks, SPLIT_QUEUE_MAX, SPLIT_RUSH_COPIES, SPLIT_SPACING, TICK } = require('./splitharness.js');
const RUSH_SPACING = TICK / SPLIT_RUSH_COPIES;
// A rushed run short of the cap is trimmed so it covers exactly `count` ticks.
const TRIM = (c) => (c - 1) * SPLIT_RUSH_COPIES + 1;
const now = () => clock.now;

// ---- assertions -------------------------------------------------------------------------
let failures = 0;
function check(name, cond, detail) {
    if (cond) { console.log(`  ok   ${name}`); }
    else { console.log(`  FAIL ${name}${detail ? ' -> ' + detail : ''}`); failures++; }
}
// Gaps between consecutive packets, rounded - the fake clock is exact so these are exact.
const gaps = (g) => g.sentAt.slice(1).map((t, i) => Math.round(t - g.sentAt[i]));


console.log(`\nspacing: paced=${SPLIT_SPACING}ms  rush=${RUSH_SPACING.toFixed(1)}ms  cap=${SPLIT_QUEUE_MAX}\n`);

// --- 1. the reported bug: rushed 4x then paced 3x, pressed together ----------------------
console.log('1. rushed 4x + paced 3x (the reported bug)');
{
    const g = fresh('Self Feed', 1);
    g.queueSplits(4, true);      // 16x key in Self Feed -> rushed
    g.queueSplits(3, false);     // 3x macro, same instant
    check('queue holds 7 logical splits, not 8 and not 4', g.queuedSplits === 7, `got ${g.queuedSplits}`);
    advance(now() + 5000);
    const expected = TRIM(4) + 3;
    check(`sends ${expected} packets (${TRIM(4)} trimmed rush copies + 3 paced)`, g.sentAt.length === expected, `got ${g.sentAt.length}`);

    const gg = gaps(g);
    const rushGaps = gg.slice(0, TRIM(4) - 1);
    const boundary = gg[TRIM(4) - 1];
    const pacedGaps = gg.slice(TRIM(4));
    check('rush copies stay at tick/3', rushGaps.every(x => x === Math.round(RUSH_SPACING)), JSON.stringify(rushGaps));
    check('boundary into the paced run takes a full splitSpacing', boundary === SPLIT_SPACING, `got ${boundary}`);
    check('paced splits keep splitSpacing, not the rush cadence',
        pacedGaps.every(x => x === SPLIT_SPACING), JSON.stringify(pacedGaps));
}

// --- 2. reverse order: paced 3x then rushed 4x -------------------------------------------
console.log('\n2. paced 3x + rushed 4x (reverse order)');
{
    const g = fresh('Self Feed', 1);
    g.queueSplits(3, false);
    // An idle queue releases immediately, so one of the three is already on the wire and off
    // the queue by the time the second press lands - 2 left + 4 rushed = 6 still queued.
    check('first of the 3 is already gone', g.sentAt.length === 1, `got ${g.sentAt.length}`);
    g.queueSplits(4, true);
    check('queue holds the remaining 6 logical splits', g.queuedSplits === 6, `got ${g.queuedSplits}`);
    check('queue never exceeds the ceiling', g.queuedSplits <= SPLIT_QUEUE_MAX);
    advance(now() + 5000);
    check(`sends 3 + ${TRIM(4)} packets`, g.sentAt.length === 3 + TRIM(4), `got ${g.sentAt.length}`);
    const gg = gaps(g);
    check('the 3 paced splits are not dragged into the rush cadence',
        gg.slice(0, 2).every(x => x === SPLIT_SPACING), JSON.stringify(gg.slice(0, 2)));
    check('rush run runs at tick/3 once it starts',
        gg.slice(3).every(x => x === Math.round(RUSH_SPACING)), JSON.stringify(gg.slice(3)));
}

// --- 3. chained rush must stay continuous ------------------------------------------------
console.log('\n3. rushed 4x + rushed 4x (the Self Feed chain)');
{
    const g = fresh('Self Feed', 1);
    g.queueSplits(4, true);
    g.queueSplits(4, true);
    check('fills the queue to exactly 8', g.queuedSplits === SPLIT_QUEUE_MAX, `got ${g.queuedSplits}`);
    advance(now() + 5000);
    check(`sends 2 x ${TRIM(4)} packets`, g.sentAt.length === 2 * TRIM(4), `got ${g.sentAt.length}`);
    check('rush -> rush boundary stays blanketed (no paced stall)',
        gaps(g).every(x => x === Math.round(RUSH_SPACING)), JSON.stringify(gaps(g)));
}

// --- 4. the cap -------------------------------------------------------------------------
console.log('\n4. the 8-split ceiling');
{
    const g = fresh('Self Feed', 1);
    g.queueSplits(4, true);
    g.queueSplits(4, true);
    g.queueSplits(4, true);          // third press: no room
    check('a press past the cap adds nothing', g.queuedSplits === SPLIT_QUEUE_MAX, `got ${g.queuedSplits}`);
    advance(now() + 6000);
    check(`still only 2 x ${TRIM(4)} packets`, g.sentAt.length === 2 * TRIM(4), `got ${g.sentAt.length}`);
}
{
    const g = fresh('FFA', 1);
    let peak = 0;
    for (let i = 0; i < 20; i++) { g.queueSplits(1); peak = Math.max(peak, g.queuedSplits); }
    check('queued never exceeds 8 at any point', peak === SPLIT_QUEUE_MAX, `peak ${peak}`);
    advance(now() + 3000);
    // 20 presses collapse to the one that went out instantly plus a full queue behind it. The
    // ceiling is on splits waiting, not on splits ever sent, so 9 is the right total.
    check('held key sends 1 immediate + 8 queued, and no more',
        g.sentAt.length === SPLIT_QUEUE_MAX + 1, `got ${g.sentAt.length}`);
    check('held key splits are all paced', gaps(g).every(x => x === SPLIT_SPACING), JSON.stringify(gaps(g)));
}
{
    const g = fresh('Self Feed', 1);
    g.queueSplits(6, false);         // one fires instantly, 5 left queued
    g.queueSplits(4, true);          // room is 3, so the 4x is clamped to 3
    check('partial press is clamped, not dropped', g.queuedSplits === SPLIT_QUEUE_MAX, `got ${g.queuedSplits}`);
    check('clamped run is still rushed', g.splitQueue[g.splitQueue.length - 1].copies > 1);
    advance(now() + 6000);
    check(`clamped rush sends 6 paced + ${TRIM(3)}`, g.sentAt.length === 6 + TRIM(3), `got ${g.sentAt.length}`);
}

// --- 5. never shrinks the queue (the min() bug) ------------------------------------------
console.log('\n5. a later press never destroys queued splits');
{
    const g = fresh('Self Feed', 1);
    g.queueSplits(4, true);
    const before = g.queuedSplits;
    const packetsBefore = g.splitQueue.reduce((a, r) => a + r.left, 0);
    g.queueSplits(3, false);
    const packetsAfter = g.splitQueue.reduce((a, r) => a + r.left, 0);
    check('logical count only grows', g.queuedSplits >= before, `${before} -> ${g.queuedSplits}`);
    check('no rush copies destroyed', packetsAfter > packetsBefore, `${packetsBefore} -> ${packetsAfter}`);
}

// --- 6. single press and idle-queue latency ----------------------------------------------
console.log('\n6. single press behaviour');
{
    const g = fresh('FFA', 1);
    g.queueSplits(1);
    check('a lone press fires immediately, no pacing latency', g.sentAt.length === 1 && g.sentAt[0] === 1000,
        JSON.stringify(g.sentAt));
    check('a single split is never rushed', g.splitQueue.length === 0 && g.lastSplitRush === false);
}

// --- 7. splitsWillCap still auto-rushes, and flush clears everything ----------------------
console.log('\n7. auto-rush and flush');
{
    const g = fresh('FFA', 8);       // cap 16, 8 cells: 2 splits -> 32 >= 16, will cap
    g.queueSplits(2);
    check('auto-rush fires without the rush flag', g.splitQueue[0].copies > 1);
}
{
    const g = fresh('Self Feed', 1);
    g.queueSplits(4, true);
    g.queueSplits(4, true);
    advance(now() + 50);
    g.flushSplits();
    const sent = g.sentAt.length;
    advance(now() + 5000);
    check('flush drops the whole queue', g.queuedSplits === 0);
    check('nothing fires after a flush', g.sentAt.length === sent, `${sent} -> ${g.sentAt.length}`);
    check('flush clears the rush latch', g.lastSplitRush === false);
}

// --- 8. a rushed run covers exactly `count` ticks -----------------------------------------
console.log('\n8. blanket length pins the split count');
{
    // 1 cell, cap 200: 4 splits reach 16, so this rushes on intent without being near the cap
    const g = fresh('Self Feed', 1);
    g.queueSplits(4, true);
    check(`uncapped rush is trimmed to ${TRIM(4)} packets`, g.splitQueue[0].left + 1 === TRIM(4),
        `got ${g.splitQueue[0].left + 1}`);
    advance(now() + 3000);
    const span = g.sentAt[g.sentAt.length - 1] - g.sentAt[0];
    // Consuming ticks are those in (0, span + TICK]; pinned to N only when span === (N-1)*TICK
    check('span is exactly 3 ticks, so 4 ticks consume it at every phase',
        Math.abs(span - 3 * TICK) < 0.001, `span ${span.toFixed(1)}ms`);
}
{
    // 32 cells: 4 splits reach 512 >= 200, so overshoot is free and the blanket stays full
    const g = fresh('Self Feed', 32);
    g.queueSplits(4, true);
    check(`capped rush keeps the full ${4 * SPLIT_RUSH_COPIES} packets`,
        g.splitQueue[0].left + 1 === 4 * SPLIT_RUSH_COPIES, `got ${g.splitQueue[0].left + 1}`);
}
{
    // Trimmed runs do not divide evenly into splits, so the ceiling must not under-count them
    const g = fresh('Self Feed', 1);
    g.queueSplits(4, true);
    g.queueSplits(4, true);
    check('two trimmed 4x still fill the queue to exactly 8, not 9',
        g.queuedSplits === SPLIT_QUEUE_MAX, `got ${g.queuedSplits}`);
    g.queueSplits(4, true);
    advance(now() + 4000);
    check('a third press past the ceiling still adds nothing',
        g.sentAt.length === 2 * TRIM(4), `got ${g.sentAt.length}`);
}

// --- 9. the margin is measured, and only ever widens ---------------------------------------
console.log('\n9. split margin adapts to the line, downward never');
{
    // us.germs.io measured at 2.05ms arrival SD over 839 packets - a clean line
    // Asserted on the margin, not the absolute spacing: tickPeriod is an EMA of a jittered
    // signal, so it wanders a few hundredths even when the rate is exactly 40.
    const MARGIN = SPLIT_SPACING - TICK;
    const SEEDS = Array.from({ length: 25 }, (_, i) => i + 1);
    const worst = (fn) => SEEDS.map(fn).sort((a, b) => b - a)[0];

    // us.germs.io measured at 2.05ms arrival SD over 839 packets - a clean line
    for (const sd of [0, 2.05]) {
        const off = worst(seed => Math.abs(feedTicks(new Net(), { sd, seed }).splitSpacing
                                         - feedTicks(new Net(), { sd, seed }).tickPeriod - MARGIN));
        check(`arrival SD ${sd}ms leaves the margin at the tuned ${MARGIN}ms, all ${SEEDS.length} seeds`,
            off < 0.01, `worst deviation ${off.toFixed(3)}`);
    }
    const narrowest = SEEDS.map(seed => feedTicks(new Net(), { sd: 6, seed }).splitSpacing)
        .sort((a, b) => a - b)[0];
    check('three times the jitter widens the margin, every seed',
        narrowest > SPLIT_SPACING + 4, `narrowest ${narrowest.toFixed(1)}`);
    const widest = worst(seed => feedTicks(new Net(), { sd: 12, seed }).splitSpacing);
    check('and it still stops at SPLIT_SPACING_MAX', widest <= 90.001, `got ${widest.toFixed(1)}`);

    // The rate estimate has to survive the jitter it is measuring. Tolerance is set from the
    // estimator's actual spread across seeds, not from a guess - it was 0.5ms, which flaked 20%.
    const rateErr = worst(seed => Math.abs(feedTicks(new Net(), { sd: 6, seed }).tickPeriod - TICK));
    check('tickPeriod still lands on the real rate under heavy jitter, every seed',
        rateErr < 1.5, `worst error ${rateErr.toFixed(2)}ms`);
}
{
    // A stall must not drag the phase estimate a slot sideways
    const worstStall = Array.from({ length: 25 }, (_, i) => {
        const n = feedTicks(new Net(), { sd: 2, seed: i + 1 });
        const before = n.splitSpacing;
        clock.now += 500; n.noteServerTick();      // one long hiccup
        feedTicks(n, { sd: 2, ticks: 200, seed: i + 100 });
        return Math.abs(n.splitSpacing - before);
    }).sort((a, b) => b - a)[0];
    check('a 500ms stall does not poison the margin, every seed',
        worstStall < 2, `worst shift ${worstStall.toFixed(2)}ms`);
}

console.log(failures ? `\n${failures} FAILURE(S)\n` : '\nall checks passed\n');
process.exit(failures ? 1 : 0);
