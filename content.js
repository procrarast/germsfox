console.log("Running content.js");

var feedKey;
var switcherKey;        // array of [keyCode, key]
var switcherWindowed;   // boolean which defines whether the switcher is tabbed or windowed 
var switcherEnabled;    // boolean which defines whether the switcher is turned on
var switcherKeyUp;      // boolean which defines whether we want to send a feed keyup after switching tabs
var chatting = false;   // :chatting:
var mutedPlayers = [];
var skinBlocklist = [];

updateSettings();
browser.runtime.sendMessage("updateTabs");

animationDelay =    document.getElementById('animationDelay');
settingsButton =    document.getElementById("settingsButton");
chatInput =         document.getElementById("chat_input");
chatBox =           document.getElementById("worldTab");
playerMenu =        document.getElementById("userMenuPlayer");


chatInput.setAttribute("maxlength", 100); // Increase max length of chat messages
animationDelay.setAttribute('min', '4'); // Lower minimum animation delay to 4
settingsButton.insertAdjacentHTML('afterend', 
    '<button id="germsboxButton" type="button" style="margin: 8px" class="btn"><i class="fas fa-cog"></i>Germsbox</button>');


document.addEventListener('keydown', keydown);

chatInput.addEventListener('focus', function() {
    console.info("You're chatting! Disabling switcher.");
    chatting = true;
});

chatInput.addEventListener('blur', function() {
    console.info("You're done chatting, enabling switcher.");
    chatting = false;
})
  
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "updateSettings") {
        console.info("Updating settings");
        updateSettings();
    } // keyup function here?
});


function keydown(event) {
    if (!chatting && switcherEnabled && (event.keyCode === switcherKey[0] || event.key === switcherKey[1])) {
        if (switcherWindowed) {
            console.log("Switching windows!");
            browser.runtime.sendMessage({ action: "switchWindows"});
        } else {
            console.log("Switching tabs!");
            browser.runtime.sendMessage({ action: "switchTabs"});
        }
    }
    if (event.keyCode === feedKey[0] || event.key === feedKey[1]) {
        console.info(`${event.key} pressed.`);
    }
}

function updateSettings() {
    // germs.io settings
    const settings = localStorage.getItem('settings');
    if (settings) {
        console.info("Settings key retrieved");
        const parsedSettings = JSON.parse(settings);
        feedKey = parsedSettings.controls.Feed;
    } else {
        console.warn("Settings key either empty or not found");
    }
    
    // germsfox settings
    browser.storage.local.get(["switcherKey", "switcherEnabled", "switcherKeyup", "skinBlocklist", "playerBlocklist"], function(settings){
        if (browser.runtime.lastError) {
            console.error("Error retrieving settings:", browser.runtime.lastError);
            return;
        }
        console.info("Germsfox settings retrieved.");
        //switcherKey = settings.switcherKey;
        switcherKey = [65, "A"];
        switcherEnabled = settings.switcherEnabled;
        switcherKeyUp = settings.switcherKeyUp;
        switcherWindowed = settings.switcherWindowed;
        skinBlocklist = settings.skinBlocklist;
        playerBlocklist = settings.playerBlocklist;
    });
}