# bundle.js outline

A map of `src/overrides/bundle.js` — the deobfuscated germs.io client we serve in place of the
site's own, via the `declarativeNetRequest` redirect in `overrides.json`.

The tables between `AUTO` markers are generated. Everything else is hand-written and survives
regeneration, including the **what it is** column of the class table.

```sh
python3 util/outline.py     # after anything that moves code
```

<!-- AUTO:STATS -->
`bundle.js` is **9517** lines and holds **38** classes.
<!-- /AUTO:STATS -->

## Layout

| region | lines | notes |
| --- | --- | --- |
| vendored | 20-89 | `Filter` + the two badwords lists, and the little CommonJS shim that serves them. `base64-js`, `ieee754` and `feross/buffer` used to live here too - 2,302 lines, 22% of the file, carried so `BinaryReader`/`BinaryWriter` could use node's Buffer. They now use `DataView`/`TextDecoder`/`TextEncoder` instead, which is what the note here used to ask for. |
| game classes | 141-8665 | see the table below |
| bootstrap | 8666-end | jQuery/DOM wiring, keybind handlers, `var instance = new Game()` |

`src/overrides/lib/pixi.js` is PIXI v8, vendored whole. The page loads jQuery, Bootstrap 4 and
a colour picker itself, so `$` is germs.io's, not ours — we cannot remove it.

## The other half of the extension

`bundle.js` runs in the page's MAIN world. These run in the isolated content-script world and
cannot see its globals; they talk to it over `postMessage` through `bridge.js`.

| file | role |
| --- | --- |
| `src/bridge.js` | the only `postMessage` listener; `germsfoxGetState()` (500ms timeout), `germsfoxCall()` |
| `src/dom.js` | all injected UI - daily leaderboard, settings pane, player menu, emotes, update notice |
| `src/content.js` | `init()`: loads settings, then calls every `render*` in order |
| `src/storage.js` | `DEFAULT_SETTINGS`, `getSettings()`, `setSetting()` - `chrome.storage.local` |
| `src/background.js` | service worker: skins, leaderboard API, the MAIN-world URL injection |
| `src/style.css` | styles for everything `dom.js` injects |

## Classes

