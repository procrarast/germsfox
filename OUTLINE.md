# bundle.js outline

A map of `src/overrides/bundle.js` — the deobfuscated germs.io client we serve in place of the
site's own, via the `declarativeNetRequest` redirect in `overrides.json`.

The tables between `AUTO` markers are generated. Everything else is hand-written and survives
regeneration, including the **what it is** column of the class table.

```sh
python3 util/outline.py     # after anything that moves code
```

<!-- AUTO:STATS -->
`bundle.js` is **9633** lines and holds **36** classes.
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
| `Chat`                 | 2540-2839 | 300  | -                      | Chat log, emotes, stickers, the /wahbas command                               |
| `GameUI`               | 2855-3250 | 396  | -                      | In-game HUD: debug panel, leaderboard list, minimap, party text               |
| `PartyMember`          | 3256-3275 | 20   | -                      | One party member's minimap dot and position                                   |
| `Camera`               | 3420-3549 | 130  | -                      | Position, zoom, frame-rate independent smoothing, cull bounds, spectate drift |
| `TextureCache`         | 3579-3690 | 112  | -                      | Refcounted texture store, freed 10s after refs hit 0                          |
| `NameCache`            | 3692-3735 | 44   | `TextureCache`         | Name-label textures, keyed by name + parent                                   |
| `SkinCache`            | 3781-3820 | 40   | `TextureCache`         | Skin resources; get() returns a SkinResource, not a texture                   |
| `SkinResource`         | 3891-3942 | 52   | -                      | Loads a skin, clips it to a disc, classifies whether it is opaque             |
| `Renderer`             | 4139-4544 | 406  | -                      | Base per-node display object: cull, interpolate, fade corpses, pool           |
| `SpriteRenderer`       | 4551-4654 | 104  | `Renderer`             | Sprite-backed renderer; body texture, skin sprite, rim swap                   |
| `PlayerSpriteRenderer` | 4660-4680 | 21   | `SpriteRenderer`       | Adds name and skin handling on top of SpriteRenderer                          |
| `CellSpriteRenderer`   | 4686-4712 | 27   | `PlayerSpriteRenderer` | Player cells: border, mass label, opacity                                     |
| `VirusSpriteRenderer`  | 4714-4718 | 5    | `PlayerSpriteRenderer` | Virus texture and size                                                        |
| `FoodSpriteRenderer`   | 4720-4759 | 40   | `SpriteRenderer`       | Food and ejected mass; its root IS the sprite, no container                   |
| `Node`                 | 4768-4913 | 146  | -                      | Server state for one entity: position, size, colour, eaten                    |
| `FoodNode`             | 4923-4945 | 23   | `Node`                 | Food and ejected mass; shape, and the theme key that exempts ejected          |
| `CellNode`             | 4947-4950 | 4    | `Node`                 | A player cell                                                                 |
| `VirusNode`            | 4952-4957 | 6    | `Node`                 | A virus                                                                       |
| `Pool`                 | 4959-5078 | 120  | -                      | Per-type node/renderer recycling, with ceilings and peak tracking             |
| `BinaryWriter`         | 5103-5200 | 98   | -                      | Builds outgoing packets                                                       |
| `PingWriter`           | 5201-5209 | 9    | -                      | Packet: keepalive                                                             |
| `ProtocolWriter`       | 5210-5220 | 11   | -                      | Packet: protocol + Cloudflare token (verification handshake)                  |
| `LoginWriter`          | 5221-5230 | 10   | -                      | Packet: account uuid                                                          |
| `SpectateWriter`       | 5231-5239 | 9    | -                      | Packet: begin spectating                                                      |
| `NameWriter`           | 5240-5249 | 10   | -                      | Packet: nickname (spawn)                                                      |
| `ChatWriter`           | 5250-5260 | 11   | -                      | Packet: chat message                                                          |
| `MouseWriter`          | 5261-5271 | 11   | -                      | Packet: cursor/view position, sent every 40ms                                 |
| `SplitWriter`          | 5272-5285 | 14   | -                      | Packet: split                                                                 |
| `EjectWriter`          | 5286-5294 | 9    | -                      | Packet: eject mass                                                            |
| `PartyWriter`          | 5295-5307 | 13   | -                      | Packet: party create/join/leave                                               |
| `Network`              | 5327-6138 | 812  | -                      | Socket, verification handshake, every opcode handler, tick measurement        |
| `Settings`             | 6139-6417 | 279  | -                      | The settings blob, defaults merge, and the side effects each change fans out  |
| `Login`                | 6418-7076 | 659  | -                      | Account, XP, shop, skin ownership                                             |
| `Game`                 | 7078-9005 | 1928 | -                      | Everything else: the frame loop, input, node map, spectate, split queue       |
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

