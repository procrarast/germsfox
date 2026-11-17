/**
 *  Practice server - a stand-in for the germs.io game server that runs in the browser.
 *
 *  It replays a saved snapshot of a game and simulates it, speaking the same binary protocol
 *  as the real server, so the client needs no second code path: Network gets a socket-shaped
 *  object instead of a WebSocket and everything downstream of it is unchanged.
 *
 *  Runs as a SharedWorker so that every germs tab of this origin connects to one instance -
 *  a multiboxer's two tabs are two players in the same simulation, exactly as they are two
 *  connections to the same real server. bundle.js loads it from a data: URL built from this
 *  file's text: unlike a blob: URL, that string is identical in every tab and does not die with
 *  the tab that made it, and identical URL + name is what makes two tabs share the worker.
 *
 *  Also loads under node (module.exports at the bottom) so the physics can be tested without
 *  a browser - see util/practicesim.js.
 *
 *  ---------------------------------------------------------------------------------------
 *  The physics
 *
 *  germs is Ogar by way of Barbosik's MultiOgar (mid-2016): the move engine, boosts, wall
 *  clipping, collision order and remerge window here are that server's, and the live traces
 *  match it cell for cell - including a three-tick linesplit against a wall, eight cells over
 *  fourteen ticks (util/practicesim.js). Classic Ogar's ×0.85 geometric split boost does not
 *  fit them; MultiOgarII's B/9 does not either. What germs has of its own, all measured live
 *  (2026-10-28):
 *
 *  - Movement is classic Ogar's curve, 74.08 * mass^(-1/4.5) a tick, slowing inside 32 units
 *    of the cursor as MultiOgar does. Fitted at radius 143 and 205, residual under 0.1%.
 *  - A boost moves min(B/10, 78) a tick, MultiOgar's cap. Ejected mass and shot viruses
 *    start at B = 780; a split at 1100, so it holds the cap for five ticks.
 *  - A split cell appears 60 units out from its parent (MultiOgar: 40), wall or no wall, and
 *    moves no further that tick. Ejected mass appears on the edge of the moved cell.
 *  - Cells remerge 0.355 ticks per unit of radius after they were made, and not before 15:
 *    16 ticks at radius 44, 50 at 141. MultiOgar waits max(30s, 0.2r s).
 *  - Ejecting is allowed every tick, and costs exactly the mass ejected.
 *  - A virus pops a cell into as many 20-mass pieces as there is room for, spaced evenly
 *    around it, the cell keeping the rest.
 *  - A cell cannot be eaten on the tick it was made (from the server's maintainer, not
 *    measured - it needs a second player).
 *
 *  Not measured, MultiOgar's kept: decay, the minimum split and eject size, and how many feeds
 *  an FFA virus takes. Other modes differ - see MODE_CONFIG; the per-mode caps the client
 *  already knows (cell count, autosplit mass) come in with the snapshot.
 */

/**
 *  The server's constants - FFA's, which is where they were measured. A mode that differs
 *  says so in MODE_CONFIG; anything it leaves out is FFA's.
 */
const PRACTICE_CONFIG = {
    tickMs: 40,

    speedCoef: 74.08,          // units a tick, times mass^speedExp
    speedExp: -1 / 4.5,

    boostDivisor: 10,          // a boost moves B / boostDivisor a tick
    boostSpeedCap: 78,         // ...but never more than this
    splitBoost: 1100,          // fitted to an open-field split and a wall linesplit together
    splitOffset: 60,           // where a split cell appears, out from its parent
    ejectBoost: 780,
    virusShootBoost: 780,

    minSplitSize: 59.16,       // 35 mass
    minEjectSize: 59.16,
    minCellSize: 31.62,        // 10 mass
    ejectSize: 37,
    ejectLoss: 37,
    ejectCooldown: 1,          // ticks
    ejectSpread: 0.3,          // radians either side of the cursor

    noCollideTicks: 15,        // a player's own new cells pass through each other this long
    steerSlowRadius: 32,       // steering slows inside this distance of the cursor
    remergeTicksPerRadius: 0.355,
    invincibleTicks: 1,

    eatRatio: 1.15,            // radius a cell needs over another to eat it
    eatOverlapDivisor: 3,      // and how far inside it the smaller one has to be

    virusSize: 125,
    virusMaxSize: 158,         // not measured - 7 feeds, as in agar.io; FFA has been seen at 140
    popMode: 'fixed',          // 'fixed': pieces of poppedPieceMass, the cell keeps the rest
    poppedPieceMass: 20,       // 'equal': every cell gets the same, pieces of at least this

    decayRate: 0.002,          // of mass, once a second
    decayMinSize: 31.62,

    spawnSize: 200,

    maxCells: 32,              // overridden per mode from the snapshot
    autosplitMass: 50000,
};

/**
 *  Where a mode's server differs from FFA's, measured the same way (2026-10-28).
 *
 *  Virus Feed: the same curves as FFA but slower - 47.27 * mass^(-1/4.5), fitted at radius 243
 *  and 171 within 0.1% of each other - with a shorter split boost (four ticks at the cap, not
 *  five), remerging at 0.426 ticks a unit of radius (75 ticks at 176), viruses that shoot on
 *  the third feed (125 -> 130 -> 135 -> shot, so the line is between 135.6 and 140.6), and pops
 *  that share the cell out evenly: a 253 eating a 125 became 24 cells of 58, which is as many
 *  35-mass pieces as fit, plus the cell, all the same size. Ejecting, the split offset, the
 *  boost cap and decay all measured the same as FFA. The border (+-9000) and spawn size come
 *  from the snapshot and the server respectively.
 */