<!-- AUTO:CLASSES -->
| class                   | lines     | len  | extends                | what it is                                                                      |
|-------------------------|-----------|------|------------------------|---------------------------------------------------------------------------------|
| `Filter`                | 24-51     | 28   | -                      | Profanity filter (vendored badwords)                                            |
| `BinaryReader`          | 141-241   | 101  | -                      | Reads the binary protocol off an incoming packet                                |
| `Chat`                  | 246-563   | 318  | -                      | Chat log, emotes, stickers, the /wahbas command                                 |
| `GameUI`                | 648-1066  | 419  | -                      | In-game HUD: debug panel, leaderboard list, minimap, party text                 |
| `PartyMember`           | 1072-1091 | 20   | -                      | One party member's minimap dot and position                                     |
| `SplitScheduler`        | 1222-1528 | 307  | -                      | Every split: exact runs wait on confirmations, 16x blankets and makes up losses |
| `Camera`                | 1630-1780 | 151  | -                      | Position, zoom, frame-rate independent smoothing, cull bounds, spectate drift   |
| `TextureCache`          | 1951-2046 | 96   | -                      | Refcounted texture store, freed 10s after refs hit 0                            |
| `NameCache`             | 2048-2091 | 44   | `TextureCache`         | Name-label textures, keyed by name + parent                                     |
| `SkinCache`             | 2137-2176 | 40   | `TextureCache`         | Skin resources; get() returns a SkinResource, not a texture                     |
| `SkinResource`          | 2247-2298 | 52   | -                      | Loads a skin, clips it to a disc, classifies whether it is opaque               |
| `Renderer`              | 2530-3016 | 487  | -                      | Base per-node display object: cull, interpolate, fade corpses, pool             |
| `SpriteRenderer`        | 3023-3126 | 104  | `Renderer`             | Sprite-backed renderer; body texture, skin sprite, rim swap                     |
| `PlayerSpriteRenderer`  | 3132-3152 | 21   | `SpriteRenderer`       | Adds name and skin handling on top of SpriteRenderer                            |
| `CellSpriteRenderer`    | 3158-3184 | 27   | `PlayerSpriteRenderer` | Player cells: border, mass label, opacity                                       |
| `VirusSpriteRenderer`   | 3186-3190 | 5    | `PlayerSpriteRenderer` | Virus texture and size                                                          |
| `EjectedSpriteRenderer` | 3192-3230 | 39   | `SpriteRenderer`       | Ejected mass: one tinted food-shape sprite, player-themed                       |
| `PelletRenderer`        | 3254-3348 | 95   | `Renderer`             | Food pellets as particles in pelletLayer; does nothing at rest                  |
| `Node`                  | 3357-3501 | 145  | -                      | Server state for one entity: position, size, colour, eaten                      |
| `FoodNode`              | 3511-3534 | 24   | `Node`                 | Food and ejected mass; pellet shape; ejected takes the player theme             |
| `CellNode`              | 3536-3539 | 4    | `Node`                 | A player cell                                                                   |
| `VirusNode`             | 3541-3546 | 6    | `Node`                 | A virus                                                                         |
| `Pool`                  | 3551-3691 | 141  | -                      | Per-type node/renderer recycling, with ceilings and peak tracking               |
| `PingWriter`            | 3716-3724 | 9    | -                      | Packet: keepalive                                                               |
| `ProtocolWriter`        | 3725-3735 | 11   | -                      | Packet: protocol + Cloudflare token (verification handshake)                    |
| `LoginWriter`           | 3736-3745 | 10   | -                      | Packet: account uuid                                                            |
| `SpectateWriter`        | 3746-3754 | 9    | -                      | Packet: begin spectating                                                        |
| `NameWriter`            | 3755-3764 | 10   | -                      | Packet: nickname (spawn)                                                        |
| `ChatWriter`            | 3765-3775 | 11   | -                      | Packet: chat message                                                            |
| `MouseWriter`           | 3776-3786 | 11   | -                      | Packet: cursor/view position, sent every 40ms                                   |
| `SplitWriter`           | 3787-3800 | 14   | -                      | Packet: split                                                                   |
| `EjectWriter`           | 3801-3809 | 9    | -                      | Packet: eject mass                                                              |
| `PartyWriter`           | 3810-3822 | 13   | -                      | Packet: party create/join/leave                                                 |
| `BinaryWriter`          | 3834-3911 | 78   | -                      | Builds outgoing packets                                                         |
| `Network`               | 3932-4789 | 858  | -                      | Socket, verification handshake, every opcode handler, tick measurement          |
| `Settings`              | 4842-5252 | 411  | -                      | The settings blob, defaults merge, and the side effects each change fans out    |
| `Login`                 | 5253-5911 | 659  | -                      | Account, XP, shop, skin ownership                                               |
| `Game`                  | 5913-8751 | 2839 | -                      | Everything else: the frame loop, input, node map, spectate, split keys          |
<!-- /AUTO:CLASSES -->

## The frame

`Game.render(tick)` is the whole loop, added to a `PIXI.Ticker` in `start()`. Order matters and
some of it is deliberately a frame stale:

1. `updateTime`, `delta`, `frames`
2. `camera.updateBounds()` - **uses last frame's camera**, so culling trails one frame; the margin in `isVisible()` covers it
3. node loop: `renderer.tick()` for every node
4. camera target - alive: centroid of `cell.renderer.x` weighted by `cell.size`; else the freeSpec pan
5. `camera.tick()`
6. party positions, `ui.updateMinimap()`
7. `cellContainer.sortChildren()`, `compactCellContainer()`
8. `stage.x/y/scale` from the camera
9. `renderer.render(stage)`

`sendMouse` is **not** in this loop - it is a 40ms `setInterval` set up in `start()`, alongside
the ping, score-submission and ad intervals.

## Invariants worth not breaking

- **Colour is derived, never assigned.** The server's colour lives in `node.baseColor`; the
  displayed one comes from `applyTheme()`. Writing `node.color` directly loses the theme.
