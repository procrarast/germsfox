/*
 * The custom skins menu: Imgur skins you have saved, the folders you sort them into, the
 * right-click menu for both, and dragging to reorder and group them.
 *
 * Runs in the content-script world alongside dom.js and storage.js, and shares their globals
 * (settings, setSetting, setSkin, usingInput, setPreviewColor).
 */

console.debug("Running skinfolders.js");

/*
 * ---- the model --------------------------------------------------------------------------
 *
 * settings.customSkins is a JSON array, exported and imported as it is stored. A loose skin is
 * its Imgur URL as a string - exactly the shape every older export has, so old files import
 * unchanged. A folder is an object in the same array:
 *
 *     ["https://i.imgur.com/a.png", { "name": "PvP", "skins": ["https://i.imgur.com/b.png"] }]
 *
 * A URL appears at most once across loose skins and folders. Folders do not nest. A folder
 * left empty is removed; one left with a single skin is kept, the way a phone keeps it.
 *
 * Everything below takes targets by identity - the URL string or the folder object - rather
 * than by index, so taking the dragged skin out first can never shift where it is going.
 */

const CUSTOM_SKIN_URL = /^https:\/\/i\.imgur\.com\/[^/]+$/;
const DEFAULT_FOLDER_NAME = "Folder";
const FOLDER_NAME_MAX = 24;
// Skins a folder's icon shows, as a 3x3 grid
const FOLDER_PREVIEW_TILES = 9;

function isSkinFolder(entry) {
    return entry !== null && typeof entry === "object" && Array.isArray(entry.skins);
}

/** Every saved skin URL, loose or in a folder, in display order. */
function customSkinUrls(entries = settings.customSkins) {
    return entries.flatMap(entry => isSkinFolder(entry) ? entry.skins : [entry]);
}

/** The folder holding `url`, or null for a loose skin (or one not saved at all). */
function folderOfSkin(entries, url) {
    return entries.find(entry => isSkinFolder(entry) && entry.skins.includes(url)) ?? null;
}

/**
 *  Cleans anything about to become part of the list - an imported file above all. The list
 *  has been broken before by junk landing in it (see tryAddingSkin), so only well-formed URLs
 *  and folders survive, duplicates are dropped against `existing` and within the input, and a
 *  folder left with nothing in it is dropped too.
 */
function normalizeCustomSkins(raw, existing = []) {
    if (!Array.isArray(raw)) return [];
    const seen = new Set(existing);
    const take = url => {
        if (typeof url !== "string") return null;
        url = url.replace(/\s/g, "");
        if (!CUSTOM_SKIN_URL.test(url) || seen.has(url)) return null;
        seen.add(url);
        return url;
    };

    const out = [];
    for (const entry of raw) {
        if (isSkinFolder(entry)) {
            const skins = entry.skins.map(take).filter(Boolean);
            if (skins.length) out.push({ name: cleanFolderName(entry.name), skins });
        } else {
            const url = take(entry);
            if (url) out.push(url);
        }
    }
    return out;
}

function cleanFolderName(name) {
    const clean = typeof name === "string" ? name.trim().slice(0, FOLDER_NAME_MAX) : "";
    return clean || DEFAULT_FOLDER_NAME;
}

/** Takes `url` out of wherever it is. A folder emptied by it goes too. */
function removeCustomSkin(entries, url) {
    const loose = entries.indexOf(url);
    if (loose !== -1) {
        entries.splice(loose, 1);
        return true;
    }
    const folder = folderOfSkin(entries, url);
    if (!folder) return false;
    folder.skins.splice(folder.skins.indexOf(url), 1);
    if (!folder.skins.length) entries.splice(entries.indexOf(folder), 1);
    return true;
}

/**
 *  Moves a saved skin. `target` is one of:
 *
 *    { kind: "edge",  ref, side }          before/after a top-level skin or folder
 *    { kind: "merge", ref }                onto a loose skin (makes a folder of the two) or
 *                                          into a folder
 *    { kind: "inner", folder, ref, side }  before/after a skin inside `folder`
 *    { kind: "out",   folder }             out of `folder`, to just after it
 *
 *  Returns whether anything changed.
 */
