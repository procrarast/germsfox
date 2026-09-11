/*
 * Handles skins.json downloads, multibox tab/window state, blocking rules, and the
 * community daily leaderboard (pishi.dev)
 * Ideally, it would handle settings state, but I wasn't smart enough to consider this when I wrote it!
 */

console.log("Running background.js");

const LEADERBOARD_API = 'https://pishi.dev/leaderboard';

const handlers = {
    switchTabs,
    switchWindows,
    submitScore,
    getDailyLeaderboard,
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "loading" && tab.url?.startsWith("https://germs.io")) {
        const extensionURL = chrome.runtime.getURL("");

        chrome.scripting.executeScript({
            target: { tabId }, world: "MAIN",
            func: (url) => {
                window.__germsfoxURL = url;
            },
            args: [extensionURL]
        }).catch(_ => {
            console.debug("Tab removed before extension URL was sent.");
        });
    };
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.debug(request.action);
    const handler = handlers[request.action];
    if (!handler) return;
    const result = handler(request);
    if (result instanceof Promise) {
        result.then(sendResponse);
        return true; // Keep the message channel open for the async response
    }
});

// Generated once per install and reused for every submission, so "all-time best" (not part of
// this panel, but the schema supports it) can be tracked per-player without storing anything
// that identifies a person - just distinguishes one Germsfox install from another.
async function getLeaderboardClientId() {
    const stored = await chrome.storage.local.get('leaderboardClientId');
    if (stored.leaderboardClientId) return stored.leaderboardClientId;

    const clientId = crypto.randomUUID();
    await chrome.storage.local.set({ leaderboardClientId: clientId });
    return clientId;
}

async function submitScore(request) {
    const stored = await chrome.storage.local.get('leaderboardOptOut');
    if (stored.leaderboardOptOut) return;

    const clientId = await getLeaderboardClientId();

    try {
        await fetch(`${LEADERBOARD_API}/submit.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: clientId,
                mode: request.mode,
                mass: request.mass,
                name: request.name,
                // Drawn as the top entry's cell, standing in for the gold crown
                color: request.color,
                skin: request.skin,
            }),
        });
    } catch (error) {
        console.debug('Leaderboard submission failed (likely offline):', error);
    }
}

async function getDailyLeaderboard(request) {
    try {
        const response = await fetch(`${LEADERBOARD_API}/daily.php?mode=${encodeURIComponent(request.mode)}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.debug('Leaderboard fetch failed:', error);
        return null;
    }
}

async function getTabsState() {
    const tabs = await chrome.tabs.query({
        currentWindow: true,
        url: "https://germs.io/*"
    });

    const ids = tabs.map(t => t.id);
    const active = tabs.find(t => t.active);

    return {
        ids,
        activeIndex: active ? ids.indexOf(active.id) : -1
    };
}

async function getWindowsState() {
    const windows = await chrome.windows.getAll({ populate: true });

    const germsWindows = windows.filter(win =>
        win.tabs.some(tab => tab.url?.includes("https://germs.io"))
    );

    const ids = germsWindows.map(w => w.id);

    const activeWindow = germsWindows.find(win =>
        win.focused &&
        win.tabs.some(tab => tab.active && tab.url?.includes("https://germs.io"))
    );

    return { ids, activeIndex: activeWindow ? ids.indexOf(activeWindow.id) : -1 };
}

async function switchTabs() {
    console.log("Switching tabs");

    const { ids, activeIndex } = await getTabsState();

    switch (ids.length) {
        case 2:
            chrome.tabs.update(ids[1 - activeIndex], { active: true });
            break;

        case 1: {
            const tab = await chrome.tabs.get(ids[0]);
            chrome.tabs.create({ url: tab.url });
            break;
        }

        case 0:
            console.warn("No active germs tab found.");
            break;

        default:
            console.warn("3+ tabs not supported.");
    }
}

async function switchWindows() {
    console.log("Switching windows");

    const { ids, activeIndex } = await getWindowsState();

    switch (ids.length) {
        case 2:
            chrome.windows.update(ids[1 - activeIndex], { focused: true });
            break;

        case 1: {
            const windowObj = await chrome.windows.get(ids[0], { populate: true });
            duplicateGermsWindow(windowObj);
            break;
        }

        case 0:
            console.warn("No active germs window found.");
            break;

        default:
            console.warn("3+ windows not supported.");
    }
}

function duplicateGermsWindow(windowObj) {
    const germsTab = windowObj.tabs.find(tab =>
        tab.url?.includes("https://germs.io")
    );

    if (!germsTab) {
        console.warn("No germs.io tab found in window.");
        return;
    }

    chrome.windows.create({ url: germsTab.url });
}