- **`isEjected` is set before `applyTheme()`** in node init, because `FoodNode.themeKey` reads it.
- **Every split goes through `Game.splits` (`SplitScheduler`)** - Space, the macros, a held key.
  The only other `new packet.Split()` is the Old Split Macros toggle. A split sent around the
  scheduler can share a tick with one of its own, and the server drops one of the two.
- **Splits are counted by confirmation, per tick.** `handleAddNode` calls `splits.onOwnCell()`
  and `handleNodes` calls `splits.onTick()`; a tick's own-cell packets arrive just *ahead* of its
  node packet, so everything between two node packets is one split however many cells it made.
  Exact runs wait on this, and 16x keeps count by it - neither works if either call moves.
- **The queue holds presses, not splits.** Exact runs and blankets are counted in different
  units (one packet per split vs `SPLIT_RUSH_COPIES`), so `SPLIT_QUEUE_MAX` counts *logical*
  splits - see `SplitScheduler.queued`, not `runs.length`.
- **Texture caches are refcounted.** `hold`/`release`, freed 10s after refs hit 0. A release
  path must blank its sprite *before* releasing, or the source is destroyed while still drawn -
  silent corruption under WebGL, a thrown `BindGroup` error under WebGPU.
- **`cellContainer` holds ejected mass, viruses and players together**, size-sorted, with one
  attach point. That is why a container-level filter cannot target player cells only.
- **Pellets are not in it.** They are particles in `pelletLayer`, a `ParticleContainer` directly
  beneath it - see `PelletRenderer`. That is the order they always drew in, since a pellet is
  smaller than anything in `cellContainer`. Pellets and ejected mass share `nodeType.Food` on the
  wire, so the pool keys on `Pool.kindOf()`, never on the type alone. Pellets are not culled, and
  Hide Food hides the whole layer.

## Traps

Things that have cost real debugging time here:

- **`Node` is shadowed.** The bundle defines its own `Node` class, so `Node.TEXT_NODE` is
  `undefined`. Use `node.nodeName === '#text'`.
- **`JSON.stringify` prints `NaN` as `null`.** A state dump showing `null` may be `NaN`; check
  with `typeof` / `Number.isFinite`. This hid a `lastMouseSent` poisoning for a long time.
- **The extension serves resources one revision stale**, sometimes for several reloads. Verify a
  known marker is present before trusting any measurement against the running code.
- **`fetch()`ing the bundle URL from the page returns vanilla germs.io**, not our override - the
  DNR redirect does not apply to page-initiated fetches. It cannot tell you what is live.
- **`playerCells` keeps eaten cells for the whole fade (~1s)**, so `playerCells.size > 0` does
  not mean "alive". Guard on `aliveCell`.
- **Background tabs freeze `requestAnimationFrame` and CSS transitions.** To stage a fade, force
  a reflow (`void el.offsetWidth`) instead of waiting a frame.
- **`setInterval` does not replay missed background fires**, so there is no catch-up burst.
- **Bootstrap classes are inert here.** `.tab-content` and `.fas.fa-times` carry no styling; the
  game's look lives in the `#settingsTabsContent` / `#settingsClose` **id** rules.
- **Content-script `console` output is not captured** by the browser-console tooling; only the
  page's own console is.

## Measured facts

- **Server tick is 40ms (25Hz)** - 2,465 ticks sampled on `us.germs.io`, mean 39.2ms. Arrival
  jitter is wide: p10 26.3ms, p90 49.4ms, p99 95ms.
- **Draw calls are ~1 per frame.** Everything is batched sprites; the batcher binds 16 texture
  units, so draw count scales with *distinct skins*, not cell count.
- **Frame cost is measured with `util/perfprobe.js`**, against the live lobby or a seeded
  synthetic crowd. Compare only runs from the same sitting, interleaved: on one machine in one
  day the same scenario read anywhere from 4ms to 17ms a frame. What held relative to itself:
  - A real lobby costs well under 1ms a frame. The crowds are headroom, not a visible stutter.
  - Under churn the PIXI instruction set rebuilds **every** frame, and not because of zIndex:
    spawns and deaths toggle `visible` (park/unpark) and culling toggles it at the screen edge,
    and PIXI rebuilds on either. Writing `_zIndex` quietly and sorting only on a real order
    violation was tried and measured a wash - the sort stopped running but rebuilt frames did
    not move, and ~70% of the time the order really had changed (ejected mass grows through
    the same-sized pellets). Do not retry it.
  - Rebuild cost scales with *children*, not with what moved. 2,000 static pellets cost ~2.8ms
    a frame in the churn crowd (node loop 1.0, sort 0.3, rebuild 1.4) purely by being in
    `cellContainer`. Moving them to `pelletLayer` measured, interleaved: churn4k 7.50/7.30ms
    -> 5.32/5.22ms (rebuild 2.27 -> 1.14, sort 0.61 -> 0.24), static2k 2.16/1.99 -> 1.87/1.45ms.
