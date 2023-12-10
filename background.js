console.log("Running background.js");

var tabs = [];       // array of tab ids, ideally length 2
var index = null;   // index may be 0 or 1

updateTabs();

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "switchTabs") {
        updateTabs().then(() => {
            console.log("Switching tabs!");
            console.log("Amount of tabs:", tabs.length);
            switch (tabs.length) {
                case 2: // switch tabs
                    console.log("Two tabs found");
                    console.log(`Switching to index ${index}`);
                    browser.tabs.update(tabs[index ? 0 : 1], { active: true })
                    break;
                case 1: // make a new tab
                    browser.tabs.get(tabs[0], function(tab) {
                        browser.tabs.create({ url: tab.url });
                    });
                    break;
                default:
                    console.warn("Warning: 3+ tabs are not supported.");
            }
        });
    } else if (request.action === "switchWindows") {
        switchWindows();
    } else if (request.action === "updateTabs") {
        updateTabs();
    }
});

function switchWindows() { //TODO

}

function updateTabs() {
    return browser.tabs.query({ currentWindow: true, url: "https://germs.io/*" })
    .then((tabs) => {
        tabs = tabs.map(tab => tab.id);
        console.log(`Germs.io tabs found: ${tabs.length}`);
        const activeTab = tabs.find(tab => tab.active);

        if (activeTab) {
            // If an active tab is found, update switcherTabIndex
            
            index = tabs.indexOf(activeTab.id);
            console.log(`Index value: ${index}`);
        } else {
            console.log('Found no active germs window.');
        }
    })
    .catch((error) => {
        console.error('Error: ', error);
        throw error;
    });
}