function moveCustomSkin(entries, url, target) {
    if (target.ref === url) return false;
    if (!customSkinUrls(entries).includes(url)) return false;

    // Where the source folder stood, in case taking `url` out of it empties it away
    const anchor = target.kind === "out" ? entries.indexOf(target.folder) : -1;
    removeCustomSkin(entries, url);

    const at = ref => {
        const index = entries.indexOf(ref);
        return index === -1 ? entries.length : index;
    };

    switch (target.kind) {
        case "edge":
            entries.splice(at(target.ref) + (target.side === "after" ? 1 : 0), 0, url);
            return true;
        case "merge":
            if (isSkinFolder(target.ref)) {
                target.ref.skins.push(url);
            } else {
                entries.splice(at(target.ref), 1, { name: DEFAULT_FOLDER_NAME, skins: [target.ref, url] });
            }
            return true;
        case "inner": {
            const skins = target.folder.skins;
            const index = skins.indexOf(target.ref);
            skins.splice(index === -1 ? skins.length : index + (target.side === "after" ? 1 : 0), 0, url);
            // It may have been the folder's last skin, taken out above and so the folder with it
            if (!entries.includes(target.folder)) entries.splice(Math.max(0, anchor), 0, target.folder);
            return true;
        }
        case "out": {
            const index = entries.indexOf(target.folder);
            entries.splice(index === -1 ? Math.max(0, anchor) : index + 1, 0, url);
            return true;
        }
    }
    return false;
}

/** Folders only move between top-level entries - they never go inside anything. */
function moveSkinFolder(entries, folder, ref, side) {
    if (ref === folder || !entries.includes(folder)) return false;
    entries.splice(entries.indexOf(folder), 1);
    const index = entries.indexOf(ref);
    entries.splice(index === -1 ? entries.length : index + (side === "after" ? 1 : 0), 0, folder);
    return true;
}

/** Empties a folder back into the list where it stood. */
function ungroupSkinFolder(entries, folder) {
    const index = entries.indexOf(folder);
    if (index === -1) return false;
    entries.splice(index, 1, ...folder.skins);
    return true;
}

function saveCustomSkins() {
    chrome.storage.local.set({ customSkins: settings.customSkins });
}

/*
 * ---- the menu ---------------------------------------------------------------------------
 */

const skinFolderUi = {
    openFolder: null,     // the folder whose view is up, kept open across re-renders
    drag: null,           // the drag in progress - see beginSkinDrag()
    suppressClick: false, // swallows the click a drag's pointerup would otherwise become
};

/**
 *  Once a page: a drag ends in a pointerup, which the browser follows with a click on whatever
 *  was under it - and a click on a skin wears it. Caught at the window in the capture phase so
 *  it is stopped before both germs' inline onclick and the cell preview's own capture handler
 *  on the list (see renderCellPreviewCard in dom.js) ever see it.
 */
window.addEventListener("click", event => {
    if (!skinFolderUi.suppressClick) return;
    skinFolderUi.suppressClick = false;
    event.preventDefault();
    event.stopImmediatePropagation();
}, true);

function renderCustomSkinsMenu() {
    const container = document.getElementById("customSkin");
    container.querySelector("#customSkinList")?.remove();

    const applySkinButton = container.querySelector(".btn-info");
    applySkinButton.removeEventListener("click", submitCustomSkin); // For multiple renders
    applySkinButton.addEventListener("click", submitCustomSkin);

    const list = document.createElement("div");
    list.id = "customSkinList";

    const entries = settings.customSkins;
    if (!entries.length) {
        const warning = document.createElement("p");
        warning.textContent = "You have no Imgur skins saved!";
        list.appendChild(warning);
        list.style.width = "100%";
        container.appendChild(list);
        closeSkinFolderView();
        return list;
    }

    for (const entry of entries) {
        list.appendChild(isSkinFolder(entry) ? createFolderLi(entry) : createSkinLi(entry));
    }
    container.appendChild(list);

    // A re-render after a change made inside a folder keeps that folder open
    if (skinFolderUi.openFolder && entries.includes(skinFolderUi.openFolder)) {
        openSkinFolderView(skinFolderUi.openFolder);
    } else {
        closeSkinFolderView();
    }
    return list;
}

