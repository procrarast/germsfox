console.log("Running content.js");

var feedKey;            // retrieved from germs settings
var switcherKey;        // array of [keyCode, key]
var switcherWindowed;   // boolean which defines whether the switcher is tabbed or windowed 
var switcherEnabled;    // boolean which defines whether the switcher is turned on
var switcherKeyUp;      // boolean which defines whether we want to send a feed keyup after switching tabs
var chatting = false;   // :chatting:
var mutedPlayers = [];
var skinBlocklist = [];

updateSettings();
browser.runtime.sendMessage("updateTabs");

var animationDelayRange =   document.getElementById('animationDelay');
var settingsButton =        document.getElementById("settingsButton");
var chatInput =             document.getElementById("chat_input");
var chatBox =               document.getElementById("worldTab");
var playerMenu =            document.getElementById("userMenuPlayer");

chatInput.setAttribute("maxlength", 100); // Increase max length of chat messages
animationDelayRange.setAttribute('min', '4'); // Lower minimum animation delay to 4

settingsButton.insertAdjacentHTML('afterend', 
    '<button id="germsfoxButton" type="button" style="margin: 8px" class="btn"><i class="fas fa-cog"></i>Germsfox</button>');

const settingsModalHTML = `
<div id="germsfoxSettingsModal" class="germsfox-modal">
    <div class="germsfox-modal-content">
        <span class="germsfox-close">&times;</span>
        <h2>Settings</h2>
        <!-- Add your settings fields here -->
    </div>
</div>
`;

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
        background-color: #fefefe;
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
    }
    .germsfox-close {
        color: #aaa;
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

document.body.insertAdjacentHTML('beforeend', settingsModalHTML);
document.head.insertAdjacentHTML('beforeend', modalStyle);

const germsfoxButton = document.getElementById("germsfoxButton");
const settingsModal = document.getElementById("germsfoxSettingsModal");
const closeButton = document.querySelector(".germsfox-close");

germsfoxButton.addEventListener('click', function() {
    console.log("Settings button clicked");
    settingsModal.style.display = "block";
});

closeButton.addEventListener('click', function() {
    settingsModal.style.display = "none";
});
// Close the modal if the user clicks anywhere outside of it
window.onclick = function(event) {
    if (event.target === settingsModal) {
        settingsModal.style.display = "none";
    }
};

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
    }
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
    browser.storage.local.get(["switcherKey", "switcherEnabled", "switcherKeyup", "skinBlocklist", "playerBlocklist", "switcherWindowed"], function(settings){
        if (browser.runtime.lastError) {
            console.error("Error retrieving settings:", browser.runtime.lastError);
            return;
        }
        console.info("Germsfox settings retrieved.");
        switcherKey = settings.switcherKey || [65, "A"]; // default to [65, "A"] if switcherKey not found
        switcherEnabled = settings.switcherEnabled;
        console.log(switcherEnabled);
        switcherKeyUp = settings.switcherKeyUp;
        switcherWindowed = settings.switcherWindowed;
        console.log(switcherWindowed);
        skinBlocklist = settings.skinBlocklist;
        playerBlocklist = settings.playerBlocklist;
    });
}
