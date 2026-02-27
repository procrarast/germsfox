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
                    console.debug("Toggling names");
                    showNamesSelect.selectedIndex = (showNamesSelect.selectedIndex + 1) % showSkinsSelect.options.length;
                    showNamesSelect.dispatchEvent(new Event("change", { bubbles: true }));
                    //showNamesSelect.onchange();
                    break;
                case settings.controls.toggleSkins[0]:
                    showSkinsSelect.selectedIndex = (showSkinsSelect.selectedIndex + 1) % showSkinsSelect.options.length;
                    showSkinsSelect.dispatchEvent(new Event("change", { bubbles: true }));
                    //showSkinsSelect.onchange();
                    break;
                case settings.controls.toggleMass[0]:
                    showMassCheckbox.checked = !showMassCheckbox.checked;
                    showMassCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
                    //showMassCheckbox.onchange();
                    break;
                case settings.controls.toggleFood[0]:
                    hideFoodCheckbox.checked = !hideFoodCheckbox.checked;
                    hideFoodCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
                    //hideFoodCheckbox.onchange();
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

                // The funny roblock censorship (kinda sucks though)
                if (!germsSettings.disableProfanityFilter && chatParagraph?.textContent.includes('*')) {
                    const paragraphHTML = chatParagraph.innerHTML;
                    const splitIndex = paragraphHTML.indexOf("</b>") + 4;
                    chatParagraph.innerHTML =
                        paragraphHTML.substring(0, splitIndex) +
                        paragraphHTML.substring(splitIndex).replace(/\*/g, '#');
                }

                if (settings.playerBlocklist.includes(chatterName)) {
                    lastMessage.style.display = "none";
                    console.debug(`Hid message from ${chatterName}`);
                    return;
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
}

