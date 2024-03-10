console.log("Running content.js");

var feedKey;            // retrieved from germs settings
var testerWaiting;      // is the tester waiting for the user to input
var switcherKey;        // array of [keyCode, key]
var customSkins = [];   // array of custom skin urls
var switcherWindowed;   // boolean which defines whether the switcher is tabbed or windowed 
var switcherEnabled;    // boolean which defines whether the switcher is turned on
//var switcherKeyUp;      // boolean which defines whether we want to send a feed keyup after switching tabs
var usingTextBox = false;   // :chatting:
var playerBlocklist;
var skinBlocklist = []; // TODO

//chrome.runtime.sendMessage("updateTabs");

var animationDelayRange =   document.getElementById("animationDelay");
var settingsButton =        document.getElementById("settingsButton");
var chatInput =             document.getElementById("chat_input");
var chatBox =               document.getElementById("worldTab");
var playerMenu =            document.getElementById("userMenuPlayer");
var nickInput =             document.getElementById("nick");
var menuCenter =            document.getElementById("menuCenter");
var customSkinsElement =    document.getElementById("customSkin");
var customSkinInput =       document.getElementById("loginCustomSkinText");
var skinsButton =           document.getElementById("skin");
var muteButton =            playerMenu.getElementsByClassName("userMenuItem")[1]; // second menu option
var centerCard =            menuCenter.getElementsByClassName("card")[0];

nickInit();
updateSettings();
//updateCustomSkinMenu();

chatInput.setAttribute("maxlength", 100); // Increase max length of chat messages
animationDelayRange.setAttribute('min', '10'); // Lower minimum animation delay to 10

var chatObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === "childList") {
            const lastMessage = chatBox.lastElementChild;
            if (lastMessage) {
                const chatterNameElement = lastMessage.querySelector('b');
                if (chatterNameElement) {
                    chatterName = chatterNameElement.textContent;
                    console.log(`Recieved message from ${chatterName}`);
                    if (playerBlocklist.includes(chatterName)) {
                        lastMessage.remove();
                        console.log(`Removed message from ${chatterName}`);
                    }
                }
            }
        }
    });
});

chatObserver.observe(chatBox, {childList: true});

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
        <span id="germsfoxSettingsClose" class="germsfox-close">&times;</span>

        <h2><b>Settings</b></h2>

        <input type="checkbox" id="enabledCheckbox">
        <label for="enabledCheckbox">Switcher enabled</label><br> 

        <input type="checkbox" id="windowedCheckbox"> 
        <label for="windowedCheckbox">Windowed mode</label><br> 

        <div id = "keyTester" style ="border: 2px solid #1e1a1e; border-radius: 4px; padding: 4px; cursor: pointer; text-align: center; width: 64px; height: 32px;">
        </div> 
    </div>
</div>`;

const customSkinsContainerHTML = `
<div id="customSkinList" style="margin-bottom: 10px;">
</div>`;

const germsfoxStyle = `
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
    #skinDeleteButton {
        position: absolute;
        background-color: red;
        color: white;
        display: none;
    }
