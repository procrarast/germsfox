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

init();

async function init() {
    settings = await getSettings();
    germsSettings = await getGermsSettings();
    await loadEmoteLists();   // renderEmotesPanel() and the chat observer both need it

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
    renderGameMenu();
    renderDailyLeaderboardPanel();
    renderNick();
    renderGermsfoxButton();
    renderPlayerMenu();
    renderUpdateNotice();

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
            /**
             *  All four hand straight over to bundle.js, which holds the current value, the
             *  setting to write and the control to update. Asking it for state first and then
             *  telling it what to do was two bridge messages to decide something it could have
             *  decided alone. `toggleSettings` off means walk the whole list instead of flipping
             *  between the configured pair.
             */
            case settings.controls.toggleNames[0]:
                event.preventDefault();
                germsfoxCall('cycleDisplayPreference', 'showNames',
                    settings.toggleSettings ? settings.toggleNames : null);
                break;
            case settings.controls.toggleSkins[0]:
                event.preventDefault();
                germsfoxCall('cycleDisplayPreference', 'showSkins',
                    settings.toggleSettings ? settings.toggleSkins : null);
                break;
            case settings.controls.toggleMass[0]:
                event.preventDefault();
                germsfoxCall('toggleSetting', 'showMass');
                break;
            case settings.controls.toggleFood[0]:
                event.preventDefault();
                germsfoxCall('toggleSetting', 'hideFood');
                break;
        }
    });

    /**
     *  You spawned or died - pushed by bundle.js rather than polled for. Applying the configured
     *  colour on every spawn is what the old two-interval dance amounted to: arm a watcher, wait
     *  for the first spawn, apply, then re-arm after the next death.
     */
    document.addEventListener('germsfox:alive', (event) => {
        hasSpawned = event.detail.alive;
        if (hasSpawned && settings.setColor !== "None") setSkin(settings.setColor);
    });

    /**
     *  Germsfox settings written by another tab.
     *
     *  chrome.storage fires this in every extension context, so like the `storage` event
     *  bundle.js uses for germs' own blob, the sync needs no transport - only somewhere to
     *  land. The two halves stay separate because their stores are: this one covers what
     *  lives in chrome.storage, Settings.applyRemote() covers the localStorage blob.
     *
     *  Deliberately never calls setSetting(), which would write the value straight back and
     *  have every tab re-broadcasting every change for as long as they are open.
     */
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== "local") return;

        let touched = false;
        for (const key in changes) {
            if (!(key in settings) || SETTINGS_NOT_SYNCED.has(key)) continue;

            /**
             *  Skip what this tab already has. chrome.storage fires this in the tab that wrote
             *  as well as the others, and setSetting() updates `settings` before it writes - so
             *  a change of our own arrives here already applied.
             *
             *  Worth the compare rather than re-rendering anyway: rebuilding a pane replaces
             *  every row in it, and a toggle that is destroyed and recreated in its new state
             *  never runs the CSS transition on its slider. Flipping one's own switch stopped
             *  animating the moment this listener existed.
             */
            const incoming = changes[key].newValue ?? DEFAULT_SETTINGS[key];
            if (JSON.stringify(settings[key]) === JSON.stringify(incoming)) continue;

            settings[key] = incoming;
            touched = true;
        }
        if (!touched) return;

        // The panes read `settings` as they build, so rebuilding is what makes a synced change
        // visible - and only worth doing for one that is actually on screen
        if (document.getElementById("germsfoxSettings")?.style.display !== "none") {
            renderGeneralTabPane();
            renderControlsTabPane();
            renderBlocklistTabPane();
        }

        // The two settings with an effect outside their own pane
        if ("disablePishi" in changes) {
            document.getElementById("menuLogo").src = settings.disablePishi
                ? "res/logo.png?v=2" : chrome.runtime.getURL("/images/icon.png");
        }
        if ("showDailyLeaderboard" in changes) {
            const panel = document.getElementById("germsfoxDailyLeaderboard");
            if (panel) {
                const hasEntries = panel.querySelector("ul").children.length > 0;
                panel.style.display = settings.showDailyLeaderboard && hasEntries ? "block" : "none";
            }
        }
    });

    /**
     *  germs' own settings took a key, so drop any germsfox binding on it - see
     *  unbindDuplicateControls(). Saved straight rather than through setControlsSetting(),
     *  which would bounce the same key back over the bridge and undo the binding that just
     *  caused this.
     */
    document.addEventListener('germsfox:keybind', async (event) => {
        const cleared = unbindDuplicateControls(null, event.detail?.code);
        if (!cleared.length) return;

        console.debug(`Unbound ${cleared.join(", ")} - reused by germs' own controls`);
        await chrome.storage.local.set({ controls: settings.controls });
        if (document.getElementById("germsfox-settings-controls")) renderControlsTabPane();
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
    }
}