## Constants

<!-- AUTO:CONSTANTS -->
| name                        | line | value                                            |
|-----------------------------|------|--------------------------------------------------|
| `K_MAX_LENGTH`              | 212  | `0x7fffffff`                                     |
| `K_STRING_MAX_LENGTH`       | 223  | `(1 << 28) - 16`                                 |
| `MAX_ARGUMENTS_LENGTH`      | 1236 | `0x1000`                                         |
| `INVALID_BASE64_RE`         | 2128 | `/[^+/0-9A-Za-z-_]/g`                            |
| `CELL_COUNT_CAPS`           | 2844 | `{`                                              |
| `CULL_MARGIN`               | 3278 | `64`                                             |
| `SPLIT_JITTER_MARGIN`       | 3297 | `18`                                             |
| `SPLIT_QUEUE_MAX`           | 3305 | `8`                                              |
| `SPLIT_RUSH_COPIES`         | 3321 | `3`                                              |
| `MAX_SPLIT_MODES`           | 3336 | `new Set(['Self Feed'])`                         |
| `SPLIT_SPACING_MIN`         | 3337 | `45`                                             |
| `SPLIT_SPACING_MAX`         | 3338 | `90`                                             |
| `SERVER_TICK_ESTIMATE`      | 3347 | `40`                                             |
| `TICK_COALESCE_MS`          | 3348 | `10`                                             |
| `TICK_STALL_MS`             | 3349 | `100`                                            |
| `TICK_EMA`                  | 3350 | `0.05`                                           |
| `UNIFORM_BATCH_RENDERABLES` | 3372 | `8192`                                           |
| `ZOOM_STEP`                 | 3402 | `0.9`                                            |
| `ZOOM_SENSITIVITY_RANGE`    | 3403 | `4`                                              |
| `SPECTATE_CURVE`            | 3405 | `1.25`                                           |
| `FREE_SPEC_SPEED`           | 3412 | `20`                                             |
| `MS_PER_DELTA`              | 3415 | `1000 / 60`                                      |
| `ZOOM_MIN`                  | 3417 | `0.01`                                           |
| `ZOOM_MAX`                  | 3418 | `5`                                              |
| `TEXTURE_FREE_DISABLED`     | 3577 | `new Set(['NameCache'])`                         |
| `MASS_FONT`                 | 3744 | `'GermsfoxMass'`                                 |
| `DEBUG_LABELS`              | 3745 | `['Mass:', 'Score:', 'Cells:', 'FPS:', 'PING...` |
| `MASS_FONT_SIZE`            | 3747 | `75;       // atlas size, and the rendered s...` |
| `MASS_FONT_SIZE_FULL`       | 3748 | `60;  // unshortened values are longer, so t...` |
| `SKIN_OPACITY_PROBE`        | 3831 | `64`                                             |
| `SKIN_OPACITY_MIN_ALPHA`    | 3842 | `224`                                            |
| `COLOR_PRESETS`             | 3951 | `{`                                              |
| `THEME_SLOTS`               | 3961 | `{`                                              |
| `LOD_SCALE`                 | 4021 | `25`                                             |
| `CONVERGE_EPSILON`          | 4024 | `0.01`                                           |
| `EATEN_FADE_DEPTH`          | 4032 | `0.383`                                          |
| `EATEN_FADE_TIME`           | 4047 | `0.956`                                          |
| `PARKED_Z_INDEX`            | 4056 | `-1e9`                                           |
| `CELL_COMPACT_THRESHOLD`    | 4066 | `384`                                            |
| `GERMSFOX_BRIDGE_CALLABLE`  | 9135 | `{`                                              |
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
