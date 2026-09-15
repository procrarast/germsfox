/**
 *  Runs the REAL split-queue source out of bundle.js against a fake clock and a fake socket.
 *
 *  Nothing here reimplements the queue: queueSplits/pumpSplits/releaseSplit/flushSplits and
 *  splitsWillCap are lifted verbatim, so a test that passes here passes in the game. Used by
 *  splittest.js (behaviour) and ticksim.js (how many splits a press actually produces).
 */
const fs = require('fs');
const path = require('path');

const BUNDLE = path.join(__dirname, '..', 'src', 'overrides', 'bundle.js');
const bundle = fs.readFileSync(BUNDLE, 'utf8');

// Pacing constants are read from the bundle rather than restated, so changing one there fails
// these instead of silently testing stale numbers.
const constOf = (name) => {
    const m = bundle.match(new RegExp('const ' + name + ' = (\\d+);'));
    if (!m) throw new Error('constant not found in bundle.js: ' + name);
    return Number(m[1]);
};

const slice = (from, to) => {
    const a = bundle.indexOf(from), b = bundle.indexOf(to);
    if (a < 0 || b < 0 || b < a) throw new Error('could not locate split methods in bundle.js - ' +
        'they moved, and the anchors in splitharness.js need updating');
    return bundle.slice(a, b);
};
const methods = slice('            splitsWillCap(count) {',
                      '            /**\n             *  `rush` forces the unpaced path')
              + slice('            queueSplits(count, rush = false) {', '            onKeyUp(event) {');

const SPLIT_QUEUE_MAX = constOf('SPLIT_QUEUE_MAX');
const SPLIT_RUSH_COPIES = constOf('SPLIT_RUSH_COPIES');
const TICK = 40;                              // the measured server rate, see OUTLINE
const SPLIT_SPACING = Math.min(constOf('SPLIT_SPACING_MAX'),
    Math.max(constOf('SPLIT_SPACING_MIN'), TICK + constOf('SPLIT_JITTER_MARGIN')));
// A fixture, not read from the bundle: it only feeds splitsWillCap(), and callers pick cell
// counts that sit clearly either side of these, so the real per-mode values change nothing.
const CELL_COUNT_CAPS = { 'Self Feed': 200, 'FFA': 16 };

const clock = { now: 1000, timers: [], nextId: 1 };
const performance = { now: () => clock.now };
const setTimeout_ = (fn, ms) => {
    const t = { id: clock.nextId++, at: clock.now + Math.max(0, ms), fn };
    clock.timers.push(t);
    return t.id;
};
const clearTimeout_ = (id) => { clock.timers = clock.timers.filter(t => t.id !== id); };

function advance(to) {
    while (true) {
        const due = clock.timers.filter(t => t.at <= to).sort((a, b) => a.at - b.at)[0];
        if (!due) break;
        clock.timers = clock.timers.filter(t => t !== due);
        clock.now = due.at;
        due.fn();
    }
    clock.now = to;
}

const packet = { Split: class Split {} };
const Game = new Function(
    'CELL_COUNT_CAPS', 'SPLIT_QUEUE_MAX', 'SPLIT_RUSH_COPIES', 'packet', 'performance', 'setTimeout', 'clearTimeout',
    `return class Game {
        constructor(mode, cells) {
            this.network = {
                mode,
                tickPeriod: ${TICK},
                get splitSpacing() { return ${SPLIT_SPACING}; },
                send: () => this.sentAt.push(performance.now()),
            };
            this.playerCells = new Set(Array.from({length: cells}, () => ({ eaten: false })));
            this.splitQueue = [];
            this.lastSplitAt = 0;
            this.lastSplitRush = false;
            this.splitTimer = null;
            this.sentAt = [];
        }
${methods}
    }`
)(CELL_COUNT_CAPS, SPLIT_QUEUE_MAX, SPLIT_RUSH_COPIES, packet, performance, setTimeout_, clearTimeout_);

function fresh(mode = 'FFA', cells = 1) {
    clock.now = 1000;
    clock.timers = [];
    return new Game(mode, cells);
}

module.exports = { Game, fresh, advance, clock, performance,
                   TICK, SPLIT_SPACING, SPLIT_QUEUE_MAX, SPLIT_RUSH_COPIES };
