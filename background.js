console.log("Running background.js");

var germsTabs = [];     // array of tab ids with url germs.io
var germsWindows = [];  // array of window ids url germs.io
var index = null;       // index may be 0 or 1

// here for reusability
function cancel() { 
    return { cancel: true };
}

browser.storage.local.get('skinBlocklist').then((value) => {
    browser.webRequest.onBeforeRequest.addListener(
        cancel,
        { urls: value.skinBlocklist || [], types: ["image", "main_frame"] },
        ["blocking"],
    );
});

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "switchTabs") {
        updateTabs().then(() => {
            console.log("Switching tabs!");
            switch (germsTabs.length) {
                case 2: // switch tabs
                    console.log(`Switching to index ${index}`);
                    browser.tabs.update(germsTabs[index ? 0 : 1], { active: true });
                    break;
                case 1: // make a new tab
                    browser.tabs.get(germsTabs[0], function(tab) {
                        browser.tabs.create({ url: tab.url });
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
                    browser.windows.update(germsWindows[index ? 0 : 1], {focused: true });
                    break;
                case 1: // open a new window
                    browser.windows.get(germsWindows[0], { populate: true }, (window) => openWindow(window));
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
    } else if (request.action === "updateSkinBlocklist") {
        updateSkinBlocklist();
    }
});

// this is weird, but you pass a window and this function opens a new window with the same url
function openWindow(window) {
    const germsTab = window.tabs.find(tab => tab.url.includes('germs.io'));
    if (germsTab) {
        // Create a new window with the germs.io tab URL
        browser.windows.create({ url: germsTab.url });
    } else {
        console.warn("Warning: No germs.io tab found in the existing window.");
    }
}

// update global variables index and window[]
function updateWindows() {
    return browser.windows.getAll({ populate: true })
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

/*
 *  Update global variables germsTabs[] and index
 */
function updateTabs() {
    return browser.tabs.query({ currentWindow: true, url: "https://germs.io/*" })
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

function updateSkinBlocklist() {
    return browser.tabs.query({ currentWindow: true, url: "https://germs.io/*" })
    .then((tabs) => {
        germsTabs = tabs.map(tab => tab.id);
        const activeTab = tabs.find(tab => tab.active);

        if (activeTab) {
            browser.storage.local.get(["customSkins", "switcherKey", "switcherEnabled", "switcherKeyup", "skinBlocklist", "playerBlocklist", "switcherWindowed", "ignoreInvites",], function(settings) {
                browser.webRequest.onBeforeRequest.addListener(
                    cancel,
                    { urls: settings.skinBlocklist || [], types: ["image", "main_frame"] },
                    ["blocking"],
                );
            });
        }
    })
    .catch((error) => {
        console.error('Error: ', error);
        throw error;
    });
}