function submitCustomSkin() {
    const customSkinInput = document.getElementById("loginCustomSkinText");
    if (tryAddingSkin(customSkinInput.value)) {
        renderCustomSkinsMenu();
    }
    customSkinInput.value = ""; // clear the input box
}

/** One saved skin. `folder` is the folder it sits in, or null for a loose one. */
function createSkinLi(url, folder = null) {
    const li = document.createElement("li");
    li.className = "germsfoxSkin";
    li.dataset.skin = url;

    const img = document.createElement("img");
    // setSkin() provided by germs. URLs are checked against CUSTOM_SKIN_URL before they are
    // ever saved, so one cannot carry a quote into this attribute
    img.setAttribute("onclick", `setSkin('${url}')`);
    img.loading = "lazy";
    img.src = url;
    // Firefox starts its own image drag on a pointer drag otherwise, and cancels ours
    img.draggable = false;
    li.appendChild(img);

    li.addEventListener("pointerdown", event => beginSkinDrag(event, { kind: "skin", url, folder, li }));
    li.addEventListener("contextmenu", event => openSkinContextMenu(event, url, folder));
    return li;
}

/** A folder's icon: a 3x3 grid of its first nine skins, in the same circle a skin sits in. */
function createFolderPreview(skins) {
    const preview = document.createElement("div");
    preview.className = "germsfoxFolderPreview";
    for (const url of skins.slice(0, FOLDER_PREVIEW_TILES)) {
        // Spans rather than imgs: an img click anywhere in the list wears that skin
        const tile = document.createElement("span");
        tile.className = "germsfoxFolderTile";
        tile.style.backgroundImage = `url("${url}")`;
        preview.appendChild(tile);
    }
    return preview;
}

function createFolderLi(folder) {
    const li = document.createElement("li");
    li.className = "germsfoxSkin germsfoxFolder";
    // Clicks here are ours - see the early return in renderCellPreviewCard's skinsListClicked
    li.dataset.germsfoxClick = "";
    // What a drop onto this li, or Rename from the menu, needs to find again
    li.germsfoxFolder = folder;

    const preview = createFolderPreview(folder.skins);
    preview.addEventListener("click", () => openSkinFolderView(folder));

    const name = document.createElement("p");
    name.className = "germsfoxFolderName";
    name.textContent = folder.name;
    name.title = "Click to rename";
    name.addEventListener("click", () => startFolderRename(name, folder));

    li.append(preview, name);
    li.addEventListener("pointerdown", event => {
        if (event.target.tagName === "INPUT") return; // mid-rename
        beginSkinDrag(event, { kind: "folder", folder, li });
    });
    li.addEventListener("contextmenu", event => openFolderContextMenu(event, folder));
    return li;
}

/**
 *  Turns a folder's name into a text box. Enter or clicking away keeps the new name, Escape
 *  puts the old one back. An empty name falls back to the default rather than leaving a folder
 *  with nothing under it to click.
 */
function startFolderRename(nameEl, folder) {
    if (nameEl.querySelector("input")) return;

    const input = document.createElement("input");
    input.className = "germsfoxFolderRename";
    input.value = folder.name;
    input.maxLength = FOLDER_NAME_MAX;
    input.spellcheck = false;

    nameEl.textContent = "";
    nameEl.appendChild(input);
    // Keeps N, B, M and the rest from firing while typing - see content.js
    usingInput = true;
    input.focus();
    input.select();

    let done = false;
    const finish = save => {
        if (done) return;
        done = true;
        usingInput = false;
        if (save) {
            folder.name = cleanFolderName(input.value);
            saveCustomSkins();
        }
        renderCustomSkinsMenu();
    };

    // Kept from germs' window handlers, which close panels on Escape among other things
    input.addEventListener("keydown", event => {
        event.stopPropagation();
        if (event.key === "Enter") finish(true);
        else if (event.key === "Escape") finish(false);
    });
    input.addEventListener("blur", () => finish(true));
}