const MODE_CONFIG = {
    'Virus Feed': {
        speedCoef: 47.27,
        splitBoost: 1070,
        remergeTicksPerRadius: 0.426,
        virusMaxSize: 138,
        popMode: 'equal',
        poppedPieceMass: 35,
        spawnSize: 250,
    },
};

// The flags byte of a node record - see Network.handleNodes()
const FLAG_VIRUS = 1, FLAG_COLOR = 2, FLAG_SKIN = 4, FLAG_NAME = 8, FLAG_EJECTED = 32, FLAG_PARENT = 64;

const KIND_PLAYER = 'player', KIND_FOOD = 'food', KIND_VIRUS = 'virus', KIND_EJECTED = 'ejected';

const VIRUS_COLOR = 0x33ff33;

const massOf = r => r * r / 100;
const sizeOf = mass => Math.sqrt(mass * 100);

/**
 *  Packet building. Little-endian throughout, strings zero-terminated - the mirror image of
 *  the client's BinaryReader.
 */
class PacketWriter {
    constructor(size = 256) {
        this.bytes = new Uint8Array(size);
        this.view = new DataView(this.bytes.buffer);
        this.length = 0;
    }
    ensure(n) {
        if (this.length + n <= this.bytes.length) return;
        const grown = new Uint8Array(Math.max(this.bytes.length * 2, this.length + n));
        grown.set(this.bytes.subarray(0, this.length));
        this.bytes = grown;
        this.view = new DataView(grown.buffer);
    }
    u8(v) { this.ensure(1); this.view.setUint8(this.length, v); this.length += 1; }
    u16(v) { this.ensure(2); this.view.setUint16(this.length, v, true); this.length += 2; }
    u32(v) { this.ensure(4); this.view.setUint32(this.length, v >>> 0, true); this.length += 4; }
    i32(v) { this.ensure(4); this.view.setInt32(this.length, v, true); this.length += 4; }
    f64(v) { this.ensure(8); this.view.setFloat64(this.length, v, true); this.length += 8; }
    utf8(text) {
        const encoded = new TextEncoder().encode(text);
        this.ensure(encoded.length + 1);
        this.bytes.set(encoded, this.length);
        this.length += encoded.length;
        this.u8(0);
    }
    ucs2(text) {
        for (let i = 0; i < text.length; i++) this.u16(text.charCodeAt(i));
        this.u16(0);
    }
    build() { return this.bytes.slice(0, this.length).buffer; }
}

class Cell {
    constructor(world, kind, x, y, r, id = world.nextId++) {
        this.world = world;
        this.id = id;
        this.kind = kind;
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = 0;
        this.owner = null;
        this.born = world.ticks;
        this.boost = 0;
        this.dirX = 0;
        this.dirY = 0;
        this.canRemerge = false;
        this.removed = false;
        this.killer = null;
    }
    get mass() { return massOf(this.r); }
    age() { return this.world.ticks - this.born; }
    setBoost(distance, angle) {
        this.boost = distance;
        this.dirX = Math.cos(angle);
        this.dirY = Math.sin(angle);
    }
}

class Player {
    constructor(pid, { name = '', skin = '', color = 0, mouse = null, tabId = null } = {}) {
        this.pid = pid;
        this.name = name;
        this.skin = skin;
        this.color = color;
        // Where this player's cells are heading. null for a dummy - see World.steer()
        this.mouse = mouse;
        this.tabId = tabId;
        this.cells = [];
        this.client = null;
        this.splitRequested = false;
        this.ejectRequested = false;
        this.lastEject = -Infinity;
    }
}

/**
 *  The simulation: every node in a snapshot and the players that own them. Knows nothing of
 *  ports or clients; Server drives it a tick at a time and reads what changed.
 */
class World {
    constructor(snapshot, config = {}) {
        this.config = { ...PRACTICE_CONFIG, ...MODE_CONFIG[snapshot.mode], ...config, ...(snapshot.config ?? {}) };
        this.random = config.random ?? Math.random;
        this.ticks = 0;
        this.cells = new Map();
        this.players = new Map();
        this.eats = [];       // [hunterId, eatenId] since the last drain
        this.removed = [];    // ids gone without being eaten, ditto
        this.added = [];      // own cells made since the last drain, as [pid, id]

        const [minX, maxX, minY, maxY] = snapshot.border;
        this.border = { minX, maxX, minY, maxY };

        let maxId = 0;
        for (const node of snapshot.nodes) maxId = Math.max(maxId, node.id);
        for (const info of snapshot.players ?? []) maxId = Math.max(maxId, info.pid);
        this.nextId = maxId + 1;

        for (const info of snapshot.players ?? []) {
            this.players.set(info.pid, new Player(info.pid, info));
        }
        for (const node of snapshot.nodes) this.restoreNode(node);
        this.added.length = 0;
    }

