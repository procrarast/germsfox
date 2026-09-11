/*
 *  Reliant on ./storage.js and ./dom.js for their respective helper functions
 *  Strangely, standard ES modules are not supported (?) in the isolated content_scripts world
 *  To work around this, each script is ran consecutively within the world's scope to generate
 *  functions for use here
 */

console.info("Running content.js");

// TODO: Set global settings state in a background service worker rather than within content_scripts
let settings = null;
let germsSettings = null;
let usingInput = false;
let hasSpawned = false;
let playButtonObserver;
let debugPollInterval;

init();

async function init() {
    settings = await getSettings();
    germsSettings = await getGermsSettings();

    if (!settings.disablePishi) {
        const icon = chrome.runtime.getURL("/images/icon.png");
        document.getElementById("menuLogo").src = icon; 
    }

    const versionAnchor = document.getElementById('version');
    versionAnchor.innerHTML = 'Version: <b>' + '5.2.2-live-2179' + '</b>';
    versionAnchor.removeAttribute("href");
    
    // Germsfox information
    // Still need to manually update version in the bundle's console output in start() though
    const germsfoxInfo = document.createElement("span");
    germsfoxInfo.innerText =  " | ";
    const germsfoxInfoAnchor = document.createElement("a");
    germsfoxInfoAnchor.id = "germsfoxInfo";
    germsfoxInfoAnchor.classList.add("nodrag");
    germsfoxInfoAnchor.innerText = "Germsfox: ";
    germsfoxInfoAnchor.href = "https://pishi.dev/germsfox";
    germsfoxInfoAnchor.target = "_blank";
    germsfoxInfoAnchor.addEventListener("click", event => event.stopPropagation());
    const germsfoxInfoVersion = document.createElement("b");
    germsfoxInfoVersion.innerText = await chrome.runtime.getVersion();
    germsfoxInfoVersion.id = "germsfoxVersion";
    germsfoxInfoAnchor.appendChild(germsfoxInfoVersion);
    germsfoxInfo.appendChild(germsfoxInfoAnchor);
    versionAnchor.appendChild(germsfoxInfo);


    initChat();
    initConnecting();
    renderCustomSkinsMenu();
    renderCustomColorsMenu();
    initDebug();
    renderGameMenu();
    renderDailyLeaderboardPanel();
    renderNick();
    renderGermsfoxButton();
    renderPlayerMenu();

    const showNamesSelect = document.getElementById("showNames");
    const showSkinsSelect = document.getElementById("showSkins");
    const showMassCheckbox = document.getElementById("showMass");
    const hideFoodCheckbox = document.getElementById("hideFood");

    // Matches the option values createDropdown() (dom.js) builds for showNames/showSkins.
    const DISPLAY_PREFERENCE_VALUES = ["all", "party", "self", "none"];

    // Cycles/toggles a display-preference setting (showNames/showSkins) and applies it via
    // the bridge, using bundle.js's own live value as the source of truth rather than the
    // <select>'s current value. selectEl is only updated afterwards to keep the settings
    // menu visually in sync if it's open - the applied change doesn't depend on it.
    async function cycleDisplayPreference(key, toggleValues, selectEl) {
        const state = await germsfoxGetState();
        if (!state) return;
        const current = state.settings[key];

        let next;
        if (!settings.toggleSettings) {
            next = DISPLAY_PREFERENCE_VALUES[(DISPLAY_PREFERENCE_VALUES.indexOf(current) + 1) % DISPLAY_PREFERENCE_VALUES.length];
        } else {
            next = current === toggleValues[0] ? toggleValues[1] : toggleValues[0];
        }

        germsfoxCall('changeSetting', key, next);
        selectEl.value = next;
    }

    document.addEventListener('keydown', (event) => {
        if (usingInput) return;
        switch (event.code) {
            case settings.controls.multibox[0]:
                event.preventDefault();
                if (settings.switcherEnabled === false) break;
                if (settings.switcherWindowed) {
                    //console.debug("Switching windows!");
                    chrome.runtime.sendMessage({ action: "switchWindows"});
                } else {
                    //console.debug("Switching tabs!");
                    chrome.runtime.sendMessage({ action: "switchTabs"});
                }
                break;
            case settings.controls.toggleNames[0]:
                event.preventDefault();
                cycleDisplayPreference("showNames", settings.toggleNames, showNamesSelect);
                break;
            case settings.controls.toggleSkins[0]:
                event.preventDefault();
                cycleDisplayPreference("showSkins", settings.toggleSkins, showSkinsSelect);
                break;
            case settings.controls.toggleMass[0]:
                event.preventDefault();
                germsfoxGetState().then(state => {
                    if (!state) return;
                    const next = !state.settings.showMass;
                    germsfoxCall('changeSetting', 'showMass', next);
                    showMassCheckbox.checked = next;
                });
                break;
            case settings.controls.toggleFood[0]:
                event.preventDefault();
                germsfoxGetState().then(state => {
                    if (!state) return;
                    const next = !state.settings.hideFood;
                    germsfoxCall('changeSetting', 'hideFood', next);
                    hideFoodCheckbox.checked = next;
                });
                break;
        }
    });

    const skinButton = document.getElementById("skin");
    skinButton.addEventListener('click', () => {
        renderCustomColorsMenu();
        renderCustomSkinsMenu();
    });
}

function getChatNames(amount) {
    const chatNamesList = [];
    chatBox = document.getElementById("worldTab");

    for (const chatMessage of chatBox.children) {
        const chatterNameElement = chatMessage.querySelector('b');
        if (chatterNameElement) {
            const chatterName = chatterNameElement.textContent;
            if (!chatNamesList.includes(chatterName)) {
                chatNamesList.unshift(chatterName);
                if (chatNamesList.length >= amount) break;
            }
        }
    }
    return chatNamesList;
}