/*
 * ---- the folder view --------------------------------------------------------------------
 *
 * A folder opens over the skin list rather than inline, the way one opens on a phone. It lives
 * inside #customSkin, and so inside the skin list, so that clicking a skin in it goes down
 * exactly the path clicking one outside a folder does.
 */

function openSkinFolderView(folder) {
    closeSkinFolderView(false);
    skinFolderUi.openFolder = folder;

    const scroller = document.getElementById("skinContainer");
    const container = document.getElementById("customSkin");

    const overlay = document.createElement("div");
    overlay.id = "germsfoxFolderView";
    overlay.dataset.germsfoxClick = "";
    // #skinContainer scrolls, and an absolute child scrolls with it - so the view is placed at
    // the current scroll and the list is held still underneath it until it closes
    overlay.style.top = `${scroller.scrollTop}px`;
    overlay.style.height = `${scroller.clientHeight}px`;
    scroller.style.overflowY = "hidden";

    const panel = document.createElement("div");
    panel.className = "germsfoxFolderPanel";

    const header = document.createElement("div");
    header.className = "germsfoxFolderHeader";

    const title = document.createElement("p");
    title.className = "germsfoxFolderName germsfoxFolderTitle";
    title.textContent = folder.name;
    title.title = "Click to rename";
    title.addEventListener("click", () => startFolderRename(title, folder));

    const close = document.createElement("i");
    close.className = "fas fa-times germsfoxFolderClose";
    close.addEventListener("click", () => closeSkinFolderView());

    header.append(title, close);

    // A skinList of its own, so germs' skin styling reaches these the same as the main list
    const skins = document.createElement("ul");
    skins.className = "skinList germsfoxFolderSkins";
    for (const url of folder.skins) skins.appendChild(createSkinLi(url, folder));

    panel.append(header, skins);
    overlay.appendChild(panel);
    overlay.addEventListener("click", event => {
        if (event.target === overlay) closeSkinFolderView();
    });

    container.appendChild(overlay);
    document.addEventListener("keydown", onFolderViewKey, true);
}

function onFolderViewKey(event) {
    if (event.key !== "Escape" || usingInput) return;
    event.stopPropagation();
    closeSkinFolderView();
}

function closeSkinFolderView(forget = true) {
    if (forget) skinFolderUi.openFolder = null;
    document.removeEventListener("keydown", onFolderViewKey, true);
    const overlay = document.getElementById("germsfoxFolderView");
    if (!overlay) return;
    overlay.remove();
    const scroller = document.getElementById("skinContainer");
    if (scroller) scroller.style.removeProperty("overflow-y");
}

/*
 * ---- the context menu -------------------------------------------------------------------
 *
 * Built to look like the game's own right-click menu (#userMenu): the same dark box, the same
 * rows of icon and label, and a header with the thing it is for. Lives on <body> rather than
 * in the skin list, so the cell preview's capture handler on the list never sees its clicks.
 */

function closeSkinContextMenu() {
    document.getElementById("germsfoxSkinMenu")?.remove();
    document.removeEventListener("pointerdown", onSkinMenuOutside, true);
    document.removeEventListener("keydown", onSkinMenuKey, true);
    document.getElementById("skinContainer")?.removeEventListener("scroll", closeSkinContextMenu);
}

function onSkinMenuOutside(event) {
    if (!event.target.closest("#germsfoxSkinMenu")) closeSkinContextMenu();
}

function onSkinMenuKey(event) {
    if (event.key !== "Escape") return;
    event.stopPropagation();
    closeSkinContextMenu();
}

/**
 *  `items` are [icon, label, action, danger?]. The header is just the thing the menu is for,
 *  drawn larger than #userMenu's player cell since there is no name to go beside it: the skin,
 *  or the folder's grid when `folder` is given.
 */