    /**
     *  Rebuilds a node from its snapshot record. The record holds where the node was and how
     *  far it moved over its last tick, not the boost that was driving it, so the boost is
     *  worked back out of the velocity: whatever the cell did beyond its own steering is boost,
     *  and a boost moving s a tick has 10s left to go - or, at the cap, at least that much and
     *  probably more, which is where the cell's age comes in.
     *
     *  The steering taken off is what steering would really have done from where the cell
     *  was, wall included. A cell its cursor holds against a wall does not move, and taking
     *  off the full steering it "should" have had left a boost pointing away from the wall -
     *  which is how a linesplit's anchor cell used to leave the wall it was saved against.
     */
    restoreNode(node) {
        const cell = new Cell(this, node.kind, node.x, node.y, node.r, node.id);
        cell.color = node.color ?? 0;
        cell.born = -(node.age ?? 1000);

        if (node.kind === KIND_PLAYER) {
            let player = this.players.get(node.owner);
            if (!player) {
                player = new Player(node.owner, { name: node.name ?? '', skin: node.skin ?? '', color: cell.color });
                this.players.set(node.owner, player);
            }
            cell.owner = player;
            player.cells.push(cell);
            this.updateRemerge(cell);
        }

        let vx = node.vx ?? 0, vy = node.vy ?? 0;
        // Saved while practising, the boost itself is known
        if (node.boost != null) {
            cell.setBoost(node.boost, Math.atan2(vy, vx));
            this.addCell(cell);
            return cell;
        }
        if (cell.owner && (vx || vy)) {
            const steer = this.steerStep(cell, cell.x - vx, cell.y - vy);
            vx -= steer.x;
            vy -= steer.y;
        }
        const boostSpeed = Math.hypot(vx, vy);
        if (boostSpeed > 2) {
            const { boostDivisor, boostSpeedCap, splitBoost } = this.config;
            let distance = boostSpeed * boostDivisor;
            if (boostSpeed >= boostSpeedCap - 1) {
                // Capped, so the speed only says it is at least this far out. A split cell
                // spends five ticks at the cap; its age says how far into them it is.
                distance = Math.max(distance, splitBoost - boostSpeedCap * cell.age());
            }
            cell.setBoost(distance, Math.atan2(vy, vx));
        }

        this.addCell(cell);
        return cell;
    }

    addCell(cell) {
        this.cells.set(cell.id, cell);
        if (cell.owner) {
            if (!cell.owner.cells.includes(cell)) cell.owner.cells.push(cell);
            this.added.push([cell.owner.pid, cell.id]);
        }
    }

    removeCell(cell, hunter = null) {
        if (cell.removed) return;
        cell.removed = true;
        this.cells.delete(cell.id);
        if (cell.owner) {
            const index = cell.owner.cells.indexOf(cell);
            if (index >= 0) cell.owner.cells.splice(index, 1);
        }
        if (hunter) this.eats.push([hunter.id, cell.id]);
        else this.removed.push(cell.id);
    }

    speedOf(cell) {
        return this.config.speedCoef * Math.pow(cell.mass, this.config.speedExp);
    }

    // ---- Input -------------------------------------------------------------------------

    spawn(player, x, y) {
        const cell = new Cell(this, KIND_PLAYER, x, y, this.config.spawnSize);
        cell.color = player.color;
        cell.owner = player;
        player.mouse = { x, y };
        this.addCell(cell);
        return cell;
    }

    /**
     *  Splits every cell that can, oldest first, in half toward the cursor. The server takes
     *  at most one of these a tick, so a request is a flag rather than a count - see
     *  SplitScheduler in bundle.js, which is built around exactly that.
     */
    split(player) {
        const { maxCells, minSplitSize } = this.config;
        const cells = player.cells.slice();
        for (const cell of cells) {
            if (player.cells.length >= maxCells) break;
            if (cell.r < minSplitSize) continue;
            let dx = player.mouse ? player.mouse.x - cell.x : 1;
            let dy = player.mouse ? player.mouse.y - cell.y : 0;
            if (dx * dx + dy * dy < 1) { dx = 1; dy = 0; }
            this.splitCell(cell, Math.atan2(dy, dx), cell.mass / 2);
        }
    }

    /**
     *  The new cell goes splitOffset out from its parent and is left there, past the wall if
     *  that is where it lands: live, a split against a wall puts the new cell beyond it, and
     *  the next tick's steering is what pulls it back to the wall and turns its boost around.
     */
    splitCell(parent, angle, mass, boost = this.config.splitBoost) {
        const size = sizeOf(mass);
        const remaining = Math.sqrt(parent.r * parent.r - size * size);
        if (!remaining || remaining < this.config.minCellSize) return null;

        parent.r = remaining;
        const offset = this.config.splitOffset;
        const cell = new Cell(this, KIND_PLAYER,
            parent.x + Math.cos(angle) * offset, parent.y + Math.sin(angle) * offset, size);
        cell.color = parent.color;
        cell.owner = parent.owner;
        cell.setBoost(boost, angle);
        this.addCell(cell);
        return cell;
    }

    eject(player) {
        const config = this.config;
        if (this.ticks - player.lastEject < config.ejectCooldown) return;
        player.lastEject = this.ticks;

        for (const cell of player.cells.slice()) {
            if (cell.r < config.minEjectSize) continue;
            const remaining = cell.r * cell.r - config.ejectLoss * config.ejectLoss;
            if (remaining < config.minCellSize * config.minCellSize) continue;
            cell.r = Math.sqrt(remaining);

            let dx = player.mouse ? player.mouse.x - cell.x : 1;
            let dy = player.mouse ? player.mouse.y - cell.y : 0;
            const dist = Math.hypot(dx, dy);
            if (dist > 1) { dx /= dist; dy /= dist; } else { dx = 1; dy = 0; }

            const ejected = new Cell(this, KIND_EJECTED,
                cell.x + dx * cell.r, cell.y + dy * cell.r, config.ejectSize);
            ejected.color = cell.color;
            const angle = Math.atan2(dy, dx) + (this.random() * 2 - 1) * config.ejectSpread;
            ejected.setBoost(config.ejectBoost, angle);
            this.addCell(ejected);
        }
    }

