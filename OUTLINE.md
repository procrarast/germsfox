# bundle.js outline

A map of `src/overrides/bundle.js` — the deobfuscated germs.io client we serve in place of the
site's own, via the `declarativeNetRequest` redirect in `overrides.json`.

The tables between `AUTO` markers are generated. Everything else is hand-written and survives
regeneration, including the **what it is** column of the class table.

```sh
python3 util/outline.py     # after anything that moves code
```

<!-- AUTO:STATS -->
`bundle.js` is **8428** lines and holds **36** classes.
<!-- /AUTO:STATS -->

## Layout

| region | lines | notes |
| --- | --- | --- |
| vendored | 20-89 | `Filter` + the two badwords lists, and the little CommonJS shim that serves them. `base64-js`, `ieee754` and `feross/buffer` used to live here too - 2,302 lines, 22% of the file, carried so `BinaryReader`/`BinaryWriter` could use node's Buffer. They now use `DataView`/`TextDecoder`/`TextEncoder` instead, which is what the note here used to ask for. |
| game classes | 141-7500 | see the table below |
| bootstrap | 7501-end | jQuery/DOM wiring, keybind handlers, `var instance = new Game()` |

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
| class                  | lines     | len  | extends                | what it is                                                                    |
|------------------------|-----------|------|------------------------|-------------------------------------------------------------------------------|
| `Filter`               | 24-51     | 28   | -                      | Profanity filter (vendored badwords)                                          |
| `BinaryReader`         | 141-241   | 101  | -                      | Reads the binary protocol off an incoming packet                              |
| `Chat`                 | 246-539   | 294  | -                      | Chat log, emotes, stickers, the /wahbas command                               |
| `GameUI`               | 555-950   | 396  | -                      | In-game HUD: debug panel, leaderboard list, minimap, party text               |
| `PartyMember`          | 956-975   | 20   | -                      | One party member's minimap dot and position                                   |
| `Camera`               | 1189-1340 | 152  | -                      | Position, zoom, frame-rate independent smoothing, cull bounds, spectate drift |
| `TextureCache`         | 1421-1516 | 96   | -                      | Refcounted texture store, freed 10s after refs hit 0                          |
| `NameCache`            | 1518-1561 | 44   | `TextureCache`         | Name-label textures, keyed by name + parent                                   |
| `SkinCache`            | 1607-1646 | 40   | `TextureCache`         | Skin resources; get() returns a SkinResource, not a texture                   |
| `SkinResource`         | 1717-1768 | 52   | -                      | Loads a skin, clips it to a disc, classifies whether it is opaque             |
| `Renderer`             | 1965-2370 | 406  | -                      | Base per-node display object: cull, interpolate, fade corpses, pool           |
| `SpriteRenderer`       | 2377-2480 | 104  | `Renderer`             | Sprite-backed renderer; body texture, skin sprite, rim swap                   |
| `PlayerSpriteRenderer` | 2486-2506 | 21   | `SpriteRenderer`       | Adds name and skin handling on top of SpriteRenderer                          |
| `CellSpriteRenderer`   | 2512-2538 | 27   | `PlayerSpriteRenderer` | Player cells: border, mass label, opacity                                     |
| `VirusSpriteRenderer`  | 2540-2544 | 5    | `PlayerSpriteRenderer` | Virus texture and size                                                        |
| `FoodSpriteRenderer`   | 2546-2585 | 40   | `SpriteRenderer`       | Food and ejected mass; its root IS the sprite, no container                   |
| `Node`                 | 2594-2739 | 146  | -                      | Server state for one entity: position, size, colour, eaten                    |
| `FoodNode`             | 2749-2771 | 23   | `Node`                 | Food and ejected mass; shape, and the theme key that exempts ejected          |
| `CellNode`             | 2773-2776 | 4    | `Node`                 | A player cell                                                                 |
| `VirusNode`            | 2778-2783 | 6    | `Node`                 | A virus                                                                       |
| `Pool`                 | 2785-2904 | 120  | -                      | Per-type node/renderer recycling, with ceilings and peak tracking             |
| `PingWriter`           | 2929-2937 | 9    | -                      | Packet: keepalive                                                             |
| `ProtocolWriter`       | 2938-2948 | 11   | -                      | Packet: protocol + Cloudflare token (verification handshake)                  |
| `LoginWriter`          | 2949-2958 | 10   | -                      | Packet: account uuid                                                          |
| `SpectateWriter`       | 2959-2967 | 9    | -                      | Packet: begin spectating                                                      |
| `NameWriter`           | 2968-2977 | 10   | -                      | Packet: nickname (spawn)                                                      |
| `ChatWriter`           | 2978-2988 | 11   | -                      | Packet: chat message                                                          |
| `MouseWriter`          | 2989-2999 | 11   | -                      | Packet: cursor/view position, sent every 40ms                                 |
| `SplitWriter`          | 3000-3013 | 14   | -                      | Packet: split                                                                 |
| `EjectWriter`          | 3014-3022 | 9    | -                      | Packet: eject mass                                                            |
| `PartyWriter`          | 3023-3035 | 13   | -                      | Packet: party create/join/leave                                               |
| `BinaryWriter`         | 3047-3124 | 78   | -                      | Builds outgoing packets                                                       |
| `Network`              | 3145-4019 | 875  | -                      | Socket, verification handshake, every opcode handler, tick measurement        |
| `Settings`             | 4072-4471 | 400  | -                      | The settings blob, defaults merge, and the side effects each change fans out  |
| `Login`                | 4472-5130 | 659  | -                      | Account, XP, shop, skin ownership                                             |
| `Game`                 | 5132-7671 | 2540 | -                      | Everything else: the frame loop, input, node map, spectate, split queue       |
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
- **Every split goes through `Game.queueSplits()`.** There is exactly one `new packet.Split()`
  in the file, in `releaseSplit()`, and the pacing only works if nothing bypasses it.