function showSkinContextMenu(event, iconUrl, folder, items) {
    event.preventDefault();
    event.stopPropagation();
    closeSkinContextMenu();

    const menu = document.createElement("div");
    menu.id = "germsfoxSkinMenu";
    menu.className = "nodrag";

    const list = document.createElement("ul");

    const header = document.createElement("li");
    header.className = "germsfoxSkinMenuHeader";
    let icon;
    if (folder) {
        icon = createFolderPreview(folder.skins);
    } else {
        icon = document.createElement("div");
        icon.style.backgroundImage = `url("${iconUrl}")`;
    }
    icon.classList.add("germsfoxSkinMenuIcon");
    header.appendChild(icon);
    list.append(header, document.createElement("hr"));

    for (const [glyph, label, action, danger] of items) {
        const item = document.createElement("li");
        item.className = "germsfoxSkinMenuItem" + (danger ? " germsfoxSkinMenuDanger" : "");
        const i = document.createElement("i");
        i.className = `fas ${glyph}`;
        const p = document.createElement("p");
        p.textContent = label;
        item.append(i, p);
        item.addEventListener("click", () => {
            closeSkinContextMenu();
            action();
        });
        list.appendChild(item);
    }

    menu.appendChild(list);
    document.body.appendChild(menu);

    // Kept on screen, the way the game flips its own menu at the edges
    let x = event.clientX, y = event.clientY;
    if (x + menu.offsetWidth >= window.innerWidth) x -= menu.offsetWidth;
    if (y + menu.offsetHeight >= window.innerHeight) y -= menu.offsetHeight;
    menu.style.left = `${Math.max(0, x)}px`;
    menu.style.top = `${Math.max(0, y)}px`;

    document.addEventListener("pointerdown", onSkinMenuOutside, true);
    document.addEventListener("keydown", onSkinMenuKey, true);
    document.getElementById("skinContainer")?.addEventListener("scroll", closeSkinContextMenu, { once: true });
}

function openSkinContextMenu(event, url, folder) {
    const items = [
        ["fa-copy", "Copy Link", () => copySkinLink(url)],
    ];
    if (folder) {
        items.push(["fa-sign-out-alt", "Remove from Folder", () => {
            moveCustomSkin(settings.customSkins, url, { kind: "out", folder });
            saveCustomSkins();
            renderCustomSkinsMenu();
        }]);
    }
    items.push(["fa-trash", "Delete", () => deleteCustomSkin(url), true]);
    showSkinContextMenu(event, url, null, items);
}

function openFolderContextMenu(event, folder) {
    showSkinContextMenu(event, null, folder, [
        ["fa-folder-open", "Open", () => openSkinFolderView(folder)],
        ["fa-pen", "Rename", () => {
            const li = [...document.querySelectorAll("#customSkinList > .germsfoxFolder")]
                .find(li => li.germsfoxFolder === folder);
            const name = li?.querySelector(".germsfoxFolderName");
            if (name) startFolderRename(name, folder);
        }],
        ["fa-object-ungroup", "Ungroup", () => {
            ungroupSkinFolder(settings.customSkins, folder);
            saveCustomSkins();
            renderCustomSkinsMenu();
        }],
    ]);
}

async function copySkinLink(url) {
    try {
        await navigator.clipboard.writeText(url);
    } catch {
        // Older paths where the async clipboard is refused; execCommand still copies a selection
        const area = document.createElement("textarea");
        area.value = url;
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        area.remove();
    }
}

function deleteCustomSkin(url) {
    if (!removeCustomSkin(settings.customSkins, url)) return;
    saveCustomSkins();
    forgetWornCustomSkin(url);
    console.log(`Deleted ${url}`);
    renderCustomSkinsMenu();
}

/**
 *  Deleting the skin you are wearing takes you back to no skin, since a deleted skin can no
 *  longer be picked again from the list - and the preview follows.
 */
function forgetWornCustomSkin(url) {
    if (settings.setSkin !== url) return;

    setSetting("setSkin", "None");
    setSkin("None");
    const cellSkin = document.getElementById("cellSkin");
    if (cellSkin) cellSkin.style.display = "none";
    document.getElementById("cellSkinButton")?.style.removeProperty("background-image");

    if (settings.setColor !== "None") setSkin(settings.setColor);
    setPreviewColor(settings.setColor === "None" ? randomPreviewColor : cellColorList[settings.setColor][1]);
}

/*
 * ---- dragging ---------------------------------------------------------------------------
 *
 * Pointer events rather than HTML drag and drop, which gives no say over the drop indicator.
 * Nothing starts until the pointer has moved a few pixels, so an ordinary click still wears
 * the skin.
 *
 * The ghost, the drop line and the folder preview are all fixed to <body> and placed from
 * client rects. The skins card is scaled by a CSS transform, and anything placed inside it
 * would have to undo that; client rects already have it applied.
 */

