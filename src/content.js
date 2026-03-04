/*
 *  Reliant on ./storage.js and ./dom.js for their respective helper functions
 *  Strangely, standard ES modules are not supported (?) in the isolated content_scripts world
 *  To work around this, each script is ran consecutively within the world's scope to generate
 *  functions for use here
 */

console.info("Running content.js");

// TODO: Set global settings state in a background service worker rather than within content_scripts
let settings = null;
let usingInput = false;

init();

async function init() {
    try {
        settings = await getSettings();
        germsSettings = await getGermsSettings();

        let animationDelayRange = document.getElementById("animationDelay");
        animationDelayRange.setAttribute('min', '10'); // Lower minimum animation delay to 10

        initChat();
        renderNick();
        renderGermsfoxButton();
        renderCustomColorsMenu();
        renderCustomSkinsMenu();
        renderPlayerMenu();

        const showNamesSelect = document.getElementById("showNames");
        const showSkinsSelect = document.getElementById("showSkins");
        const showMassCheckbox = document.getElementById("showMass");
        const hideFoodCheckbox = document.getElementById("hideFood");

        document.addEventListener('keydown', (event) => {
            if (usingInput) return;
            switch (event.code) {

                case settings.controls.multibox[0]:
                    event.preventDefault();
                    if (settings.switcherEnabled === false) break;
                    if (settings.switcherWindowed) {
                        console.debug("Switching windows!");
                        chrome.runtime.sendMessage({ action: "switchWindows"});
                    } else {
                        console.debug("Switching tabs!");
                        chrome.runtime.sendMessage({ action: "switchTabs"});
                    }
                    break;

                case settings.controls.toggleNames[0]:
                    event.preventDefault();
                    if (!settings.toggleSettings) {
                        console.debug("Cycling names");
                        showNamesSelect.selectedIndex = (showNamesSelect.selectedIndex + 1) % showSkinsSelect.options.length; 
                        showNamesSelect.dispatchEvent(new Event("change"));
                    } else {
                        console.debug("Toggling names");
                        if (showNamesSelect.value === settings.toggleNames[0]) {
                            showNamesSelect.value = settings.toggleNames[1];
                        } else showNamesSelect.value = settings.toggleNames[0];
                        showNamesSelect.dispatchEvent(new Event("change"));
                    }
                    break;

                case settings.controls.toggleSkins[0]:
                    event.preventDefault();
                    if (!settings.toggleSettings) {
                        console.debug("Cycling skins");
                        showSkinsSelect.selectedIndex = (showSkinsSelect.selectedIndex + 1) % showSkinsSelect.options.length; 
                        showSkinsSelect.dispatchEvent(new Event("change"));
                    } else {
                        console.debug("Toggling names");
                        if (showSkinsSelect.value === settings.toggleSkins[0]) {
                            showSkinsSelect.value = settings.toggleSkins[1];
                        } else showSkinsSelect.value = settings.toggleSkins[0];
                        showSkinsSelect.dispatchEvent(new Event("change"));
                    }
                    showSkinsSelect.dispatchEvent(new Event("change"));
                    break;

                case settings.controls.toggleMass[0]:
                    event.preventDefault();
                    showMassCheckbox.checked = !showMassCheckbox.checked;
                    showMassCheckbox.dispatchEvent(new Event("change"));
                    break;

                case settings.controls.toggleFood[0]:
                    event.preventDefault();
                    hideFoodCheckbox.checked = !hideFoodCheckbox.checked;
                    hideFoodCheckbox.dispatchEvent(new Event("change"));
                    break;
            }
        });

        const skinButton = document.getElementById("skin");
        skinButton.addEventListener('click', () => {
            renderCustomColorsMenu();
            renderCustomSkinsMenu();
        });
    } catch (error) {
        console.error("Could not initialize Germsfox: " + error);
    }
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

//TODO: reference in blocker tab menu
function unblockPlayerName(playerName) {
    settings.playerBlocklist.splice(settings.playerBlocklist.indexOf(playerName), 1); 

    // restore chat of sin
    let chatBox = document.getElementById("worldTab");
    for (const chatMessage of chatBox.children) {
        const messageName = chatMessage.querySelector("b");
        if (!messageName) continue;

        const chatterName = messageName.textContent;
        if (!(playerName === chatterName)) continue;
        chatMessage.style.display = "block";
    }
}

function blockPlayerName(playerName) {
    settings.playerBlocklist.push(playerName);

    let chatBox = document.getElementById("worldTab");
    // cleanse chat of sin
    for (const chatMessage of chatBox.children) {
        const messageName = chatMessage.querySelector("b");
        if (!messageName) continue;

        const chatterName = messageName.textContent;
        if (!settings.playerBlocklist.includes(chatterName)) continue;

        chatMessage.style.display = "none";
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
                    console.debug(`Hid message from ${chatterName}`);
                    return;
                }
                // funny roblock censorship (kinda sucks though)
                if (!germsSettings.disableProfanityFilter && chatParagraph?.textContent.includes('*')) {
                    const paragraphHTML = chatParagraph.innerHTML;
                    const splitIndex = paragraphHTML.indexOf("</b>") + 4;
                    chatParagraph.innerHTML =
                        paragraphHTML.substring(0, splitIndex) +
                        paragraphHTML.substring(splitIndex).replace(/\*/g, '#');
                }// Replace emotes
                if (chatParagraph) {
                    replaceEmotes(chatParagraph);
                }
            }

            if (settings.ignoreInvites && inviteButton && (inviteButton.id === "acceptInvite" || inviteButton.id === "declineInvite")) {
                inviteButton.parentElement.remove();
                console.debug("Removed invite");
            }
        });
    });

    chatObserver.observe(chatBox, {childList: true});
    return chatBox;

    function replaceEmotes(node) {
        // Only operate on text nodes
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;
            let matched = false;

            for (const emote of emotes) {
                const filename = emote.slice(0, emote.lastIndexOf("."));

                if (text.includes(filename)) {
                    matched = true;
                    break;
                }
            }

            if (!matched) return;

            const fragment = document.createDocumentFragment();

            while (text.length > 0) {
                let earliestIndex = -1;
                let matchedEmote = null;
                let matchedFilename = null;

                for (const emote of emotes) {
                    const filename = emote.slice(0, emote.lastIndexOf("."));
                    const index = text.indexOf(filename);

                    if (index !== -1 && (earliestIndex === -1 || index < earliestIndex)) {
                        earliestIndex = index;
                        matchedEmote = emote;
                        matchedFilename = filename;
                    }
                }

                if (earliestIndex === -1) {
                    console.debug("No matches found");
                    fragment.appendChild(document.createTextNode(text));
                    break;
                }

                console.debug("Matched emote " + matchedEmote);

                if (earliestIndex > 0) {
                    fragment.appendChild(
                        document.createTextNode(text.slice(0, earliestIndex))
                    );
                }

                const img = document.createElement("img");
                img.src = chrome.runtime.getURL(`images/emotes/${matchedEmote}`);
                img.classList.add("chatEmote");

                console.debug("Appending image");
                fragment.appendChild(img);

                text = text.slice(earliestIndex + matchedFilename.length);
            }

            console.debug("Replacing with complete text+emote fragment");
            node.replaceWith(fragment);
            return;
        }

        // Recursively process child nodes
        if (node.tagName === "B") return; // Username

        node.childNodes.forEach(replaceEmotes);
    }
}