- **`CELL_COUNT_CAPS` is a hardcoded mirror** of the game's per-mode split caps, not something
  the server sends.
- **Opcode `0x11` never arrives.** The follow-camera packet is dead protocol surface and its
  handler has been removed.
- **The server queues a spectate position for a tick before acting on it.** Stepping the
  requested view 20,000 units with the camera held still and timing the first node past the old
  viewport gives onset − ping, in tick periods. Three sessions, `util/leadprobe.js`:

  | region | trials | onset | wait |
  | --- | --- | --- | --- |
  | empty, map edge | 6 | 100-120ms @ 53ms ping | **1.50 ticks** |
  | crowded | 5 | 140-180ms @ 56ms ping | **2.77 ticks** |
  | crowded | 6 | 140-180ms @ 51ms ping | **2.66 ticks** |

  1.5 is half a tick to the next boundary plus one whole tick - the tick *after* the one that
  receives a position is the one that acts on it. It is not a constant: the wait grows with
  load, and the crowded figure replicates. `Game.leadMs()` is calibrated to the low end
  deliberately, because over-leading starves the trailing edge and the slack there is only
  ~400 units when the streamed box is at its narrowest. Re-measure before retuning.
- **How the server takes splits** - measured live on `us.germs.io` (Ultra, empty lobby, 9,900
  spawn mass, cursor pinned to centre so cells merge between trials), 2026-09-24:
  - It performs **at most one split per tick** and drops the rest: three packets sent in the
    same millisecond turned 1 cell into 2.
  - Each split is **confirmed** by own-cell (0x20) packets that arrive with the node packet of
    the tick that performed it, within ~2ms of the fitted tick grid.
  - Send-to-confirmation has a **hard floor** - 56-64ms at ~55ms ping, re-measured across a
    server reset - and a **one-sided late tail**: of 113 lone splits aimed just after a tick
    boundary, 77% landed in that tick, 17% one late, 6% two late, **none early**. The slips
    come in clustered episodes and do not follow ping (53-132ms) or cell count (1-44).
  - The line also **stalls**: several tick reports arrive in one burst, and the copies sent
    during the stall are delivered together and collapse into one tick.
  - Any open-loop schedule loses a split whenever a slipped split collides with the next one.
    Interleaved presses from 1 cell:

    | macro | schedule | exact | under | over | to last split |
    | --- | --- | --- | --- | --- | --- |
    | 3x | old: paced 58ms | 14/23 | 9 | 0 | 203ms |
    | 3x | closed loop (shipped) | 21/21, 6/6 | 0 | 0 | 265ms |
    | 2x | closed loop (shipped) | 5/5 | 0 | 0 | 159ms |
    | 4x | one packet aimed per tick | 13/18 | 5 | 0 | - |
    | 4x | old: trimmed blanket | 16/22 | 3 | 3 | ~200ms |
    | 4x | blanket + fixed top-up after | 9/13 | 2 | 2 | slower |
    | 4x | blanket + in-flight makeup (shipped) | 20/20 | 0 | 0 | 192ms (p90 218) |

  Trials need 1-2s each for cells to merge back, and Ultra decays mass fast enough to need a
  respawn every few minutes - which is why the samples are small. `util/ticksim.js` models
  this, but its per-packet slip model gets the open-loop blanket's odds wrong (it prints the
  disagreement), so it is a check on the scheduler's logic, not a forecast.