    // ---- The tick ----------------------------------------------------------------------

    /**
     *  One server tick, in the order Barbosik's MultiOgar runs it - which is what germs runs,
     *  and what the live traces were matched against cell for cell: every player cell steers
     *  and then boosts; then everything else that is boosted moves; only then does anything
     *  collide - own cells pushing apart in two passes, then eating; and last the inputs that
     *  arrived during the tick, which is why a split or ejected cell appears where it was made
     *  and moves no further until the next tick.
     */
    tick() {
        this.ticks++;

        if ((this.ticks + 3) % 25 === 0) {
            for (const player of this.players.values()) {
                for (const cell of player.cells) this.decay(cell);
            }
        }

        for (const player of this.players.values()) {
            for (const cell of player.cells.slice()) {
                if (cell.removed) continue;
                this.updateRemerge(cell);
                this.steer(cell);
                this.move(cell);
                this.autosplit(cell);
            }
        }
        const moving = [...this.cells.values()].filter(cell => !cell.owner && cell.boost > 0);
        for (const cell of moving) this.move(cell);

        // Player cells against everything
        let rigid = [], eats = [];
        for (const player of this.players.values()) {
            for (const cell of player.cells) {
                for (const other of this.cellsTouching(cell)) {
                    (this.isRigid(cell, other) ? rigid : eats).push([cell, other]);
                }
            }
        }
        for (let pass = 0; pass < 2; pass++) {
            for (const [a, b] of rigid) this.resolveRigid(a, b);
        }
        for (const [a, b] of eats) this.resolveEat(a, b);

        // Boosted ejected mass and viruses against everything: ejected mass pushes other
        // ejected mass, and is eaten by viruses and cells
        rigid = [];
        eats = [];
        for (const cell of moving) {
            if (cell.removed) continue;
            for (const other of this.cellsTouching(cell)) {
                (cell.kind === KIND_EJECTED && other.kind === KIND_EJECTED ? rigid : eats).push([cell, other]);
            }
        }
        for (const [a, b] of rigid) this.resolveRigid(a, b);
        for (const [a, b] of eats) this.resolveEat(a, b);

        for (const player of this.players.values()) {
            if (player.splitRequested) {
                player.splitRequested = false;
                this.split(player);
            }
            if (player.ejectRequested) {
                player.ejectRequested = false;
                this.eject(player);
            }
        }
    }

    // Everything overlapping this cell. A world is a few hundred nodes - the snapshot of one or
    // two viewports - so a scan is cheaper than keeping a tree up to date.
    *cellsTouching(cell) {
        for (const other of this.cells.values()) {
            if (other === cell || other.removed) continue;
            const reach = cell.r + other.r;
            const dx = other.x - cell.x, dy = other.y - cell.y;
            if (dx * dx + dy * dy <= reach * reach) yield other;
        }
    }

    // A player's new cells may not remerge, nor push each other, until noCollideTicks old
    updateRemerge(cell) {
        const age = cell.age();
        cell.canRemerge = age >= this.config.noCollideTicks
            && age >= cell.r * this.config.remergeTicksPerRadius;
    }

    /**
     *  Where steering alone takes a cell from (x, y) in one tick: toward the cursor at the
     *  cell's speed, slowing inside steerSlowRadius so it eases onto the cursor rather than
     *  overshooting, and held half a radius inside the wall.
     */
    steerStep(cell, x, y) {
        const mouse = cell.owner?.mouse;
        if (!mouse) return { x: 0, y: 0 };
        const dx = mouse.x - x, dy = mouse.y - y;
        const squared = dx * dx + dy * dy;
        if (squared < 1) return { x: 0, y: 0 };
        const d = Math.sqrt(squared);
        const speed = this.speedOf(cell) * Math.min(d, this.config.steerSlowRadius) / this.config.steerSlowRadius;
        const { minX, maxX, minY, maxY } = this.bounds(cell);
        return {
            x: Math.min(Math.max(x + dx / d * speed, minX), maxX) - x,
            y: Math.min(Math.max(y + dy / d * speed, minY), maxY) - y,
        };
    }

    /**
     *  Steers a cell toward its owner's cursor. A dummy - another player in the snapshot,
     *  whose cursor nobody knows - has none, and holds still apart from its boosts and
     *  collisions, which makes it the predictable target a practice setup wants.
     */
    steer(cell) {
        const step = this.steerStep(cell, cell.x, cell.y);
        cell.x += step.x;
        cell.y += step.y;
    }

