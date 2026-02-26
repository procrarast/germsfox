/* 
 * Handles skins.json downloads, multibox tab/window state, and blocking rules 
 * Ideally, it would handle settings state, but I wasn't smart enough to consider this when I wrote it!
 */

console.log("Running background.js");

const handlers = {
    switchTabs,
    switchWindows,
    updateSettings,
    download,
    clearBlockRules,
    addBlockRule: ({ url }) => url && addBlockRule(url)
};

chrome.runtime.onMessage.addListener((request, sender) => {
    console.debug(request.action);
    const handler = handlers[request.action];
    if (!handler) return;
    handler(request, sender);
});

// Useful when multiboxing to prevent per-tab settings desync
async function updateSettings() {
    const tabs = await chrome.tabs.query({
        url: "https://germs.io/*"
    });

    for (const tab of tabs) {
        console.debug(`Sending getSettings message to tab ${tab.id}`);
        chrome.tabs.sendMessage(tab.id, { action: "getSettings" });
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

// For skin exports, sent by popup.js
async function download({ url, filename }) {
    console.log("Preparing download");

    await chrome.downloads.download({ url, filename, saveAs: true });
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        sendResponse({success: true});
    } else {
        console.log("Downloaded");
    }
}

async function clearBlockRules() {
    console.debug("Received message");
    try {
        const rules = await chrome.declarativeNetRequest.getDynamicRules();

        const ids = rules.map(rule => rule.id);

        if (ids.length === 0) {
            console.log("No dynamic rules to remove.");
            return;
        }

        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: ids
        });

        console.log("Removed rule IDs:", ids);

    } catch (error) {
        console.error("Could not clear dynamic rules:", error);
    }
}

function addBlockRule(url) {
    console.debug("Adding blocking rule for skin " + url);
    const ruleId = Math.round(Math.random() * 2.147e9);

    const rule = {
        id: ruleId,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: url, resourceTypes: ["image", "main_frame"] }
    };

    chrome.declarativeNetRequest.updateDynamicRules(
        { addRules: [rule], removeRuleIds: [] },
        () => {
            if (chrome.runtime.lastError) {
                console.error(`Error adding rule: ${chrome.runtime.lastError.message}`);
            } else {
                console.log(`Added blocking rule for ${url} with ID ${ruleId})`);
            }
        }
    );
}