</style>
`;

settingsButton.insertAdjacentHTML('afterend', settingsButtonHTML);
customSkinsElement.insertAdjacentHTML('beforeend', customSkinsContainerHTML);
document.body.insertAdjacentHTML('beforeend', settingsModalHTML);
document.head.insertAdjacentHTML('beforeend', germsfoxStyle);

// this is for the icon on the germsfox button
var germsfoxIcon = document.getElementById('germsfoxIcon');
germsfoxIcon.src = chrome.runtime.getURL('images/gsDuhFox-19.png');
    
var germsfoxButton =        document.getElementById("germsfoxButton");
var settingsModal =         document.getElementById("germsfoxSettingsModal");
var keyTester =             document.getElementById("keyTester");
var enabledCheckbox =       document.getElementById("enabledCheckbox");
var windowedCheckbox =      document.getElementById("windowedCheckbox");
var settingsCloseButton =   document.getElementById("germsfoxSettingsClose");
var customSkinsContainer =  document.getElementById("customSkinList");
var applySkinButton =       document.querySelector("#customSkin .btn-info");

applySkinButton.addEventListener('click', customSkinSubmitted);
skinsButton.addEventListener('click', updateCustomSkinMenu);
enabledCheckbox.addEventListener('change', checkboxChanged);
windowedCheckbox.addEventListener('change', checkboxChanged);

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

muteButton.addEventListener('click', function() {
    const playerNameElement = document.getElementById("userMenuPlayerName");
    const mutedTextElement = document.getElementById("userMenuBlockText");
    const playerName = playerNameElement.innerText;
    const mutedText = mutedTextElement.innerText;

    if (mutedText === "Mute Player" && !playerBlocklist.includes(playerName)) {
        blockPlayerName(playerName);
        var muteMessage = `<div class="adminMessage" style="color: white;"><p> <font color="#00FF00">${playerName} has been muted!</font></p></div>`;
        chatBox.innerHTML += muteMessage;
    }

    else if (mutedText === "Unmute Player") {
        playerBlocklist.splice(playerBlocklist.indexOf(playerName), 1);
        var muteMessage = `<div class="adminMessage" style="color: white;"><p> <font color="#00FF00">${playerName} has been unmuted.</font></p></div>`;
        chatBox.innerHTML += muteMessage;
    }
    console.log(playerBlocklist);
    chrome.storage.local.set({ "playerBlocklist": playerBlocklist }, function() {
        updateSettings();
    })

});

function unblockPlayerName(playerName) {
    playerBlocklist.splice(playerBlocklist.indexOf(playerName), 1); 
}

function checkboxChanged() {
    const switcherEnabled = document.getElementById('enabledCheckbox').checked;
    const switcherWindowed = document.getElementById('windowedCheckbox').checked;
    
    chrome.storage.local.set({ "switcherEnabled": switcherEnabled, "switcherWindowed": switcherWindowed }, function() {
        console.log('Settings saved');
        updateSettings();
    });
}

function blockPlayerName(playerName) {
    playerBlocklist.push(playerName);
    
    for (var i = 0; i <= chatBox.children.length; i++) {
        const chatMessage = chatBox.children[i];
        if (chatMessage) {
            const chatterNameElement = chatMessage.querySelector('b');
            if (chatterNameElement) {
                chatterName = chatterNameElement.textContent;
                if (playerBlocklist.includes(chatterName)) {
                    chatMessage.remove();
                }
            }
        }
    }
}

chatInput.addEventListener('focus', startedUsingTextBox);
chatInput.addEventListener('blur', stoppedUsingTextBox);
nickInput.addEventListener('focus', startedUsingTextBox);
nickInput.addEventListener('blur', stoppedUsingTextBox);

function startedUsingTextBox() { // this will pause the tab switcher
    usingTextBox = true;
}

function stoppedUsingTextBox() {
    usingTextBox = false;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
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
    else if (!usingTextBox && switcherEnabled && (event.keyCode === switcherKey[0] || event.key === switcherKey[1])) {
        if (switcherWindowed) {
            console.log("Switching windows!");
            chrome.runtime.sendMessage({ action: "switchWindows"});
        } else {
            console.log("Switching tabs!");
            chrome.runtime.sendMessage({ action: "switchTabs"});
        }
    }
    /*
    if (event.keyCode === feedKey[0] || event.key === feedKey[1]) {
        console.info(`${event.key} pressed.`);
    } */
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
    chrome.storage.local.get(["customSkins", "switcherKey", "switcherEnabled", "switcherKeyup", "skinBlocklist", "playerBlocklist", "switcherWindowed"], function(settings){
        if (chrome.runtime.lastError) {
            console.error("Error retrieving settings:", chrome.runtime.lastError);
            return;
        }
        console.info("Germsfox settings retrieved.");
        customSkins = settings.customSkins || []; // default to an empty array
        playerBlocklist = settings.playerBlocklist || [];
        switcherKey = settings.switcherKey || [65, "A"]; // default to [65, "A"] if switcherKey not found
        switcherEnabled = settings.switcherEnabled;
        //console.log(switcherEnabled);
        switcherKeyUp = settings.switcherKeyUp;
        switcherWindowed = settings.switcherWindowed;
        //console.log(switcherWindowed);
        skinBlocklist = settings.skinBlocklist;
    });
}

function nickInit() {
    if (nickInput) {
        const nickTextarea = document.createElement('textarea');
        nickTextarea.id = nickInput.id; // copy the ID from the input element
        nickTextarea.value = nickInput.value; // copy the current value
        nickTextarea.placeholder = "Nickname";
        nickTextarea.style.textAlign = "left";
        nickTextarea.style.height = "50px";

        nickInput.parentNode.replaceChild(nickTextarea, nickInput);
        nickInput = document.getElementById("nick"); // set to the new element
    }
}

// cba to do proper input validation on this, just dont try to break it and youll be fine
function customSkinSubmitted() {
    console.log("Custom skin submitted.");
    const inputValue = customSkinInput.value;

    if (inputValue.includes("https://i.imgur.com/")) {
        customSkins.unshift(inputValue.replace(/\s/g, '')); // removes whitespace
        chrome.storage.local.set({ "customSkins": customSkins }, function() {
            console.log("New custom skin added");
        });
    }
    customSkinInput.value = ""; // clear the input box
    updateCustomSkinMenu();
}

function updateCustomSkinMenu() {
    console.log("Updating the custom skins menu.");
    customSkinsContainer.innerHTML = ""; 
    
    if (customSkins.length === 0) {
        var pElement = document.createElement('p');
        pElement.textContent = `You have no imgur skins saved!`;
        customSkinsContainer.appendChild(pElement);
        return 0;
    }
    // create a new element to be displayed for each skin in customSkins
    for (i = 0; i < customSkins.length; i++) {
        var imgHTML = `<li id="skinSkin"><img onContextMenu="showDeleteButton(event, ${i})" onclick="setSkin('${customSkins[i]}');" class="lazy loaded" width="84" height="85" src="${customSkins[i]}"></li>`;
        customSkinsContainer.innerHTML += imgHTML
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