    /**
     *  A boost's step this tick: B/10, at most boostSpeedCap. One that would carry the cell
     *  past the wall stops it there instead, turns it around, and hands the distance it did
     *  not use back to the boost - so a cell split into a wall comes off it with its whole
     *  boost left, which is the bounce a linesplit along a wall depends on.
     */
    move(cell) {
        if (cell.boost <= 0) {
            cell.boost = 0;
            return;
        }
        const speed = Math.min(cell.boost / this.config.boostDivisor, this.config.boostSpeedCap, cell.boost);
        cell.boost -= speed;
        if (cell.boost < 1) cell.boost = 0;

        let vx = cell.dirX * speed, vy = cell.dirY * speed;
        const { minX, maxX, minY, maxY } = this.bounds(cell);
        const x = cell.x + vx, y = cell.y + vy;

        // Where the line of travel crosses each bound the step ends beyond. The whole line,
        // not just the step, as the server does: a cell already outside is drawn back to the
        // bound rather than left there.
        const atX = bound => vx === 0 ? null : { x: bound, y: cell.y + vy * (bound - cell.x) / vx };
        const atY = bound => vy === 0 ? null : { x: cell.x + vx * (bound - cell.y) / vy, y: bound };
        const ph = x < minX ? atX(minX) : x > maxX ? atX(maxX) : null;
        const pv = y < minY ? atY(minY) : y > maxY ? atY(maxY) : null;
        let p = ph ?? pv;
        if (p) {
            if (ph && pv) {
                const dh = (ph.x - cell.x) ** 2 + (ph.y - cell.y) ** 2;
                const dv = (pv.x - cell.x) ** 2 + (pv.y - cell.y) ** 2;
                p = dh < dv ? ph : pv;
            }
            if (p === ph) cell.dirX = -cell.dirX;
            else cell.dirY = -cell.dirY;
            const lx = p.x - cell.x, ly = p.y - cell.y;
            cell.boost += Math.hypot(vx - lx, vy - ly);
            if (cell.boost < 1) cell.boost = 0;
            vx = lx;
            vy = ly;
        }
        cell.x += vx;
        cell.y += vy;
        this.clampToBorder(cell);
    }

    // The centre is held half a radius inside the border
    bounds(cell) {
        const { minX, maxX, minY, maxY } = this.border;
        const half = cell.r / 2;
        return { minX: minX + half, maxX: maxX - half, minY: minY + half, maxY: maxY - half };
    }

    clampToBorder(cell) {
        const { minX, maxX, minY, maxY } = this.bounds(cell);
        cell.x = Math.min(Math.max(cell.x, minX), maxX);
        cell.y = Math.min(Math.max(cell.y, minY), maxY);
    }

    decay(cell) {
        if (cell.r <= this.config.decayMinSize) return;
        cell.r = Math.sqrt(cell.r * cell.r * (1 - this.config.decayRate));
    }

    autosplit(cell) {
        const { autosplitMass, maxCells } = this.config;
        if (!autosplitMass || cell.mass < autosplitMass) return;
        if (cell.owner.cells.length >= maxCells) {
            cell.r = sizeOf(autosplitMass);
            return;
        }
        this.splitCell(cell, this.random() * 2 * Math.PI, cell.mass / 2);
    }

    // Two cells of one player push each other apart until both may remerge
    isRigid(a, b) {
        if (!a.owner || a.owner !== b.owner) return false;
        const window = this.config.noCollideTicks;
        if (a.age() < window || b.age() < window) return false;
        return !a.canRemerge || !b.canRemerge;
    }

    // Apart along the line between them, the lighter one moving further
    resolveRigid(a, b) {
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        if (dist <= 0) return;
        const penetration = a.r + b.r - dist;
        if (penetration <= 0) return;
        const px = penetration * dx / dist, py = penetration * dy / dist;
        const total = a.r * a.r + b.r * b.r;
        if (total <= 0) return;
        const aShare = b.r * b.r / total, bShare = a.r * a.r / total;
        a.x -= px * aShare;
        a.y -= py * aShare;
        b.x += px * bShare;
        b.y += py * bShare;
        this.clampToBorder(a);
        this.clampToBorder(b);
    }

    canEat(hunter, prey) {
        if (hunter.kind === KIND_PLAYER) return true;
        // A virus eats only ejected mass
        return hunter.kind === KIND_VIRUS && prey.kind === KIND_EJECTED;
    }

    resolveEat(a, b) {
        if (a.removed || b.removed) return;
        let prey = a, hunter = b;
        if (a.r > b.r) { prey = b; hunter = a; }

        const reach = hunter.r - prey.r / this.config.eatOverlapDivisor;
        const dx = hunter.x - prey.x, dy = hunter.y - prey.y;
        if (dx * dx + dy * dy >= reach * reach) return;

        // germs: nothing is eaten on the tick it was made
        if (prey.age() < this.config.invincibleTicks) return;

        if (prey.owner && prey.owner === hunter.owner) {
            const window = this.config.noCollideTicks;
            if (prey.age() < window || hunter.age() < window) return;
            if (!prey.canRemerge || !hunter.canRemerge) return;
        } else if (hunter.r <= prey.r * this.config.eatRatio || !this.canEat(hunter, prey)) {
            return;
        }

        this.eat(hunter, prey);
    }

    eat(hunter, prey) {
        if (hunter.kind === KIND_VIRUS) {
            hunter.r = Math.sqrt(hunter.r * hunter.r + prey.r * prey.r);
            this.removeCell(prey, hunter);
            if (hunter.r >= this.config.virusMaxSize) {
                hunter.r = this.config.virusSize;
                this.shootVirus(hunter, Math.atan2(prey.dirY, prey.dirX));
            }
            return;
        }

        hunter.r = Math.sqrt(hunter.r * hunter.r + prey.r * prey.r);
        this.removeCell(prey, hunter);
        if (prey.kind === KIND_VIRUS && hunter.owner) this.popCell(hunter);
    }

    shootVirus(parent, angle) {
        const virus = new Cell(this, KIND_VIRUS, parent.x, parent.y, this.config.virusSize);
        virus.color = VIRUS_COLOR;
        virus.setBoost(this.config.virusShootBoost, angle);
        this.addCell(virus);
    }