- **`splitQueue` holds runs, not splits.** One press is one run, carrying its own packet count
  and its own cadence, because a rushed run and a paced one are counted in different units
  (`SPLIT_RUSH_COPIES` packets per split vs one) and drain at different rates. Collapsing them
  into a shared total and a shared spacing is what let a paced macro adopt a rushed one's
  cadence and silently destroy queued copies. `SPLIT_QUEUE_MAX` counts *logical* splits across
  every run - see the `queuedSplits` getter, not `splitQueue.length`.
- **Texture caches are refcounted.** `hold`/`release`, freed 10s after refs hit 0. A release
  path must blank its sprite *before* releasing, or the source is destroyed while still drawn -
  silent corruption under WebGL, a thrown `BindGroup` error under WebGPU.
- **`cellContainer` holds food, viruses and players together**, size-sorted, with one attach
  point. That is why a container-level filter cannot target player cells only.

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
- **A rushed macro used to overshoot by one split, and did so ~92% of the time.** Two causes,
  both now fixed; kept here because the reasoning is what the numbers in `queueSplits()` rest on.

  *Structural:* `count * SPLIT_RUSH_COPIES` packets at `tick/COPIES` span `count*tick - tick/3`,
  and the ticks that can consume them are those in `(0, span + tick]` - so the blanket clipped a
  `count+1`th tick at two thirds of all tick phases. A run short of the cap is now trimmed to
  `(count-1)*COPIES + 1` packets, ending on the last tick it must cover. Same speed, since the
  run still finishes on the same tick. Past the cap the full blanket is kept: the surplus is
  discarded there anyway, and a trimmed run's end ticks carry one packet each, so losing one to
  jitter would cost a split.

  *Drift:* `pumpSplits()` anchored each hop on the achieved release time, so `setTimeout`
  lateness compounded. Measured in the page, a 4x that should span 146.7ms spanned **156.6ms**,
  pushing it from 67% overshoot to ~92%. Scheduling against the time each packet was *due*
  brings it to **-0.5ms**. An isolated timer loop shows almost no drift - it only appears when
  the timers compete with the render loop, so measure in the running game, not in a test page.

  Measured after both fixes: uncapped 4x spans 119.6ms → 4 splits at 99% of phases; capped 4x
  spans 146.9ms → the deliberate 4-or-5. Reproduce with `node util/ticksim.js` (model) and the
  span measurement in the page (reality).
- **The server's tick grid is near-perfect; what varies is delivery.** Fitting arrivals to
  `phase + k*period` gives period **40.00ms** with a residual SD of **2.05ms** (839 packets,
  zero skipped slots). Round-trip jitter measured **5.18ms**, so the outbound leg is about
  `sqrt(5.18^2 - 2.05^2)` = **4.75ms** - outbound is the noisier direction. This is what
  `splitSpacing` sizes its margin from.
- **Pongs are handled on arrival, not on a tick.** Pinging at deliberately spread phases and
  measuring where the reply lands against the tick grid: pong phase is ~uniform (circular
  R=0.20) while pong-minus-send is clustered (R=0.72). So a pong cannot tell you where your
  packet fell inside the server's tick window - which closes the cheap route to aiming splits
  at a tick boundary. See "phase-locked pacing" below.