function initDebug() { // We need to poll live game state to detect spawns
    //console.debug("Initializing spawn poll");
    if (debugPollInterval) clearInterval(debugPollInterval);

    debugPollInterval = setInterval(checkForSpawn, 500); // Matches bundle.js's own debug HUD update interval

    async function checkForSpawn() {
        //console.debug("Checking for life...");
        const state = await germsfoxGetState();
        if (!state) return;
        if (!hasSpawned && state.alive) {
            console.log("First spawn");
            hasSpawned = true;
            if (settings.setColor !== "None") setSkin(settings.setColor);
            //console.debug("Stopping spawn poll");
            clearInterval(debugPollInterval);
        }
    }
}

function initDebugAfterDeath() {
    //console.debug("Initializing death poll");
    if (debugPollInterval) clearInterval(debugPollInterval);
    debugPollInterval = setInterval(checkForDeath, 500);

    async function checkForDeath() {
        //console.debug("Checking for death...");
        const state = await germsfoxGetState();
        if (!state) return;
        if (!state.alive) {
            console.log("You died");
            hasSpawned = false;
            clearInterval(debugPollInterval);
            initDebug();
        }
    }
}

function initChat() {
    let chatInput = document.getElementById("chat_input");
    chatInput.setAttribute("maxlength", 138); // Reflect the (strange) server-side max length of chat messages
    chatInput.style.width = "175px";
    renderEmotesPanel();

    chatInput.addEventListener('focus', () => {
        usingInput = true;
    });

    chatInput.addEventListener('blur', () => {
        usingInput = false;
    });

    let chatBox = document.getElementById("worldTab");

    // Block certain players & invites 
    let chatObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type !== "childList") return;

            const lastMessage = chatBox.lastElementChild;
            if (!lastMessage) return;

            const chatterNameElement = lastMessage.querySelector('b');
            const chatParagraph = lastMessage.querySelector('p');
            const inviteButton = lastMessage.querySelector('button');

            if (chatterNameElement) {
                const chatterName = chatterNameElement.textContent;
                //console.debug(`Received message from ${chatterName}`);

                if (settings.playerBlocklist.includes(chatterName)) {
                    lastMessage.style.display = "none";
                    //console.debug(`Hid message from ${chatterName}`);
                    return;
                }
                // funny roblock censorship (kinda sucks though)
                if (!germsSettings.disableProfanityFilter && chatParagraph?.textContent.includes('*')) {
                    const paragraphHTML = chatParagraph.innerHTML;
                    const splitIndex = paragraphHTML.indexOf("</b>") + 4;
                    chatParagraph.innerHTML =
                        paragraphHTML.substring(0, splitIndex) +
                        paragraphHTML.substring(splitIndex).replace(/\*/g, '#');
                }// Replace emotes and stickers
                if (chatParagraph) {
                    // bundle.js already scrolls the chat tab to the bottom the instant a message
                    // is appended, but these images have no src yet at that point (set below,
                    // asynchronously) - a sticker in particular still occupies ~0px until its src
                    // is set AND the image finishes loading, so that initial scroll undershoots.
                    // Re-scroll once each image actually has its real size.
                    const germsfoxEmoteImgElements = chatParagraph.querySelectorAll(".germsfoxEmote");
                    for (const germsfoxEmoteImg of germsfoxEmoteImgElements) {
                        germsfoxEmoteImg.addEventListener('load', () => { chatBox.scrollTop = chatBox.scrollHeight; }, { once: true });
                        germsfoxEmoteImg.src = chrome.runtime.getURL(`images/emotes/${germsfoxEmoteImg.dataset.filename}`);
                    }
                    const germsfoxStickerImgElements = chatParagraph.querySelectorAll(".germsfoxSticker");
                    for (const germsfoxStickerImg of germsfoxStickerImgElements) {
                        germsfoxStickerImg.addEventListener('load', () => { chatBox.scrollTop = chatBox.scrollHeight; }, { once: true });
                        germsfoxStickerImg.src = chrome.runtime.getURL(`images/stickers/${germsfoxStickerImg.dataset.filename}`);
                    }
                }
            }

            if (settings.ignoreInvites && inviteButton && (inviteButton.id === "acceptInvite" || inviteButton.id === "declineInvite")) {
                inviteButton.parentElement.remove();
                //console.debug("Removed invite");
            }
        });
    });

    chatObserver.observe(chatBox, {childList: true});
    return chatBox;
}

function initConnecting() {
    const connectingDiv = document.getElementById("connecting");
    let visible = false;

    // Visibility of the "connecting" overlay isn't game state bundle.js tracks separately -
    // it IS the DOM element, so this stays a style-watching MutationObserver.
    const connectingObserver = new MutationObserver(() => changedServers());
    connectingObserver.observe(connectingDiv, { attributes: true, attributeFilter: ["style"] });

    async function changedServers() {
        const nowVisible = connectingDiv.style.display !== "none";
        if (visible === nowVisible) return; // Don't care if it's the same
        visible = nowVisible;
        if (!visible) return; // Don't care if it hid itself

        console.debug("Changed servers");
        hasSpawned = false;
        const state = await germsfoxGetState();
        if (settings.setColor !== "None" && ( // You have a color
            settings.setSkin === "None" || !(state && state.loggedIn)) // You have no skin or aren't logged in
            ) {
            console.debug("Setting skin to color because you don't have a skin");
            setSkin(settings.setColor)
        } else {
            setSkin(settings.setSkin);
        }
        // Your mass might still be >0 if you changed servers while you were alive
        // Need to wait until it resets to 0 before treating you as dead
        if (state && state.alive) {
            initDebugAfterDeath();
            return;
        }
        initDebug();
    }
}

