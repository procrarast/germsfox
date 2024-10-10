console.log("Running background.js");

var germsTabs = [];     // array of tab ids with url germs.io
var germsWindows = [];  // array of window ids url germs.io
var index = null;       // index may be 0 or 1

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "switchTabs") {
        updateTabs().then(() => {
            console.log("Switching tabs!");
            switch (germsTabs.length) {
                case 2: // switch tabs
                    console.log(`Switching to index ${index}`);
                    chrome.tabs.update(germsTabs[index ? 0 : 1], { active: true });
                    break;
                case 1: // make a new tab
                    chrome.tabs.get(germsTabs[0], function(tab) {
                        chrome.tabs.create({ url: tab.url });
                    });
                    break;
                case 0:
                    console.warn("Warning: No active germs tab found.");
                    break;
                default:
                    console.warn("Warning: 3+ tabs are not supported.");
            }
        });
    } else if (request.action === "switchWindows") {
        updateWindows().then(() => {
            console.log("Switching windows!");
            switch (germsWindows.length) {
                case 2: // switch windows
                    chrome.windows.update(germsWindows[index ? 0 : 1], {focused: true });
                    break;
                case 1: // open a new window
                    chrome.windows.get(germsWindows[0], { populate: true }, (window) => openWindow(window));
                    break;
                case 0:
                    console.warn("Warning: No active germs window found.")
                    break;
                default:
                    console.warn("Warning: 3+ windows are not supported.");
                    break;
            }
        });
    } else if (request.action === "updateTabs") {
        updateTabs();
    } else if (request.action === 'download') {
        console.log("Preparing download");
        chrome.downloads.download({
            url: request.url,
            filename: request.filename,
            saveAs: true
        }, () => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.request);
            } else {
                console.log("Downloaded");
            }
        });
    } else if (request.action === "updateSkinBlocklist" && request.url) {
        addBlockingRule(request.url);
    }
});

// this is weird, but you pass a window and this function opens a new window with the same url
function openWindow(window) {
    const germsTab = window.tabs.find(tab => tab.url.includes('germs.io'));
    if (germsTab) {
        // Create a new window with the germs.io tab URL
        chrome.windows.create({ url: germsTab.url });
    } else {
        console.warn("Warning: No germs.io tab found in the existing window.");
    }
}

// update global variables index and window[]
function updateWindows() {
    return chrome.windows.getAll({ populate: true })
    .then((windows) => {
        // Filter for windows that have a germs.io tab and store their IDs
        germsWindows = windows.filter(win => 
            win.tabs.some(tab => tab.url && tab.url.includes('https://germs.io')))
            .map(win => win.id); // Store only the window IDs

        console.log(`Germs.io windows found: ${germsWindows.length}`);

        const activeWindow = windows.find(win => 
            win.focused && win.tabs.some(tab => tab.active && tab.url.includes('https://germs.io')));

        if (activeWindow) {
            console.log("Active germs.io window found");
            index = germsWindows.indexOf(activeWindow.id);
        } else {
            console.log('Found no active germs window.');
        }
    })
    .catch((error) => {
        console.error('Error: ', error);
    });
}

// update global variables germsTabs[] and index
function updateTabs() {
    return chrome.tabs.query({ currentWindow: true, url: "https://germs.io/*" })
    .then((tabs) => {
        germsTabs = tabs.map(tab => tab.id);
        console.log(`Germs.io tabs found: ${germsTabs.length}`);
        const activeTab = tabs.find(tab => tab.active);
        //console.log(activeTab);
        if (activeTab) {
            // If an active tab is found, update switcherTabIndex
            index = germsTabs.indexOf(activeTab.id);
        } else {
            console.log('Found no active germs tab.');
        }
    })
    .catch((error) => {
        console.error('Error: ', error);
        throw error;
    });
}

// add a declarativeNetRequest rule for each imgur link we want to block
function addBlockingRule(url) {
    const ruleId = Math.round(Math.random() * 2.147e9); // each rule needs its own unique id. if you manage to get the same id twice, please consider playing the lottery!

    const rule = {
        id: ruleId,
        priority: 1,
        action: { type: 'block' },
        condition: { urlFilter: url, resourceTypes: ['image', 'main_frame'] }
    };

    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [rule],
        removeRuleIds: []
    }, () => {
        if (chrome.runtime.lastError) {
            console.error(`Error adding rule: ${chrome.runtime.lastError.message}`);
        } else {
            console.log(`Added blocking rule for ${url} with ID ${ruleId}`);
        }
    });
}