    /**
     *  A virus pops a cell into pieces spaced evenly around it, as many as the cell count has
     *  room for. FFA cuts fixed-size pieces and the cell keeps what is left over; Virus Feed
     *  shares the whole cell out evenly - see popMode.
     */
    popCell(cell) {
        const { maxCells, poppedPieceMass, popMode } = this.config;
        const room = maxCells - cell.owner.cells.length;
        const equal = popMode === 'equal';
        const pieces = Math.min(room, Math.floor(cell.mass / poppedPieceMass) - (equal ? 0 : 1));
        if (pieces <= 0) return;

        const pieceMass = equal ? cell.mass / (pieces + 1) : poppedPieceMass;
        const start = this.random() * 2 * Math.PI;
        for (let i = 0; i < pieces; i++) {
            this.splitCell(cell, start + i * 2 * Math.PI / pieces, pieceMass);
        }
    }

    // ---- Reading it back ---------------------------------------------------------------

    drain() {
        const out = { eats: this.eats, removed: this.removed, added: this.added };
        this.eats = [];
        this.removed = [];
        this.added = [];
        return out;
    }

    // The world as a snapshot, for saving a snapshot while practising - exact, unlike one
    // pieced together from what a client was sent
    toSnapshot() {
        const nodes = [];
        for (const cell of this.cells.values()) {
            const record = {
                id: cell.id, kind: cell.kind, x: cell.x, y: cell.y, r: cell.r, color: cell.color,
                age: cell.age(), owner: cell.owner ? cell.owner.pid : -1,
            };
            if (cell.boost > 0) {
                const step = Math.min(cell.boost / this.config.boostDivisor, this.config.boostSpeedCap);
                record.vx = cell.dirX * step;
                record.vy = cell.dirY * step;
                record.boost = cell.boost;
            }
            nodes.push(record);
        }
        // Controlled is whoever has a tab driving them right now
        const players = [...this.players.values()].map(player => ({
            pid: player.pid, name: player.name, skin: player.skin, color: player.color,
            mouse: player.mouse && { ...player.mouse }, tabId: player.tabId,
            controlled: !!player.client && player.cells.length > 0,
        })).sort((a, b) => b.controlled - a.controlled);
        const { minX, maxX, minY, maxY } = this.border;
        return { border: [minX, maxX, minY, maxY], nodes, players };
    }
}

/**
 *  The connections - one per tab - and the protocol. Owns the World and the tick loop, and
 *  turns what the world did into the packets a real server would have sent.
 */
class Server {
    constructor() {
        this.clients = new Set();
        this.world = null;
        this.snapshot = null;
        this.attempt = 0;
        this.timer = null;
        this.nextTickAt = 0;
    }

    connect(port) {
        const client = { port, tabId: null, player: null, known: new Map(), lastSeen: Date.now() };
        this.clients.add(client);
        port.onmessage = event => this.onMessage(client, event.data);
        port.start?.();
        return client;
    }

    onMessage(client, data) {
        client.lastSeen = Date.now();
        // Timed out but not gone - see tick()
        if (!this.clients.has(client) && !client.left) {
            if (data?.type === 'leave') return;
            this.clients.add(client);
            if (this.world) this.resetClient(client);
        }
        if (data instanceof ArrayBuffer) return this.onPacket(client, new DataView(data));
        if (!data || typeof data !== 'object') return;

        switch (data.type) {
            case 'hello':
                client.tabId = data.tabId;
                client.initiator = !!data.initiator;
                if (data.snapshot) this.load(data.snapshot, data.attempt ?? 1);
                else if (this.world) {
                    // Following another tab in, and usually a moment behind its load
                    this.claim(client);
                    this.resetClient(client);
                }
                break;
            case 'reload':
                if (this.snapshot) this.load(this.snapshot, data.attempt ?? this.attempt + 1, client);
                break;
            case 'dump':
                client.port.postMessage({ type: 'dump', requestId: data.requestId,
                    snapshot: this.world ? this.world.toSnapshot() : null });
                break;
            case 'leave':
                client.left = true;
                this.disconnect(client);
                break;
        }
    }

    disconnect(client) {
        if (!this.clients.delete(client)) return;
        // The player stays, as a dummy, the way a real server keeps a disconnected player's cells
        if (client.player) {
            client.player.client = null;
            client.player.mouse = null;
        }
        if (this.clients.size === 0) this.stop();
    }

    /**
     *  (Re)starts the world from a snapshot and hands each tab its player: the one it saved
     *  from if it is here, otherwise whichever controlled player is left - the tab that asked
     *  for the load first, so pressing reload in either tab puts that tab in the cells it was
     *  playing when the snapshot was taken.
     */
    load(snapshot, attempt, asker = null) {
        this.snapshot = snapshot;
        this.attempt = attempt;
        this.world = new World(snapshot);
        for (const client of this.clients) client.player = null;

        const controlled = (snapshot.players ?? []).filter(info => info.controlled)
            .map(info => this.world.players.get(info.pid));
        const free = new Set(controlled);
        const clients = [...this.clients];
        for (const client of clients) {
            client.player = null;
            const own = controlled.find(player => player.tabId && player.tabId === client.tabId);
            if (own && free.has(own)) { client.player = own; free.delete(own); }
        }
        // The asker, or failing that the tab that loaded, picks before the rest
        clients.sort((a, b) => (b === asker) - (a === asker) || b.initiator - a.initiator);
        for (const client of clients) {
            if (client.player || free.size === 0) continue;
            const [player] = free;
            client.player = player;
            free.delete(player);
        }
        // Whoever has a player now saved it, as far as the next snapshot of this one goes
        for (const client of clients) {
            if (client.player) client.player.tabId = client.tabId;
        }
        // A controlled player nobody has taken yet keeps the cursor it was saved with. The
        // other tab is usually a moment behind - see claim() - and until it arrives its cells
        // carry on the way they were going, as they would have with nobody touching the mouse.

        for (const client of clients) this.resetClient(client);
        this.start();
    }

