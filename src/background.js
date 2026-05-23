/* 
 * Handles skins.json downloads, multibox tab/window state, and blocking rules 
 * Ideally, it would handle settings state, but I wasn't smart enough to consider this when I wrote it!
 */

console.log("Running background.js");

const DEFAULT_CONTROLS = {
    multibox: ["Tab", "Tab"],
    toggleNames: ["KeyN", "N"],
    toggleSkins: ["KeyB", "B"],
    toggleMass: ["KeyM", "M"],
    toggleFood: ["", ""]
};

const DEFAULT_SETTINGS = {
    controls: DEFAULT_CONTROLS,
    setSkin: "None", //document.getElementById("skin").style.backgroundImage.slice(5, -2)
    setColor: "None",
    customSkins: [],
    skinBlocklist: [],
    playerBlocklist: [],
    toggleNames: ["all", "none"],
    toggleSkins: ["all", "none"],
    switcherEnabled: false,
    switcherWindowed: false,
    ignoreInvites: false,
    toggleSettings: true,
    autoLogout: false, 
    shortenMass: true,
    enableDebug: false,
    enableAllColorButtons: false,
    enableOldSkinsButton: false,
};

settings = structuredClone(DEFAULT_SETTINGS);

const handlers = {
    switchTabs,
    switchWindows,
    clearBlockRules,
    addBlockRule: ({ url }) => url && addBlockRule(url)
};

// Detects cloudflare network requests to disable and enable the play button
chrome.webRequest.onCompleted.addListener(
    (details) => {
        console.debug("Captcha submitted");
        try {
            chrome.tabs.sendMessage(details.tabId, { action: "challengeSubmitted" });
        } catch (error) {
            console.debug("Tab no longer exists:", error.message);
        }
    },
    { urls: ["https://challenges.cloudflare.com/cdn-cgi/challenge-platform/*/*/*/1"] }
);
chrome.webRequest.onCompleted.addListener(
    (details) => {
        console.debug("Captcha finished");
        try {
            chrome.tabs.sendMessage(details.tabId, { action: "challengeFinished" });
        } catch (error) {
            console.debug("Tab no longer exists:", error.message);
        }
    },
    { urls: ["https://germs.io/cdn-cgi/challenge-platform/*/*/*/*"] } // The URL path identifiers seem to change, so I'm wildcard spamming 
);

// Detect server changes or restarts
chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        console.debug("Changed servers");
        try {
            chrome.tabs.sendMessage(details.tabId, { action: "changedServers" });
        } catch (error) {
            console.debug("Tab no longer exists:", error.message);
        }
    },
    { urls: ["wss://us.germs.io:*/"] }
);

chrome.runtime.onMessage.addListener((request) => {
    console.debug(request.action);
    const handler = handlers[request.action];
    if (!handler) return;
    handler(request);
});

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