- **Phase-locked pacing is gated on one unknown, and it is not jitter.** One split per tick
  (40ms instead of `splitSpacing`'s 58) needs each packet aimed at the middle of a tick window.
  Aiming needs the absolute send-to-tick offset. Jitter is not the obstacle: 20ms of half-window
  against 4.75ms of outbound SD is 4.2 sigma. The obstacle is path asymmetry - `rtt/2` is only
  a guess at the outbound leg, and being wrong by ~20ms puts every packet of a run on a
  boundary. It would have to self-calibrate from splits observed landing during play. Worth
  ~31% on paced macros; not attempted.
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
| name                        | line | value                                            |
|-----------------------------|------|--------------------------------------------------|
| `UTF8_DECODER`              | 138  | `new TextDecoder('utf-8')`                       |
| `UTF8_ENCODER`              | 139  | `new TextEncoder()`                              |
| `CELL_COUNT_CAPS`           | 544  | `{`                                              |
| `CULL_MARGIN`               | 978  | `64`                                             |
| `SPLIT_JITTER_MARGIN`       | 997  | `18`                                             |
| `SPLIT_QUEUE_MAX`           | 1008 | `8`                                              |
| `SPLIT_RUSH_COPIES`         | 1024 | `3`                                              |
| `MAX_SPLIT_MODE`            | 1038 | `'Self Feed'`                                    |
| `SPLIT_SPACING_MIN`         | 1039 | `45`                                             |
| `SPLIT_SPACING_MAX`         | 1040 | `90`                                             |
| `SERVER_TICK_ESTIMATE`      | 1049 | `40`                                             |
| `TICK_COALESCE_MS`          | 1050 | `10`                                             |
| `TICK_STALL_MS`             | 1051 | `100`                                            |
| `TICK_EMA`                  | 1052 | `0.05`                                           |
| `TICK_PHASE_EMA`            | 1065 | `0.1`                                            |
| `TICK_JITTER_EMA`           | 1066 | `0.02`                                           |
| `JITTER_ABS_TO_GAP_SD`      | 1076 | `1.2533 * Math.SQRT2`                            |
| `SPLIT_JITTER_SIGMAS`       | 1087 | `4`                                              |
| `UNIFORM_BATCH_RENDERABLES` | 1109 | `8192`                                           |
| `ZOOM_STEP`                 | 1139 | `0.9`                                            |
| `ZOOM_SENSITIVITY_RANGE`    | 1140 | `4`                                              |
| `SPECTATE_CURVE`            | 1142 | `1.25`                                           |
| `FREE_SPEC_SPEED`           | 1149 | `20`                                             |
| `MOUSE_SEND_PERIOD`         | 1155 | `40`                                             |
| `GF_DIAG`                   | 1165 | `{`                                              |
| `MS_PER_DELTA`              | 1177 | `1000 / 60`                                      |
| `ZOOM_SYNC_DEBOUNCE`        | 1184 | `150`                                            |
| `ZOOM_MIN`                  | 1186 | `0.01`                                           |
| `ZOOM_MAX`                  | 1187 | `5`                                              |
| `MASS_FONT`                 | 1570 | `'GermsfoxMass'`                                 |
| `DEBUG_LABELS`              | 1571 | `['Mass:', 'Score:', 'Cells:', 'FPS:', 'PING...` |
| `MASS_FONT_SIZE`            | 1573 | `75;       // atlas size, and the rendered s...` |
| `MASS_FONT_SIZE_FULL`       | 1574 | `60;  // unshortened values are longer, so t...` |
| `SKIN_OPACITY_PROBE`        | 1657 | `64`                                             |
| `SKIN_OPACITY_MIN_ALPHA`    | 1668 | `224`                                            |
| `COLOR_PRESETS`             | 1777 | `{`                                              |
| `THEME_SLOTS`               | 1787 | `{`                                              |
| `LOD_SCALE`                 | 1847 | `25`                                             |
| `CONVERGE_EPSILON`          | 1850 | `0.01`                                           |
| `EATEN_FADE_DEPTH`          | 1858 | `0.383`                                          |
| `EATEN_FADE_TIME`           | 1873 | `0.956`                                          |
| `PARKED_Z_INDEX`            | 1882 | `-1e9`                                           |
| `CELL_COMPACT_THRESHOLD`    | 1892 | `384`                                            |
| `WRITER_CHUNK`              | 3045 | `1024`                                           |
| `DISPLAY_PREFERENCES`       | 4042 | `['all', 'party', 'self', 'none']`               |
| `PARTY_ARROW_SIZE`          | 4051 | `52;      // on-screen pixels along the arro...` |
| `PARTY_ARROW_MARGIN`        | 4052 | `34;    // how far the tip sits in from the ...` |
| `PARTY_ARROW_ALPHA`         | 4053 | `0.85`                                           |
| `PARTY_ARROW_HYSTERESIS`    | 4061 | `8`                                              |
| `SETTINGS_NOT_SYNCED`       | 4063 | `new Set([`                                      |
| `GERMSFOX_BRIDGE_CALLABLE`  | 7836 | `{`                                              |
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