const DRAG_THRESHOLD = 6;
// Inner share of a skin's width that drops onto it (makes or fills a folder) rather than
// beside it
const MERGE_ZONE = 0.5;
const DROP_LINE_COLOR = "#007bff"; // the Custom Skin badge's blue

function beginSkinDrag(event, item) {
    if (event.button !== 0 || skinFolderUi.drag) return;
    skinFolderUi.suppressClick = false;
    skinFolderUi.drag = { item, startX: event.clientX, startY: event.clientY, active: false, target: null };

    window.addEventListener("pointermove", onSkinDragMove, true);
    window.addEventListener("pointerup", onSkinDragEnd, true);
    window.addEventListener("pointercancel", cancelSkinDrag, true);
    window.addEventListener("keydown", onSkinDragKey, true);
}

function onSkinDragKey(event) {
    if (event.key !== "Escape") return;
    event.stopPropagation();
    cancelSkinDrag();
}

function onSkinDragMove(event) {
    const drag = skinFolderUi.drag;
    if (!drag) return;

    if (!drag.active) {
        if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < DRAG_THRESHOLD) return;
        startSkinDragVisuals(drag);
    }

    event.preventDefault();
    drag.ghost.style.left = `${event.clientX}px`;
    drag.ghost.style.top = `${event.clientY}px`;

    drag.target = findSkinDropTarget(drag, event.clientX, event.clientY);
    showSkinDropIndicator(drag);
}

function startSkinDragVisuals(drag) {
    drag.active = true;
    closeSkinContextMenu();

    const ghost = document.createElement("div");
    ghost.id = "germsfoxSkinGhost";
    if (drag.item.kind === "skin") {
        ghost.style.backgroundImage = `url("${drag.item.url}")`;
    } else {
        ghost.appendChild(createFolderPreview(drag.item.folder.skins));
        ghost.classList.add("germsfoxGhostFolder");
    }
    document.body.appendChild(ghost);
    drag.ghost = ghost;

    const line = document.createElement("div");
    line.id = "germsfoxDropLine";
    line.style.backgroundColor = DROP_LINE_COLOR;
    document.body.appendChild(line);
    drag.line = line;

    drag.item.li.classList.add("germsfoxDragging");
    document.body.classList.add("germsfoxDraggingSkin");
}

/**
 *  What dropping here would do. Hit-tested against the li rather than the img, because germs
 *  scales a hovered skin image up with a transition and its rect would move under the pointer.
 *  The gaps between skins count as the nearest skin in the row, so there is no dead space
 *  between them.
 */
function findSkinDropTarget(drag, x, y) {
    const { item } = drag;
    const view = document.getElementById("germsfoxFolderView");
    const inFolderView = !!(view && item.folder);

    if (inFolderView) {
        const panel = view.querySelector(".germsfoxFolderPanel");
        const r = panel.getBoundingClientRect();
        if (x < r.left || x > r.right || y < r.top || y > r.bottom) {
            return { kind: "out", folder: item.folder };
        }
    }

    const scope = inFolderView ? view.querySelector(".germsfoxFolderSkins") : document.getElementById("customSkinList");
    const lis = [...scope.children].filter(li => li.classList.contains("germsfoxSkin") && li !== item.li);
    if (!lis.length) return null;

    // Nearest li in the row under the pointer, else nearest overall
    let best = null, bestDistance = Infinity;
    for (const li of lis) {
        const r = li.getBoundingClientRect();
        const inRow = y >= r.top - r.height * 0.15 && y <= r.bottom + r.height * 0.35;
        const distance = Math.abs(x - (r.left + r.width / 2)) + (inRow ? 0 : 10000 + Math.abs(y - (r.top + r.height / 2)));
        if (distance < bestDistance) {
            bestDistance = distance;
            best = { li, r };
        }
    }

    const { li, r } = best;
    const offset = (x - (r.left + r.width / 2)) / r.width;
    const side = offset < 0 ? "before" : "after";
    const overImage = y >= r.top && y <= r.top + r.width;
    const canMerge = item.kind === "skin" && !inFolderView && overImage && Math.abs(offset) < MERGE_ZONE / 2;

    if (inFolderView) return { kind: "inner", folder: item.folder, ref: li.dataset.skin, side, li };

    const ref = li.germsfoxFolder ?? li.dataset.skin;

    if (canMerge) return { kind: "merge", ref, li };
    return { kind: "edge", ref, side, li };
}

