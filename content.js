console.log("Running content.js");

var feedKey;            // retrieved from germs settings
var testerWaiting;      // is the tester waiting for the user to input
var switcherKey;        // array of [keyCode, key]
var switcherWindowed;   // boolean which defines whether the switcher is tabbed or windowed 
var switcherEnabled;    // boolean which defines whether the switcher is turned on
//var switcherKeyUp;      // boolean which defines whether we want to send a feed keyup after switching tabs
var chatting = false;   // :chatting:
var mutedPlayers = [];  // TODO
var skinBlocklist = []; // TODO

//browser.runtime.sendMessage("updateTabs");

var animationDelayRange =   document.getElementById("animationDelay");
var settingsButton =        document.getElementById("settingsButton");
var chatInput =             document.getElementById("chat_input");
var chatBox =               document.getElementById("worldTab");
var playerMenu =            document.getElementById("userMenuPlayer");
var nickInput =             document.getElementById("nick");
var menuCenter =            document.getElementById("menuCenter");
var customSkinMenu =        document.getElementById("customSkin");
var centerCard =            menuCenter.getElementsByClassName("card")[0];

nickInit();
updateSettings();

chatInput.setAttribute("maxlength", 100); // Increase max length of chat messages
animationDelayRange.setAttribute('min', '4'); // Lower minimum animation delay to 4

const settingsButtonHTML =` 
<button id="germsfoxButton" 
    type="button" 
    style="
        color: #e4c6e6; 
        background-color: #382938; 
        border: 2px solid #947995; 
        margin-top: 10px; 
        margin-left: 10px; 
        width: 100%" 
class="btn">
    <img id="germsfoxIcon" alt="Icon" style="vertical-align: middle;"></img>
    <b> Germsfox</b>
</button>`
;

const settingsModalHTML = `
<div id="germsfoxSettingsModal" class="germsfox-modal">
    <div class="germsfox-modal-content">
        <span id="settingsClose" class="germsfox-close">&times;</span>

        <h2><b>Settings</b></h2>

        <input type="checkbox" id="enabledCheckbox">
        <label for="enabledCheckbox">Switcher enabled</label><br> 

        <input type="checkbox" id="windowedCheckbox"> 
        <label for="windowedCheckbox">Windowed mode</label><br> 

        <div id = "keyTester" style ="border: 2px solid #1e1a1e; border-radius: 4px; padding: 4px; cursor: pointer; text-align: center; width: 64px; height: 32px;">
        </div> 

        <button id="saveButton" type="button">Save</button>

    </div>
</div> `;

const skinsModalHTML = null;
//TODO: just make it an extra segment of the already existing skins ui


const modalStyle = `
<style>
    .germsfox-modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.4);
    }
    .germsfox-modal-content {
        font-family: Ubuntu;
        background-color: #382938;
        color: #e4c6e6;
        margin: 15% auto;
        padding: 20px;
        border: 2px solid #947995;
        border-radius: 8px;
        width: 300px;
    }
    .germsfox-close {
        color: #947995;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }
    .germsfox-close:hover,
    .germsfox-close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
</style>
`;

settingsButton.insertAdjacentHTML('afterend', settingsButtonHTML);
document.body.insertAdjacentHTML('beforeend', skinsModalHTML);
document.body.insertAdjacentHTML('beforeend', settingsModalHTML);
document.head.insertAdjacentHTML('beforeend', modalStyle);

// this is for the icon on the germsfox button
var germsfoxIcon = document.getElementById('germsfoxIcon');
germsfoxIcon.src = browser.runtime.getURL('gsDuhFox-19.png');
    
var germsfoxButton =      document.getElementById("germsfoxButton");
var settingsModal =       document.getElementById("germsfoxSettingsModal");
var keyTester =           document.getElementById("keyTester");
var saveButton =          document.getElementById("saveButton");
var enabledCheckbox =     document.getElementById("enabledCheckbox");
var windowedCheckbox =    document.getElementById("windowedCheckbox");
var settingsCloseButton = document.getElementById("settingsClose");

germsfoxButton.addEventListener('click', function() {
    console.log("Settings button clicked");
    stopWaiting(); //just to update the style
    chrome.storage.local.get(['switcherEnabled', 'switcherWindowed'], function(items) {
        document.getElementById('enabledCheckbox').checked = items.switcherEnabled;
        document.getElementById('windowedCheckbox').checked = items.switcherWindowed;
    });
    settingsModal.style.display = "block"; // un-hide settings modal
});

settingsCloseButton.addEventListener('click', function() {
    stopWaiting();
    settingsModal.style.display = "none"; // hide settings modal 
});

keyTester.addEventListener('click', function() {
    if (!testerWaiting) {
        startWaiting();
    } else { // clicking a second time will toggle it back off
        stopWaiting();
    }
});

saveButton.addEventListener('click', function() {
    stopWaiting();
    const switcherEnabled = document.getElementById('enabledCheckbox').checked;
    const switcherWindowed = document.getElementById('windowedCheckbox').checked;
    const switcherKeycode = document.getElementById('keyTester').value;
    
    chrome.storage.local.set({ "switcherEnabled": switcherEnabled, "switcherKeycode": switcherKeycode, "switcherWindowed": switcherWindowed }, function() {
        console.log('Settings saved');
        updateSettings();
    })
});

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
    }
});

// close the modal if you click anywhere outside of it
window.onclick = function(event) {
    if (event.target === settingsModal) {
        stopWaiting();
        settingsModal.style.display = "none";
    }
};

document.addEventListener('keydown', keydown);

function keydown(event) {
    if (testerWaiting) {
        switcherKey[0] = event.keyCode;
        switcherKey[1] = event.key;
        
        chrome.storage.local.set({ "switcherKey": switcherKey }, function() {
            console.log('Switcher key changes saved');
            updateSettings();
        });
        stopWaiting();
    }
    else if (!chatting && switcherEnabled && (event.keyCode === switcherKey[0] || event.key === switcherKey[1])) {
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
    browser.storage.local.get(["switcherKey", "switcherEnabled", "switcherKeyup", "skinBlocklist", "playerBlocklist", "switcherWindowed"], function(settings){
        if (browser.runtime.lastError) {
            console.error("Error retrieving settings:", browser.runtime.lastError);
            return;
        }
        console.info("Germsfox settings retrieved.");
        switcherKey = settings.switcherKey || [65, "A"]; // default to [65, "A"] if switcherKey not found
        switcherEnabled = settings.switcherEnabled;
        //console.log(switcherEnabled);
        switcherKeyUp = settings.switcherKeyUp;
        switcherWindowed = settings.switcherWindowed;
        //console.log(switcherWindowed);
        skinBlocklist = settings.skinBlocklist;
        playerBlocklist = settings.playerBlocklist;
    });
}

function nickInit() {
    if (nickInput) {
        const nickTextarea = document.createElement('textarea');
        nickTextarea.id = nickInput.id; // Copy the ID from the input element
        nickTextarea.value = nickInput.value; // Copy the current value
        nickInput.parentNode.replaceChild(nickTextarea, nickInput);
    }
}
function stopWaiting() {
    keyTester.style.border = '2px solid #1e1a1e';
    keyTester.textContent = switcherKey[1].toUpperCase();
    testerWaiting = false;
}

function startWaiting() {
    keyTester.style.border = '2px solid white';
    keyTester.textContent = ' ';
    testerWaiting = true;
}