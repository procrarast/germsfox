# bundle.js outline

A map of `src/overrides/bundle.js` — the deobfuscated germs.io client we serve in place of the
site's own, via the `declarativeNetRequest` redirect in `overrides.json`.

The tables between `AUTO` markers are generated. Everything else is hand-written and survives
regeneration, including the **what it is** column of the class table.

```sh
python3 util/outline.py     # after anything that moves code
```

<!-- AUTO:STATS -->
`bundle.js` is **9852** lines and holds **36** classes.
<!-- /AUTO:STATS -->

## Layout

| region | lines | notes |
| --- | --- | --- |
| vendored | 20-2391 | `Filter` + badwords, `base64-js`, `ieee754`, `feross/buffer`. ~25% of the file. `base64`/`ieee754` exist only to serve `buffer`, and `buffer` only to serve `BinaryReader`/`BinaryWriter`, which touch 13 methods that `DataView`/`TextDecoder` all provide natively. |
| game classes | 2455-8905 | see the table below |
| bootstrap | 8906-end | jQuery/DOM wiring, keybind handlers, `var instance = new Game()` |

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
| `BinaryReader`         | 2455-2536 | 82   | -                      | Reads the binary protocol off an incoming packet                              |
| `Chat`                 | 2540-2870 | 331  | -                      | Chat log, emotes, stickers, the /wahbas command                               |
| `GameUI`               | 2886-3281 | 396  | -                      | In-game HUD: debug panel, leaderboard list, minimap, party text               |
| `PartyMember`          | 3287-3306 | 20   | -                      | One party member's minimap dot and position                                   |
| `Camera`               | 3479-3608 | 130  | -                      | Position, zoom, frame-rate independent smoothing, cull bounds, spectate drift |
| `TextureCache`         | 3638-3749 | 112  | -                      | Refcounted texture store, freed 10s after refs hit 0                          |
| `NameCache`            | 3751-3794 | 44   | `TextureCache`         | Name-label textures, keyed by name + parent                                   |
| `SkinCache`            | 3840-3879 | 40   | `TextureCache`         | Skin resources; get() returns a SkinResource, not a texture                   |
| `SkinResource`         | 3950-4001 | 52   | -                      | Loads a skin, clips it to a disc, classifies whether it is opaque             |
| `Renderer`             | 4198-4603 | 406  | -                      | Base per-node display object: cull, interpolate, fade corpses, pool           |
| `SpriteRenderer`       | 4610-4713 | 104  | `Renderer`             | Sprite-backed renderer; body texture, skin sprite, rim swap                   |
| `PlayerSpriteRenderer` | 4719-4739 | 21   | `SpriteRenderer`       | Adds name and skin handling on top of SpriteRenderer                          |
| `CellSpriteRenderer`   | 4745-4771 | 27   | `PlayerSpriteRenderer` | Player cells: border, mass label, opacity                                     |
| `VirusSpriteRenderer`  | 4773-4777 | 5    | `PlayerSpriteRenderer` | Virus texture and size                                                        |
| `FoodSpriteRenderer`   | 4779-4818 | 40   | `SpriteRenderer`       | Food and ejected mass; its root IS the sprite, no container                   |
| `Node`                 | 4827-4972 | 146  | -                      | Server state for one entity: position, size, colour, eaten                    |
| `FoodNode`             | 4982-5004 | 23   | `Node`                 | Food and ejected mass; shape, and the theme key that exempts ejected          |
| `CellNode`             | 5006-5009 | 4    | `Node`                 | A player cell                                                                 |
| `VirusNode`            | 5011-5016 | 6    | `Node`                 | A virus                                                                       |
| `Pool`                 | 5018-5137 | 120  | -                      | Per-type node/renderer recycling, with ceilings and peak tracking             |
| `BinaryWriter`         | 5162-5259 | 98   | -                      | Builds outgoing packets                                                       |
| `PingWriter`           | 5260-5268 | 9    | -                      | Packet: keepalive                                                             |
| `ProtocolWriter`       | 5269-5279 | 11   | -                      | Packet: protocol + Cloudflare token (verification handshake)                  |
| `LoginWriter`          | 5280-5289 | 10   | -                      | Packet: account uuid                                                          |
| `SpectateWriter`       | 5290-5298 | 9    | -                      | Packet: begin spectating                                                      |
| `NameWriter`           | 5299-5308 | 10   | -                      | Packet: nickname (spawn)                                                      |
| `ChatWriter`           | 5309-5319 | 11   | -                      | Packet: chat message                                                          |
| `MouseWriter`          | 5320-5330 | 11   | -                      | Packet: cursor/view position, sent every 40ms                                 |
| `SplitWriter`          | 5331-5344 | 14   | -                      | Packet: split                                                                 |
| `EjectWriter`          | 5345-5353 | 9    | -                      | Packet: eject mass                                                            |
| `PartyWriter`          | 5354-5366 | 13   | -                      | Packet: party create/join/leave                                               |
| `Network`              | 5386-6218 | 833  | -                      | Socket, verification handshake, every opcode handler, tick measurement        |
| `Settings`             | 6219-6497 | 279  | -                      | The settings blob, defaults merge, and the side effects each change fans out  |
| `Login`                | 6498-7156 | 659  | -                      | Account, XP, shop, skin ownership                                             |
| `Game`                 | 7158-9222 | 2065 | -                      | Everything else: the frame loop, input, node map, spectate, split queue       |
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
| `K_MAX_LENGTH`              | 212  | `0x7fffffff`                                     |
| `K_STRING_MAX_LENGTH`       | 223  | `(1 << 28) - 16`                                 |
| `MAX_ARGUMENTS_LENGTH`      | 1236 | `0x1000`                                         |
| `INVALID_BASE64_RE`         | 2128 | `/[^+/0-9A-Za-z-_]/g`                            |
| `CELL_COUNT_CAPS`           | 2875 | `{`                                              |
| `CULL_MARGIN`               | 3309 | `64`                                             |
| `SPLIT_JITTER_MARGIN`       | 3328 | `18`                                             |
| `SPLIT_QUEUE_MAX`           | 3339 | `8`                                              |
| `SPLIT_RUSH_COPIES`         | 3355 | `3`                                              |
| `MAX_SPLIT_MODES`           | 3370 | `new Set(['Self Feed'])`                         |
| `SPLIT_SPACING_MIN`         | 3371 | `45`                                             |
| `SPLIT_SPACING_MAX`         | 3372 | `90`                                             |
| `SERVER_TICK_ESTIMATE`      | 3381 | `40`                                             |
| `TICK_COALESCE_MS`          | 3382 | `10`                                             |
| `TICK_STALL_MS`             | 3383 | `100`                                            |
| `TICK_EMA`                  | 3384 | `0.05`                                           |
| `UNIFORM_BATCH_RENDERABLES` | 3406 | `8192`                                           |
| `ZOOM_STEP`                 | 3436 | `0.9`                                            |
| `ZOOM_SENSITIVITY_RANGE`    | 3437 | `4`                                              |
| `SPECTATE_CURVE`            | 3439 | `1.25`                                           |
| `FREE_SPEC_SPEED`           | 3446 | `20`                                             |
| `MOUSE_SEND_PERIOD`         | 3452 | `40`                                             |
| `GF_DIAG`                   | 3462 | `{`                                              |
| `MS_PER_DELTA`              | 3474 | `1000 / 60`                                      |
| `ZOOM_MIN`                  | 3476 | `0.01`                                           |
| `ZOOM_MAX`                  | 3477 | `5`                                              |
| `TEXTURE_FREE_DISABLED`     | 3636 | `new Set(['NameCache'])`                         |
| `MASS_FONT`                 | 3803 | `'GermsfoxMass'`                                 |
| `DEBUG_LABELS`              | 3804 | `['Mass:', 'Score:', 'Cells:', 'FPS:', 'PING...` |
| `MASS_FONT_SIZE`            | 3806 | `75;       // atlas size, and the rendered s...` |
| `MASS_FONT_SIZE_FULL`       | 3807 | `60;  // unshortened values are longer, so t...` |
| `SKIN_OPACITY_PROBE`        | 3890 | `64`                                             |
| `SKIN_OPACITY_MIN_ALPHA`    | 3901 | `224`                                            |
| `COLOR_PRESETS`             | 4010 | `{`                                              |
| `THEME_SLOTS`               | 4020 | `{`                                              |
| `LOD_SCALE`                 | 4080 | `25`                                             |
| `CONVERGE_EPSILON`          | 4083 | `0.01`                                           |
| `EATEN_FADE_DEPTH`          | 4091 | `0.383`                                          |
| `EATEN_FADE_TIME`           | 4106 | `0.956`                                          |
| `PARKED_Z_INDEX`            | 4115 | `-1e9`                                           |
| `CELL_COMPACT_THRESHOLD`    | 4125 | `384`                                            |
| `GERMSFOX_BRIDGE_CALLABLE`  | 9354 | `{`                                              |
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