    // A tab arriving after the load: its own player if it saved one, else any left over
    claim(client) {
        if (client.player) return;
        const taken = new Set([...this.clients].map(other => other.player).filter(Boolean));
        const free = (this.snapshot.players ?? []).filter(info => info.controlled)
            .map(info => this.world.players.get(info.pid))
            .filter(player => player && !taken.has(player) && player.cells.length);
        client.player = free.find(player => player.tabId === client.tabId) ?? free[0] ?? null;
        if (client.player) client.player.tabId = client.tabId;
    }

    resetClient(client) {
        if (client.player) client.player.client = client;
        client.known = new Map();
        const pid = client.player ? client.player.pid : 0;

        this.send(client, this.packet(0x12));
        const border = new PacketWriter(37);
        const { minX, maxX, minY, maxY } = this.world.border;
        border.u8(0x41);
        border.f64(minX); border.f64(minY); border.f64(maxX); border.f64(maxY);
        border.u32(pid);
        this.send(client, border.build());

        const restart = new PacketWriter();
        restart.u8(0xfe);
        restart.ucs2(`Practice · attempt ${this.attempt}[]`);
        this.send(client, restart.build());

        // After the border, which recentres a client with no cells on the middle of the map -
        // this says where to put the camera instead, before any cell arrives to ease toward
        const cells = client.player?.cells ?? [];
        client.port.postMessage({
            type: 'reset', attempt: this.attempt, alive: cells.length > 0,
            snapshotId: this.snapshot.id, mode: this.snapshot.mode,
            centre: cells.length ? {
                x: cells.reduce((sum, cell) => sum + cell.x, 0) / cells.length,
                y: cells.reduce((sum, cell) => sum + cell.y, 0) / cells.length,
            } : null,
        });

        for (const cell of client.player?.cells ?? []) this.sendOwn(client, cell.id);
        this.sendNodes(client, { eats: [], removed: [] });
        this.sendLeaderboard(client);
    }

    onPacket(client, view) {
        const opcode = view.getUint8(0);
        const player = client.player;
        switch (opcode) {
            case 0:       // spawn
                if (!this.world) return;
                if (!player) {
                    client.player = new Player(this.world.nextId++, { color: this.randomColor(), tabId: client.tabId });
                    client.player.client = client;
                    this.world.players.set(client.player.pid, client.player);
                    this.resetClient(client);
                }
                if (!client.player.cells.length) {
                    const name = this.readUtf8(view, 1);
                    const match = /^<([^>]*)>(.*)$/s.exec(name);
                    client.player.name = match ? match[2] : name;
                    client.player.skin = match ? match[1] : '';
                    const { x, y } = this.spawnPoint();
                    this.world.spawn(client.player, x, y);
                }
                break;
            case 16:      // cursor
                if (player && view.byteLength >= 17) {
                    player.mouse = { x: view.getFloat64(1, true), y: view.getFloat64(9, true) };
                }
                break;
            case 17:
                if (player) player.splitRequested = true;
                break;
            case 21:
                if (player) player.ejectRequested = true;
                break;
            case 0x56: {  // chat - echoed to every tab, so a multiboxer still sees their own
                const message = this.readUtf8(view, 5);
                for (const other of this.clients) this.sendChat(other, client.player?.name || 'An unnamed cell', message, client.player);
                break;
            }
            case 100:     // ping
                this.send(client, this.packet(100));
                break;
        }
    }

    // Beside the snapshot's own players, so a respawn lands somewhere worth practising
    spawnPoint() {
        let x = 0, y = 0, n = 0;
        for (const cell of this.world.cells.values()) {
            if (cell.kind !== KIND_PLAYER) continue;
            x += cell.x; y += cell.y; n++;
        }
        const { minX, maxX, minY, maxY } = this.world.border;
        if (!n) return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
        const angle = Math.random() * 2 * Math.PI;
        return {
            x: Math.min(Math.max(x / n + Math.cos(angle) * 1500, minX), maxX),
            y: Math.min(Math.max(y / n + Math.sin(angle) * 1500, minY), maxY),
        };
    }

    randomColor() {
        const parts = [0xff, 0x07, Math.floor(Math.random() * 256)].sort(() => Math.random() - 0.5);
        return (parts[0] << 16) | (parts[1] << 8) | parts[2];
    }

    readUtf8(view, offset) {
        const bytes = new Uint8Array(view.buffer, view.byteOffset + offset, view.byteLength - offset);
        const end = bytes.indexOf(0);
        return new TextDecoder().decode(end < 0 ? bytes : bytes.subarray(0, end));
    }

    // ---- The loop ----------------------------------------------------------------------

    start() {
        if (this.timer) return;
        this.nextTickAt = Date.now() + this.world.config.tickMs;
        const loop = () => {
            this.tick();
            // Scheduled against when the tick was due, not when it ran, so lateness does not
            // compound - the same reason as SplitScheduler.pump() in bundle.js
            this.nextTickAt += this.world.config.tickMs;
            const now = Date.now();
            if (this.nextTickAt < now - 200) this.nextTickAt = now;
            this.timer = setTimeout(loop, Math.max(0, this.nextTickAt - now));
        };
        this.timer = setTimeout(loop, this.world.config.tickMs);
    }

    stop() {
        clearTimeout(this.timer);
        this.timer = null;
        this.world = null;
    }