- **`setTimeout` lateness compounds unless scheduled against when a packet was *due*.** Anchored
  on the achieved release time, a 4x that should span 146.7ms spanned **156.6ms**; against the
  due time, **-0.5ms**. It only shows when timers compete with the render loop - measure in the
  running game. `SplitScheduler.pump()` keeps doing this.
- **The server's tick grid is near-perfect; what varies is delivery.** Fitting arrivals to
  `phase + k*period` gives period **40.00ms** with a residual SD of **2.05ms** (839 packets,
  zero skipped slots). Round-trip jitter measured **5.18ms**, so the outbound leg is about
  `sqrt(5.18^2 - 2.05^2)` = **4.75ms** - outbound is the noisier direction. (That jitter is
  small next to the server's own late-split tail, below - it is not what limits split pacing.)
- **Pongs are handled on arrival, not on a tick.** Pinging at deliberately spread phases and
  measuring where the reply lands against the tick grid: pong phase is ~uniform (circular
  R=0.20) while pong-minus-send is clustered (R=0.72). So a pong cannot tell you where your
  packet fell inside the server's tick window. Splits can: see "how the server takes splits".
- **Phase-locked pacing was tried and is not worth it.** The unknown this note used to name -
  the send-to-tick offset - turned out to be directly measurable from split confirmations (the
  latency floor above), so path asymmetry was never the obstacle. The obstacle is the server's
  late-split tail: aimed one per tick, 4x still came out short 5 times in 18. Closed-loop
  confirmation is what fixed consistency, not aim.
- **There is no server-side pan speed cap.** The served window re-centres on whatever position
  is sent, traversing 20,000 units in a few hundred ms in both directions - a MultiOgar-style
  cap of ~78 units/tick would take ~10s. So free-spectate lag is a lead problem, not a reason to
  bound the pan rate.
- **The streamed box is ~1.1-1.7x the screen width**, which is the slack that hides small lead
  errors. The node-set bounding box is only a rough proxy for it: it trails the true view
  because the client holds nodes until their destroy packets land, so it cannot resolve a lead
  change of a few hundred units. Time the onset instead of measuring the centre.

## Constants

<!-- AUTO:CONSTANTS -->
| name                          | line | value                                            |
|-------------------------------|------|--------------------------------------------------|
| `UTF8_DECODER`                | 138  | `new TextDecoder('utf-8')`                       |
| `UTF8_ENCODER`                | 139  | `new TextEncoder()`                              |
| `CHAT_COOLDOWN`               | 585  | `1500`                                           |
| `FEED_COPIES`                 | 589  | `2`                                              |
| `FEED_PERIOD_MIN`             | 592  | `10`                                             |
| `HOT_SETTINGS`                | 604  | `[`                                              |
| `AUTOSPLIT_MASS_CAPS`         | 610  | `{`                                              |
| `AUTOSPLIT_WARN_FROM`         | 618  | `0.8`                                            |
| `CELL_COUNT_CAPS`             | 637  | `{`                                              |
| `CULL_MARGIN`                 | 1094 | `64`                                             |
| `SPLIT_QUEUE_MAX`             | 1125 | `8`                                              |
| `HELD_SPLIT_DELAY`            | 1133 | `400`                                            |
| `HELD_SPLIT_POLL`             | 1136 | `10`                                             |
| `SPLIT_RUSH_COPIES`           | 1150 | `3`                                              |
| `SPLIT_LATENCY_DEFAULT`       | 1153 | `60`                                             |
| `SPLIT_SLIP_TICKS`            | 1160 | `2`                                              |
| `SPLIT_SAMPLE_WINDOW`         | 1163 | `24`                                             |
| `SPLIT_SAMPLES_MIN`           | 1164 | `8`                                              |
| `SPLIT_RUSH_EXTEND_MAX`       | 1176 | `3`                                              |
| `SERVER_TICK_ESTIMATE`        | 1185 | `40`                                             |
| `TICK_COALESCE_MS`            | 1186 | `10`                                             |
| `TICK_STALL_MS`               | 1187 | `100`                                            |
| `TICK_EMA`                    | 1188 | `0.05`                                           |
| `UNIFORM_BATCH_RENDERABLES`   | 1550 | `8192`                                           |
| `ZOOM_STEP`                   | 1580 | `0.9`                                            |
| `ZOOM_SENSITIVITY_RANGE`      | 1581 | `4`                                              |
| `SPECTATE_CURVE`              | 1583 | `1.25`                                           |
| `FREE_SPEC_SPEED`             | 1590 | `20`                                             |
| `MOUSE_SEND_PERIOD`           | 1596 | `40`                                             |
| `GF_DIAG`                     | 1606 | `{`                                              |
| `MS_PER_DELTA`                | 1618 | `1000 / 60`                                      |
| `ZOOM_SYNC_DEBOUNCE`          | 1625 | `150`                                            |
| `ZOOM_MIN`                    | 1627 | `0.01`                                           |
| `ZOOM_MAX`                    | 1628 | `5`                                              |
| `MASS_FONT`                   | 2100 | `'GermsfoxMass'`                                 |
| `DEBUG_LABELS`                | 2101 | `['Mass:', 'Score:', 'Cells:', 'FPS:', 'PING...` |
| `MASS_FONT_SIZE`              | 2103 | `75;       // atlas size, and the rendered s...` |
| `MASS_FONT_SIZE_FULL`         | 2104 | `60;  // unshortened values are longer, so t...` |
| `SKIN_OPACITY_PROBE`          | 2187 | `64`                                             |
| `SKIN_OPACITY_MIN_ALPHA`      | 2198 | `224`                                            |
| `COLOR_PRESETS`               | 2307 | `{`                                              |
| `THEME_SLOTS`                 | 2317 | `{`                                              |
| `LOD_SCALE`                   | 2377 | `25`                                             |
| `CONVERGE_EPSILON`            | 2380 | `0.01`                                           |
| `EATEN_FADE_DEPTH`            | 2388 | `0.383`                                          |
| `EATEN_FADE_TIME`             | 2403 | `0.956`                                          |
| `PARKED_Z_INDEX`              | 2412 | `-1e9`                                           |
| `CELL_COMPACT_THRESHOLD`      | 2422 | `384`                                            |
| `LINESPLIT_RING_TEXTURE_SIZE` | 2490 | `256`                                            |
| `LINESPLIT_RING_THICKNESS`    | 2491 | `0.03;  // of the texture's width`               |
| `LINESPLIT_RING_SCALE`        | 2492 | `1.08;      // outer edge, as a multiple of ...` |
| `PELLET_KIND`                 | 3549 | `'pellet'`                                       |
| `WRITER_CHUNK`                | 3832 | `1024`                                           |
| `DISPLAY_PREFERENCES`         | 4812 | `['all', 'party', 'self', 'none']`               |
| `PARTY_ARROW_SIZE`            | 4821 | `52;      // on-screen pixels along the arro...` |
| `PARTY_ARROW_MARGIN`          | 4822 | `34;    // how far the tip sits in from the ...` |
| `PARTY_ARROW_ALPHA`           | 4823 | `0.85`                                           |
| `PARTY_ARROW_HYSTERESIS`      | 4831 | `8`                                              |
| `SETTINGS_NOT_SYNCED`         | 4833 | `new Set([`                                      |
| `GERMSFOX_BRIDGE_CALLABLE`    | 8922 | `{`                                              |
<!-- /AUTO:CONSTANTS -->

## Protocol

Handlers dispatched from `Network.onMessage`.

<!-- AUTO:OPCODES -->
| opcode | dec | handler                   |
|--------|-----|---------------------------|
| `0x10` | 16  | `handleNodes()`           |
| `0x14` | 20  | `handleClear()`           |
| `0x20` | 32  | `handleAddNode()`         |
| `0x31` | 49  | `handleLeaderboardFFA()`  |
| `0x32` | 50  | `handleLeaderboardText()` |
| `0x41` | 65  | `handleBorder()`          |
| `0x55` | 85  | `handlePartyCode()`       |
| `0x56` | 86  | `handleChat()`            |
| `0x57` | 87  | `handleParty()`           |
| `0x58` | 88  | `handleLevel()`           |
| `0x64` | 100 | `handlePong()`            |
| `0x77` | 119 | `handleRadius()`          |
| `0xfe` | 254 | `handleRestart()`         |
<!-- /AUTO:OPCODES -->
