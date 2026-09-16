# Refactor list

**Status:** 1-5 and 7 are done and verified. #6 is the only one left, and it depends on moving
where keybinds are stored - see the note under #5.

| | item | lines | status |
| --- | --- | --- | --- |
| 1 | vendored `buffer` stack | -2,302 | done |
| 2 | dead `BinaryWriter` methods | -~30 | done, with #1 |
| 3 | one settings-row helper in `dom.js` | -92 | done |
| 4 | one source for emotes/stickers | -112 | done |
| 5 | display-toggle logic into `bundle.js` | -28 | done |
| 6 | collapse the duplicate-keybind guard | -~60 | not done |
| 7 | pushes instead of spawn/death polling | -65 | done |

`bundle.js` 10,488 -> 8,200. `dom.js` 2,096 -> 1,993. `content.js` 366 -> 301.
`storage.js` 398 -> 360. Net across the extension: **-2,400 lines**.

Ordered by lines removed against risk. Measured, not estimated — every line count below came
from the files as they stand.

## 1. Delete the vendored `buffer` stack — ~2,330 lines

`bundle.js` carries three vendored modules to serve `BinaryReader`/`BinaryWriter`:

| module | lines | why it is there |
| --- | --- | --- |
| `base64` | 63-190 (128) | only to serve `buffer` |
| `buffer` | 191-2302 (2,112) | only to serve the reader/writer |
| `ieee754` | 2303-2390 (88) | only to serve `buffer` |

That is **22% of the file** to provide what `DataView`, `TextEncoder` and `TextDecoder` do
natively. `OUTLINE.md` already says so; this is acting on it.

The whole surface actually used, counted across the file:

```
read:  readUInt8 readInt8 readUInt16LE readUInt32LE readInt32LE readDoubleLE
       toString('utf8') toString('ucs2') .length
write: raw byte stores, writeDoubleLE, write(…,'utf8'), write(…,'ucs2'),
       byteLength, copy, concat, slice, poolSize
```

Every one is a one-liner on `DataView` + `TextEncoder`/`TextDecoder`.

**Risk:** highest of anything here — a wrong offset corrupts the protocol subtly rather than
loudly. **Mitigation:** the old and new implementations can be run side by side against real
packets in a live tab and compared byte for byte. Nothing else in this list is that testable.

## 2. Drop dead `BinaryWriter` methods — ~30 lines

Never called anywhere: `writeUInt32`, `writeInt8`, `writeInt16`, `writeFloat`, `writeBytes`,
`getLength`. Falls out of #1 for free.

## 3. One "labelled settings row" helper in `dom.js` — 92 lines

`createButton` and `createDangerousButton` are **identical but for one line**:

```
-    button.classList.add("btn");
+    button.classList.add("btn", "btn-danger");
```

34 of 36 lines the same. `createFileInputButton`, `createDownloadButton` and `createKeyTester`
open with the same row / label-column / control-column / input-group scaffolding copied
verbatim.

Done: `createSettingRow(labelText, control, containerStyle)` plus `createRowButton()` for the
100x35 button four of them share. All five now build on it and each produces **byte-identical
markup** to what it replaced, checked by running the old and new implementations side by side
in a DOM shim. `createColorPicker` was left alone - it diverges enough that folding it in would
have cost more than it saved.

## 4. One source for the emote and sticker lists — ~106 lines

45 emote filenames and 8 sticker filenames exist **twice**, verbatim: `storage.js` (`emotes`,
`stickers`) and `bundle.js` (`germsfoxEmotes`, `germsfoxStickers`). The comment in `storage.js`
says they are "kept in sync manually" because the two run in different JS worlds.

They do not have to be. Both sides can already reach extension files — `bundle.js` through
`window.__germsfoxURL`, the content scripts through `chrome.runtime.getURL` — so one JSON file
fetched by both removes the copy and the hazard.

Done: `images/emotes.json`, generated from the two arrays after checking they were still in
step (they were) and that all 53 files exist. `storage.js` gets `loadEmoteLists()`, awaited by
`init()` before anything renders a panel; `Chat.loadGermsfoxEmotes()` is awaited by `start()`
before the socket opens. A failed fetch leaves both lists empty, which costs the germsfox
emotes and nothing else.

## 5. Move the display-toggle keybinds into `bundle.js`

`content.js` handles `toggleNames`/`toggleSkins`/`toggleMass`/`toggleFood` by asking the bundle
for state over the bridge, deciding, then calling back over the bridge:

```js
const state = await germsfoxGetState();       // round trip
germsfoxCall('changeSetting', key, next);     // round trip
```

All of that data lives in `bundle.js` already. Only `multibox` genuinely needs the isolated
world (`chrome.runtime.sendMessage`). Moving the other four in removes `cycleDisplayPreference`,
its copy of `DISPLAY_PREFERENCE_VALUES`, four keydown cases and eight bridge messages per press.

Done, but only the **logic** moved, not the storage. `bundle.js` gained
`cycleDisplayPreference()` and `toggleSetting()`; the four keydown cases now hand straight over
to them, and `cycleDisplayPreference`/`DISPLAY_PREFERENCE_VALUES` are gone from `content.js`.
Two bridge messages per press became one, and the state round-trip disappeared.

The keybinds themselves stay in `chrome.storage`. Relocating them would silently move a user's
bindings and needs a migration, and the only thing that bought was #6 — which was not approved.
Ask if you want it; the code win is already banked without it.

`Settings.setItem()` now also calls `refreshSettingInput()`, so the pane follows any change
whatever moved it. That is what let `content.js` drop its `selectEl.value = next` bookkeeping,
and it makes the local and cross-tab paths identical.

## 6. Collapse the duplicate-keybind guard — ~60 lines

A key may only be bound once, and that currently takes **four** pieces in three files:
`unbindDuplicateControls` (storage.js), `unbindGermsKey` (bundle.js), the `germsfox:keybind`
relay (bridge.js) and its listener (content.js). All of it exists only because the two halves
keep their keybinds in different stores. Do #5 and three of the four delete themselves.

## 7. Replace the spawn/death polling with pushes

`content.js` runs `germsfoxGetState()` on a 500 ms interval to notice a spawn, then a second
interval to notice the death. That is two bridge round trips per second, forever, to learn
something `bundle.js` knows the instant it happens — and it already pushes `modeChange` and
`highscore` the other way, so the mechanism exists.

Done: `Game.aliveCell` is now an accessor that pushes `{type:'alive'}` when its truthiness
changes. `initDebug`, `initDebugAfterDeath` and `debugPollInterval` are gone, along with the
four call sites that existed only to re-arm them.

The first attempt put the check in `render()`, which was wrong: `requestAnimationFrame` is
throttled to nothing in a background tab, and background tabs are exactly where multiboxed
tabs live — packets keep arriving and `aliveCell` keeps changing while no frame runs. The
accessor fires on assignment instead, so it does not care whether anything is rendering.

## Also considered

`moduleRegistry` / `modules()` (lines 20, 65-89) is a hand-rolled CommonJS shim. After #1 its
only consumers are the three badwords modules, so it could be flattened into three `const`s for
about 25 lines. Left as-is deliberately: it is inert, and flattening it would touch the one
vendored thing still doing real work for no behavioural gain.

## Not doing

- **The `Filter`/badwords vendoring** (lines 21-62). It is a real word list doing real work.
- **Moving keys between the two settings stores** beyond #5. The merge/prune logic in
  `getSettings()` is newly fixed and load-bearing; churning it earns nothing.
- **`pixi.js`.** Vendored whole on purpose.
