/**
 *  Replays the live measurements in src/overrides/practice.js's header against its World,
 *  and fails if the simulation has drifted from them.
 *
 *      node util/practicesim.js
 *
 *  Every "observed" series here is copied from util/physprobe.js runs on the live FFA server
 *  (2026-10-28). Positions on the wire are whole units and sizes are truncated, so agreement
 *  within a couple of units a tick is all there is to ask for.
 */

const { World } = require('../src/overrides/practice.js');

let failures = 0;
function check(label, ok, detail) {
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${detail ? ` - ${detail}` : ''}`);
    if (!ok) failures++;
}

function world(nodes, players, extra = {}, mode = 'FFA') {
    return new World({
        border: [-12500, 12500, -12500, 12500],
        mode, nodes, players,
    }, { random: () => 0.5, ...extra });
}

const deltas = xs => xs.slice(1).map((x, i) => x - xs[i]);
const worst = (a, b) => Math.max(...a.map((x, i) => Math.abs(x - b[i])));

// ---- Movement: 19.35 a tick at radius 205, 22.71 at 143 ------------------------------------
for (const [r, observed] of [[205, 19.35], [143, 22.71]]) {
    const w = world([{ id: 1, kind: 'player', x: 0, y: 0, r, owner: 7, age: 1000 }],
        [{ pid: 7, mouse: { x: 100000, y: 0 }, controlled: true }], { decayRate: 0 });
    const cell = w.cells.get(1);
    for (let i = 0; i < 25; i++) w.tick();
    const speed = cell.x / 25;
    check(`speed at r=${r}`, Math.abs(speed - observed) < 0.15, `${speed.toFixed(2)} vs ${observed}`);
}

// ---- Split: the child's x, tick by tick, from its parent's position before the split ----------
{
    // Parent at -142 heading for +8000, radius 202 (mass 408): live, the child reads -63 on its
    // first packet and then this
    const observed = [-63, 37, 137, 238, 339, 439, 535, 623, 704, 779, 850, 915, 976, 1034, 1088,
        1138, 1186, 1232, 1275, 1316, 1355, 1392, 1428, 1463, 1496, 1529, 1560, 1590, 1620];
    const w = world([{ id: 1, kind: 'player', x: -142, y: 0, r: 202, owner: 7, age: 1000 }],
        [{ pid: 7, mouse: { x: 8000, y: 0 }, controlled: true }], { decayRate: 0 });
    w.players.get(7).splitRequested = true;
    w.tick();
    const child = [...w.cells.values()].find(cell => cell.id !== 1);
    const xs = [Math.round(child.x)];
    for (let i = 1; i < observed.length; i++) { w.tick(); xs.push(Math.round(child.x)); }
    const err = worst(deltas(xs), deltas(observed));
    check('split child steps', err <= 3, `worst step error ${err.toFixed(1)}\n      sim ${deltas(xs).join(' ')}\n      obs ${deltas(observed).join(' ')}`);
    check('split child size', Math.abs(child.r - 143) < 1, child.r.toFixed(1));
}

// ---- Eject: steps of the ejected blob ---------------------------------------------------------
{
    const observed = [10253, 10331, 10401, 10464, 10521, 10572, 10618, 10660, 10697, 10730, 10761,
        10788, 10812, 10834, 10854, 10872, 10888, 10902, 10915, 10927, 10938];
    // 194 on the wire, truncated - 194.9 is the reading that fits the 191 after it
    const w = world([{ id: 1, kind: 'player', x: 10042, y: 0, r: 194.9, owner: 7, age: 1000 }],
        [{ pid: 7, mouse: { x: 40000, y: 0 }, controlled: true }], { decayRate: 0, ejectSpread: 0 });
    w.players.get(7).ejectRequested = true;
    w.tick();
    const blob = [...w.cells.values()].find(cell => cell.kind === 'ejected');
    const xs = [Math.round(blob.x)];
    for (let i = 1; i < observed.length; i++) { w.tick(); xs.push(Math.round(blob.x)); }
    check('eject first position', Math.abs(xs[0] - observed[0]) <= 2, `${xs[0]} vs ${observed[0]}`);
    const err = worst(deltas(xs), deltas(observed));
    check('eject steps', err <= 2, `worst step error ${err.toFixed(1)}`);
    check('eject cost', Math.floor(w.cells.get(1).r) === 191, w.cells.get(1).r.toFixed(2));
}

// ---- Merge: halves of a 202 split, cursor between them - rigid until ~50, eaten ~56 ----------
{
    const w = world([{ id: 1, kind: 'player', x: 0, y: 0, r: 202, owner: 7, age: 1000 }],
        [{ pid: 7, mouse: { x: 3000, y: 0 }, controlled: true }], { decayRate: 0 });
    const player = w.players.get(7);
    player.splitRequested = true;
    w.tick();
    const splitTick = w.ticks;
    // Live, the cursor moved back 300ms after the split was sent
    for (let i = 0; i < 7; i++) w.tick();
    player.mouse = { x: 500, y: 0 };
    let overlapAt = null, mergedAt = null, heldGap = Infinity;
    for (let i = 0; i < 200 && mergedAt === null; i++) {
        w.tick();
        if (player.cells.length === 2 && overlapAt === null) {
            const [a, b] = player.cells;
            const gap = Math.hypot(a.x - b.x, a.y - b.y) - (a.r + b.r);
            // Live they held a radius sum apart, to the unit, until they could remerge
            const age = w.ticks - splitTick;
            if (age > 36 && age < 48) heldGap = Math.min(heldGap, gap);
            if (gap < -5) overlapAt = w.ticks - splitTick;
        }
        if (player.cells.length === 1) mergedAt = w.ticks - splitTick;
    }
    check('rigid until remerge', heldGap > -3 || overlapAt <= 36, `closest ${heldGap.toFixed(1)} before remerging`);
    check('remerge starts', overlapAt !== null && Math.abs(overlapAt - 50) <= 2, `tick ${overlapAt} vs 50`);
    check('merged', mergedAt !== null && Math.abs(mergedAt - 56) <= 3, `tick ${mergedAt} vs 56`);
}

// ---- Virus pop: 31 pieces of mass 20 and the rest in the cell, at mass 656 --------------------
{
    const r = Math.sqrt(656 * 100 - 125 * 125);
    const w = world([
        { id: 1, kind: 'player', x: 0, y: 0, r, owner: 7, age: 1000 },
        { id: 2, kind: 'virus', x: 0, y: 0, r: 125, color: 0x33ff33, age: 1000 },
    ], [{ pid: 7, mouse: { x: 0, y: 0 }, controlled: true }], { decayRate: 0 });
    w.tick();
    const cells = w.players.get(7).cells;
    const sizes = cells.map(cell => Math.floor(cell.r)).sort((a, b) => a - b);
    check('pop count', cells.length === 32, `${cells.length} cells`);
    check('pop sizes', sizes[0] === 44 && sizes.at(-2) === 44 && sizes.at(-1) === 60, sizes.join(','));
}

// ---- Nothing is eaten on the tick it was made -------------------------------------------------
{
    const w = world([
        { id: 1, kind: 'player', x: 0, y: 0, r: 400, owner: 7, age: 1000 },
        { id: 2, kind: 'player', x: 10, y: 0, r: 100, owner: 8, age: 0 },
    ], [{ pid: 7, mouse: null }, { pid: 8, mouse: null }], { decayRate: 0 });
    w.cells.get(2).born = w.ticks + 1;   // made during the coming tick
    w.tick();
    check('new cell survives its first tick', w.cells.has(2));
    w.tick();
    check('...and not its second', !w.cells.has(2));
}

// ---- A linesplit against the right wall, cell by cell ----------------------------------------
{
    // Live: a 129 held against the right wall (border 12500) by a cursor on the wall, split on
    // three ticks running. Letters are cells in the order they were made; every packet from the
    // first split on. The parent stays on the wall; each new cell lands 60 out - past the wall -
    // and comes back off it with its boost turned around.
    const observed = [
        'A=12435 B=12495',
        'A=12454 B=12454 C=12514 D=12514',
        'A=12467 B=12389 C=12467 D=12467 E=12527 F=12449 G=12527 H=12527',
        'A=12477 B=12349 C=12399 D=12399 E=12477 F=12477 G=12477 H=12477',
        'A=12477 B=12309 C=12359 D=12359 E=12399 F=12399 G=12399 H=12399',
        'A=12477 B=12269 C=12318 D=12318 E=12359 F=12359 G=12359 H=12359',
        'A=12477 B=12229 C=12278 D=12278 E=12318 F=12318 G=12318 H=12318',
        'A=12477 B=12195 C=12238 D=12238 E=12278 F=12278 G=12278 H=12278',
        'A=12477 B=12168 C=12205 D=12205 E=12238 F=12238 G=12238 H=12238',
        'A=12477 B=12147 C=12178 D=12178 E=12205 F=12205 G=12205 H=12205',
        'A=12477 B=12133 C=12158 D=12158 E=12179 F=12179 G=12179 H=12179',
        'A=12477 B=12124 C=12144 D=12144 E=12160 F=12160 G=12160 H=12160',
        'A=12477 B=12119 C=12135 D=12135 E=12146 F=12146 G=12146 H=12146',
        'A=12477 B=12119 C=12131 D=12131 E=12137 F=12137 G=12137 H=12137',
    ].map(row => Object.fromEntries(row.split(' ').map(pair => pair.split('=')).map(([k, v]) => [k, +v])));

    const w = world([{ id: 1, kind: 'player', x: 12435.5, y: 2106, r: 129.5, owner: 7, age: 1000 }],
        [{ pid: 7, mouse: { x: 12500, y: 2106 }, controlled: true }], { decayRate: 0 });
    const player = w.players.get(7);
    const letters = new Map([[1, 'A']]);
    let worstErr = 0, where = '';
    observed.forEach((row, tick) => {
        if (tick < 3) player.splitRequested = true;
        w.tick();
        for (const cell of player.cells) {
            if (!letters.has(cell.id)) letters.set(cell.id, String.fromCharCode(65 + letters.size));
        }
        for (const cell of player.cells) {
            const letter = letters.get(cell.id), x = Math.trunc(cell.x);
            const err = Math.abs(x - row[letter]);
            if (err > worstErr) { worstErr = err; where = `tick ${tick}, ${letter}: ${x} vs ${row[letter]}`; }
        }
    });
    check('wall linesplit, cell by cell', worstErr <= 2, worstErr ? `worst ${worstErr} at ${where}` : 'exact');
}

// ---- Restoring a snapshot invents no boosts -------------------------------------------------
{
    // Held on the wall by a cursor past it: no velocity, and no boost. Restoring used to take
    // off the steering it "should" have had and launch it off the wall.
    const atWall = world([{ id: 1, kind: 'player', x: 12435.5, y: 0, r: 129, owner: 7, age: 1000, vx: 0, vy: 0 }],
        [{ pid: 7, mouse: { x: 12500, y: 0 }, controlled: true }]);
    check('restore: held on the wall', atWall.cells.get(1).boost === 0, `boost ${atWall.cells.get(1).boost.toFixed(1)}`);

    // Steering across open ground at its own speed: no boost either
    const r = 143, speed = 74.08 * Math.pow(r * r / 100, -1 / 4.5);
    const open = world([{ id: 1, kind: 'player', x: 0, y: 0, r, owner: 7, age: 1000, vx: speed, vy: 0 }],
        [{ pid: 7, mouse: { x: 5000, y: 0 }, controlled: true }]);
    check('restore: steering only', open.cells.get(1).boost === 0, `boost ${open.cells.get(1).boost.toFixed(1)}`);
}

// ==== Virus Feed ==============================================================================

// ---- Movement: 11.46 a tick at radius 243, 13.38 at 171 ------------------------------------
for (const [r, observed] of [[243, 11.46], [171, 13.38]]) {
    const w = world([{ id: 1, kind: 'player', x: 0, y: 0, r, owner: 7, age: 1000 }],
        [{ pid: 7, mouse: { x: 100000, y: 0 }, controlled: true }], { decayRate: 0 }, 'Virus Feed');
    for (let i = 0; i < 25; i++) w.tick();
    const speed = w.cells.get(1).x / 25;
    check(`VF speed at r=${r}`, Math.abs(speed - observed) < 0.15, `${speed.toFixed(2)} vs ${observed}`);
}

// ---- Split: the child's steps from a 249, heading away -------------------------------------
{
    const observed = [91, 91, 91, 91, 89, 81, 74, 68, 63, 58, 53, 49, 46, 43, 39, 37, 34, 33, 30, 29,
        27, 26, 25, 23, 22, 22, 20, 20, 20, 18];
    const w = world([{ id: 1, kind: 'player', x: 0, y: 0, r: 249, owner: 7, age: 1000 }],
        [{ pid: 7, mouse: { x: 100000, y: 0 }, controlled: true }], { decayRate: 0 }, 'Virus Feed');
    w.players.get(7).splitRequested = true;
    w.tick();
    const child = [...w.cells.values()].find(cell => cell.id !== 1);
    const xs = [child.x];
    for (let i = 0; i < observed.length; i++) { w.tick(); xs.push(child.x); }
    const steps = deltas(xs).map(Math.round);
    const err = worst(steps, observed);
    check('VF split child steps', err <= 3, `worst step error ${err}\n      sim ${steps.join(' ')}\n      obs ${observed.join(' ')}`);
}

// ---- Remerge: halves of 176 start to overlap at tick 75 -------------------------------------
{
    const w = world([
        { id: 1, kind: 'player', x: 0, y: 0, r: 176, owner: 7, age: 1000 },
        { id: 2, kind: 'player', x: 352, y: 0, r: 176, owner: 7, age: 0 },
    ], [{ pid: 7, mouse: { x: 176, y: 0 }, controlled: true }], { decayRate: 0 }, 'Virus Feed');
    // Both just out of the window in which a player's new cells pass through each other, so
    // they are held apart from the start and the age they overlap at is the remerge time
    w.cells.get(1).born = w.cells.get(2).born = -15;
    let overlapAt = null;
    for (let i = 0; i < 120 && overlapAt === null; i++) {
        w.tick();
        const [a, b] = w.players.get(7).cells;
        if (b && Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r - 5) overlapAt = a.age();
    }
    check('VF remerge starts', overlapAt !== null && Math.abs(overlapAt - 75) <= 2, `tick ${overlapAt} vs 75`);
}

// ---- A virus shoots on the third feed --------------------------------------------------------
{
    const w = world([{ id: 1, kind: 'virus', x: 0, y: 0, r: 125, color: 0x33ff33, age: 1000 }],
        [], { decayRate: 0 }, 'Virus Feed');
    const sizes = [];
    for (let feed = 0; feed < 3; feed++) {
        // Moving, as fed mass is: a virus only eats what is boosted into it
        const blob = { id: 100 + feed, kind: 'ejected', x: -60, y: 0, r: 37, age: 5, vx: 20, vy: 0 };
        w.restoreNode(blob);
        w.tick();
        sizes.push(Math.floor(w.cells.get(1).r));
    }
    const viruses = [...w.cells.values()].filter(cell => cell.kind === 'virus').length;
    check('VF virus feeds', sizes.join(',') === '130,135,125' && viruses === 2, `${sizes.join(',')}, ${viruses} viruses`);
}

// ---- A pop shares the cell out evenly: 24 cells of 58 ----------------------------------------
{
    // 253 and a 125 virus, and whatever food it met on the way: 24 cells of 58 is 807-835
    const r = Math.sqrt(815 * 100 - 125 * 125);
    const w = world([
        { id: 1, kind: 'player', x: 0, y: 0, r, owner: 7, age: 1000 },
        { id: 2, kind: 'virus', x: 0, y: 0, r: 125, color: 0x33ff33, age: 1000 },
    ], [{ pid: 7, mouse: { x: 0, y: 0 }, controlled: true }], { decayRate: 0, maxCells: 48 }, 'Virus Feed');
    w.tick();
    const sizes = [...new Set(w.players.get(7).cells.map(cell => Math.floor(cell.r)))];
    check('VF pop', w.players.get(7).cells.length === 24 && sizes.join() === '58',
        `${w.players.get(7).cells.length} cells of ${sizes.join(',')}`);
}

console.log(failures ? `\n${failures} failed` : '\nall passed');
process.exit(failures ? 1 : 0);