    tick() {
        /**
         *  A tab that closed without saying so. It pings every second, but a tab in the
         *  background long enough has its timers throttled to once a minute - and in a
         *  multibox, one tab always is - so this waits well past that, and a tab that turns
         *  out to be alive after all is taken back the moment it speaks (onMessage).
         */
        const now = Date.now();
        for (const client of [...this.clients]) {
            if (now - client.lastSeen > 150000) this.disconnect(client);
        }
        if (!this.world) return;

        this.world.tick();
        const changes = this.world.drain();
        for (const [pid, id] of changes.added) {
            const owner = this.world.players.get(pid)?.client;
            if (owner) this.sendOwn(owner, id);
        }
        for (const client of this.clients) this.sendNodes(client, changes);
        if (this.world.ticks % 25 === 0) {
            for (const client of this.clients) this.sendLeaderboard(client);
        }
    }

    // ---- Packets -----------------------------------------------------------------------

    send(client, buffer) {
        client.port.postMessage(buffer, [buffer]);
    }

    packet(opcode) {
        const writer = new PacketWriter(1);
        writer.u8(opcode);
        return writer.build();
    }

    sendOwn(client, id) {
        const writer = new PacketWriter(5);
        writer.u8(0x20);
        writer.u32(id);
        this.send(client, writer.build());
    }

    /**
     *  One node packet: what was eaten, every node that is new to this tab or has changed
     *  since it was last sent, and what is gone. The whole world goes to every tab - it is the
     *  snapshot of a viewport or two, which is no more than a real server streams anyway.
     */
    sendNodes(client, { eats, removed }) {
        const writer = new PacketWriter(4096);
        writer.u8(0x10);

        const known = client.known;
        const sentEats = eats.filter(([, eaten]) => known.has(eaten));
        writer.u16(sentEats.length);
        for (const [hunter, eaten] of sentEats) {
            writer.u32(hunter);
            writer.u32(eaten);
            known.delete(eaten);
        }

        for (const cell of this.world.cells.values()) {
            // Truncated, as the server sends them - a cell held at a wall reads 12467, not 12468
            const x = Math.trunc(cell.x), y = Math.trunc(cell.y), size = Math.floor(cell.r);
            const last = known.get(cell.id);
            // Player cells and viruses every tick, the rest when they change - as the server
            // does, so a cell held still against a wall still reads as updated
            const always = cell.kind === KIND_PLAYER || cell.kind === KIND_VIRUS;
            if (last && !always && last.x === x && last.y === y && last.size === size) continue;
            known.set(cell.id, { x, y, size });

            let flags = FLAG_COLOR;
            if (cell.kind === KIND_VIRUS) flags |= FLAG_VIRUS;
            if (cell.kind === KIND_EJECTED) flags |= FLAG_EJECTED;
            if (cell.owner) flags |= FLAG_PARENT;
            const isNew = !last;
            const name = isNew && cell.owner ? cell.owner.name : '';
            const skin = isNew && cell.owner ? cell.owner.skin : '';
            if (name) flags |= FLAG_NAME;
            if (skin) flags |= FLAG_SKIN;

            writer.u32(cell.id);
            writer.i32(x);
            writer.i32(y);
            writer.u16(Math.min(size, 0xffff));
            writer.u8(flags);
            if (flags & FLAG_PARENT) writer.i32(cell.owner.pid);
            writer.u8((cell.color >> 16) & 0xff);
            writer.u8((cell.color >> 8) & 0xff);
            writer.u8(cell.color & 0xff);
            // The client drops the first character, which the real server spends on a '%'
            if (flags & FLAG_SKIN) writer.utf8('%' + skin);
            if (flags & FLAG_NAME) writer.utf8(name);
        }
        writer.u32(0);

        const gone = removed.filter(id => known.has(id));
        writer.u16(gone.length);
        for (const id of gone) {
            writer.u32(id);
            known.delete(id);
        }
        this.send(client, writer.build());
    }

    sendLeaderboard(client) {
        const players = [...this.world.players.values()]
            .map(player => ({ player, mass: player.cells.reduce((sum, cell) => sum + cell.mass, 0) }))
            .filter(entry => entry.mass > 0)
            .sort((a, b) => b.mass - a.mass)
            .slice(0, 10);
        const writer = new PacketWriter();
        writer.u8(0x31);
        writer.u16(players.length);
        players.forEach(({ player }, index) => {
            writer.u16(index + 1);
            writer.u32(player.pid);
            writer.utf8(player.name || 'An unnamed cell');
        });
        this.send(client, writer.build());
    }

    sendChat(client, sender, message, from = null) {
        const writer = new PacketWriter();
        writer.u8(0x56);
        writer.i32(from ? from.pid : -1);
        writer.i32(-1);
        const color = from ? from.color : 0xffffff;
        writer.u8((color >> 16) & 0xff);
        writer.u8((color >> 8) & 0xff);
        writer.u8(color & 0xff);
        writer.utf8(sender);
        writer.utf8(message);
        this.send(client, writer.build());
    }
}

if (typeof module === 'object' && module.exports) {
    module.exports = { PRACTICE_CONFIG, MODE_CONFIG, World, Server, Cell, Player, PacketWriter, massOf, sizeOf };
} else {
    const server = new Server();
    // SharedWorker: one port per tab. Dedicated worker (no SharedWorker here): this tab only.
    if ('onconnect' in self) {
        self.onconnect = event => server.connect(event.ports[0]);
    } else {
        server.connect({ postMessage: (data, transfer) => self.postMessage(data, transfer),
            set onmessage(handler) { self.onmessage = handler; } });
    }
}