/**
 *  A vertical line between the two skins a drop would land between, or - over the middle of a
 *  skin or folder - the folder it would make or join, drawn where it would appear.
 */
function showSkinDropIndicator(drag) {
    const { target, line } = drag;
    drag.mergePreview?.remove();
    drag.mergePreview = null;
    line.style.display = "none";
    document.querySelector(".germsfoxDropOut")?.classList.remove("germsfoxDropOut");

    if (!target) return;

    if (target.kind === "out") {
        document.getElementById("germsfoxFolderView")?.classList.add("germsfoxDropOut");
        return;
    }

    const anchor = target.li.querySelector("img, .germsfoxFolderPreview") ?? target.li;
    const r = target.li.getBoundingClientRect();
    const image = anchor.getBoundingClientRect();

    if (target.kind === "merge") {
        const skins = isSkinFolder(target.ref) ? [...target.ref.skins, drag.item.url] : [target.ref, drag.item.url];
        const preview = createFolderPreview(skins);
        preview.id = "germsfoxMergePreview";
        // The li's own size, not the image's - a hovered skin image is scaled up mid-transition
        const size = r.width * 85 / 86;
        preview.style.width = preview.style.height = `${size}px`;
        preview.style.left = `${r.left + (r.width - size) / 2}px`;
        preview.style.top = `${r.top}px`;
        document.body.appendChild(preview);
        drag.mergePreview = preview;
        return;
    }

    // Halfway into the gap beside the li - the li's margin is 10px before the card's scale
    const scale = r.width / target.li.offsetWidth || 1;
    const gap = 10 * scale;
    const x = target.side === "before" ? r.left - gap : r.right + gap;
    line.style.display = "block";
    line.style.left = `${x - 2}px`;
    line.style.top = `${r.top}px`;
    line.style.height = `${Math.min(image.height, r.width)}px`;
}

function endSkinDragVisuals(drag) {
    drag.ghost?.remove();
    drag.line?.remove();
    drag.mergePreview?.remove();
    drag.item.li.classList.remove("germsfoxDragging");
    document.body.classList.remove("germsfoxDraggingSkin");
    document.querySelector(".germsfoxDropOut")?.classList.remove("germsfoxDropOut");
}

function stopListeningToSkinDrag() {
    window.removeEventListener("pointermove", onSkinDragMove, true);
    window.removeEventListener("pointerup", onSkinDragEnd, true);
    window.removeEventListener("pointercancel", cancelSkinDrag, true);
    window.removeEventListener("keydown", onSkinDragKey, true);
}

function cancelSkinDrag() {
    const drag = skinFolderUi.drag;
    skinFolderUi.drag = null;
    stopListeningToSkinDrag();
    if (!drag) return;
    if (drag.active) {
        endSkinDragVisuals(drag);
        skinFolderUi.suppressClick = true;
    }
}

function onSkinDragEnd(event) {
    const drag = skinFolderUi.drag;
    skinFolderUi.drag = null;
    stopListeningToSkinDrag();
    if (!drag || !drag.active) return; // a plain click - let it through

    endSkinDragVisuals(drag);
    skinFolderUi.suppressClick = true;
    // A pointerup with nothing under it to click leaves the flag up for the next real click
    setTimeout(() => { skinFolderUi.suppressClick = false; }, 0);

    const { item, target } = drag;
    if (!target) return;

    const entries = settings.customSkins;
    const changed = item.kind === "folder"
        ? target.kind === "edge" && moveSkinFolder(entries, item.folder, target.ref, target.side)
        : moveCustomSkin(entries, item.url, target);

    if (!changed) return;
    saveCustomSkins();
    renderCustomSkinsMenu();
}
