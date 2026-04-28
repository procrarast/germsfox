
/* The purpose of this """module""" is to handle browser state.
 * Specifically, it handles most browser storage queries,
 * including extension settings and user-submitted skins/blocklist data
 */

console.debug("Running storage.js");

const emotes = [
    "flafDuh.png",
    "gsFlooshed.png",
    "gsPls.png",
    "gsHollow.png",
    "Self.png",
    "DELTA.png",
    "Tree.png",
    "Mafu.png",
    "josemorales.png",
    "SKUL.png",
    "trollskull.png",
    "gsSmil.png",
    "colon33.png",
    "NAILS.png",
    "Idio.png",
    "YIPPEE.png",
    "sademoji.png",
    "LOAL.png",
    "steamhappy.png",
    "yippie.png",
    "AGONY.png",
    "HAHA.png",
    "fucker.png",
    "rice_cat.png",
    "shup.png",
    "catAware.png",
    "catQue.png",
    "catOMG.png",
    "catBath.png",
    "catHi.png",
    "catnodwashingmachine.gif",
    "catResort.png",
    "flabbergastedMilly.png",
    "gg28.png",
    "katameow.png",
    "pcRacc.png",
    "pcStare.png",
    "widekisser.png",
    "firTilt.gif",
    "UIOHADFGIUOHDAVFB.png",
    "catWhat.png",
    "myhonesterection.png",
    "munch.png",
    "choccy.png",
    "yapyapyap.gif",
    "gsPuddle.png",
];


// [event.code, 'pretty' key label]
// An unset keybind is an empty string ""
const DEFAULT_CONTROLS = {
    multibox: ["Tab", "Tab"],
    toggleNames: ["KeyN", "N"],
    toggleSkins: ["KeyB", "B"],
    toggleMass: ["KeyM", "M"],
    toggleFood: ["", ""]
};

const DEFAULT_SETTINGS = {
    controls: DEFAULT_CONTROLS,
    setSkin: "None", //document.getElementById("skin").style.backgroundImage.slice(5, -2)
    setColor: "None",
    customSkins: [],
    skinBlocklist: [],
    playerBlocklist: [],
    toggleNames: ["all", "none"],
    toggleSkins: ["all", "none"],
    switcherEnabled: false,
    switcherWindowed: false,
    ignoreInvites: false,
    toggleSettings: true,
    autoLogout: false,
    backgroundColorEnabled: false,
    backgroundColor: [0.0, 0.0, 0.0],
    cellColorEnabled: false,
    cellColor: [1.0, 1.0, 1.0],
    foodColorEnabled: false,
    foodColor: [1.0, 1.0, 1.0],
    virusColorEnabled: false,
    virusColor: [1.0, 1.0, 1.0],
    borderColorEnabled: false,
    borderColor: [1.0, 1.0, 1.0]
};

const DEFAULT_GERMS_SETTINGS = {
    disableProfanityFilter: false
};

// name of the cell picker - name of the skin - approximate color that the skin provides
const cellColorList = {
    "Brown": ["Griffin", "#371f0f"],
    "Dark Red": ["black comets", "#860410"],
    "Orange": ["Trident", "#d37400"],
    "Yellow": ["Xiphos", "#ddb920"],
    "Lime": ["green dragon", "#75d600"],
    "Green": ["germs gorilla", "#00dd00"],
    "Dark green": ["jello alien", "#3fbb00"],
    "Turquoise": ["robo cat", "#0aaada"],
    "Blue": ["Omega", "#2389dd"],
    "Dark Blue": ["scenery", "#406cc7"],
    "Purple": ["boo", "#6936a6"],
}

// structuredClone dereferences from default consts
//TODO: Need a robust, modular settings state provided by background.js, NOT here
settings = structuredClone(DEFAULT_SETTINGS);
germsSettings = structuredClone(DEFAULT_GERMS_SETTINGS);

const handlers = {
    exportSkins,
    storeSkins,
    getSettings,
    challengeSubmitted,
    challengeFinished,
    changedServers
};

chrome.runtime.onMessage.addListener((request, sender) => {
    const handler = handlers[request.action];
    if (handler) handler(request, sender);
});

function changedServers() {
    console.debug("Changed servers");
    hasSpawned = false;
    if (settings.setColor !== "None" && settings.setSkin === "None") { // If you have a color and no skin
        console.debug("Setting skin to color because you don't have a skin");
        setSkin(settings.setColor)
    } else {
        setSkin(settings.setSkin);
    }
    initDebug(); // re-init the listener
}
function challengeSubmitted() {
    console.debug("Captcha submitted");
    const playButton = document.getElementById("play");
    const playButtonIcon = playButton.querySelector("i");
    playButton.disabled = true;
    playButtonIcon.classList = "fas fa-spinner fa-spin";
    playButton.classList.add("disabled");

    // When connecting to a new server, the button gets enabled way before the captcha finishes. This playButtonObserver prevents that 

    if (playButtonObserver) playButtonObserver.disconnect();
    playButtonObserver = new MutationObserver(() => {
        if (!playButton.disabled) playButton.disabled = true;
    });
    playButtonObserver.observe(playButton, {
        attributes: true, attributeFilter: ['disabled'] 
    });
}

// Regardless of whether it succeeds or fails, re-enable the button.
function challengeFinished() {
    console.debug("Captcha completed");
    const playButton = document.getElementById("play");
    const playButtonIcon = playButton.querySelector("i");
    playButtonIcon.classList = "fas fa-play";
    playButton.disabled = false;
    playButton.classList.remove("disabled");
    playButtonObserver.disconnect();
}


// germs.io settings
// We don't need this for any reason except for the toy 'robloxification' censorship
// when Disable Profanity Filter isn't on, but maybe it'll be useful later
function getGermsSettings() {
    try {
        const rawSettings = localStorage.getItem('settings');
        if (rawSettings) {
            console.info("Settings key retrieved");
            const parsedSettings = JSON.parse(rawSettings);
            // always exists
            germsSettings.disableProfanityFilter = parsedSettings.disableProfanityFilter;
        } else {
            console.warn("Settings key value is either empty or not found");
        }
    } catch (error) {
        console.warn("Error retrieving germs.io settings key: " + error);
    }
    return germsSettings;
}

// germsfox settings
async function getSettings() {
    try {
        const storedSettings = await chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS));

        // Merge stored settings with defaults
        settings = { ...DEFAULT_SETTINGS };
        for (item in settings) {
            if (storedSettings[item] != null) {
                settings[item] = storedSettings[item];
                //console.debug("Stored array has item: " + item + " with value " + storedSettings[item]);
            } else {
                // Note that this does not store default values to localStorage, we 
                // always rely on settings changes to change them
                //console.debug("Stored array has null item: " + item + " with value " + storedSettings[item]);
                settings[item] = DEFAULT_SETTINGS[item];
                //console.debug("Temporarily set " + item + " to value " + DEFAULT_SETTINGS[item]);
            }
        }
    } catch (error) {
        console.warn("Could not get stored settings: " + error);
    }
    console.debug("Retrieved settings");
    return settings;
}

// Should ideally be used for all persistent settings changes
async function setSetting(key, value) {
    if (settings[key] === value) {
        return;
    }
    console.debug(`Setting ${key} from ${settings[key]} to ${value}`);
    settings[key] = value;

    await chrome.storage.local.set({ [key]: value });
    if (chrome.runtime.lastError) {
        console.error(`Failed to save ${key}: ${chrome.runtime.lastError}`);
    }
    chrome.runtime.sendMessage({ action: "updateSettings" });
}

// Same as above, except it sets settings.controls[key] since the original settings API design was flat
async function setControlsSetting(key, value) {
    console.debug(`Setting ${key} from ${settings.controls[key]} to ${value}`);
    settings.controls[key] = value;

    await chrome.storage.local.set({ controls: settings.controls });
    if (chrome.runtime.lastError) {
        console.error(`Failed to save ${key}: ${chrome.runtime.lastError}`);
    }

    chrome.runtime.sendMessage({ action: "updateSettings" });
}

function deleteAllCustomSkins() {
    const message = "Are you sure you want to delete all saved custom skins? This cannot be undone!";
    if (confirm(message)) {
        setSetting("customSkins", []);
    }
}

function tryAddingSkin(skin) {
    skin = skin.replace(/\s/g, ''); // remove whitespace
    if (skin.includes("https://i.imgur.com/") && !settings.customSkins.includes(skin)) { // if it's not a duplicate imgur link
        settings.customSkins.unshift(skin);
        chrome.storage.local.set({ "customSkins": settings.customSkins });
        console.debug("Added skin", skin);
        return true;
    } else {
        console.info("Invalid or duplicate skin input, ignoring");
        return false;
    }
}

function storeSkins(request) {
    for (const skin of request.skins) {
        if (tryAddingSkin(skin)) console.debug("Imported skin " + skin);
    }
}

function importSkinsFromFile(files) {
    console.debug("Importing skins from file");
    for (const file of files) {
        console.debug("File found");
        if (file && file.type === "application/json") {
            console.log("Reading file", file.name);
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const skins = JSON.parse(reader.result); // JSON is just a single array lol
                    for (const skin of skins) {
                        if (tryAddingSkin(skin)) console.log("Imported skin " + skin);
                    }
                } catch (error) {
                    console.error("JSON parse failed:", error);
                }
            };
            reader.readAsText(file);
        } else {
            console.warn("Invalid file type for", file.name);
        }
    }
}

function exportSkins() {
    const stringifiedArray = JSON.stringify(settings.customSkins);
    const blob = new Blob([stringifiedArray], { type: 'application/json' });
    const blobUrl = window.URL.createObjectURL(blob);

    chrome.runtime.sendMessage({ // you can't download from content_scripts
        action: 'download',
        url: blobUrl,
        filename: "skins.json"
    });
}

function resetBlockRules() {
    chrome.runtime.sendMessage({ action: "clearBlockRules" });
}

// Queries for a skinURL's respective button and clicks it
// skinURL can also be a key in cellColorList
function setSkin(skinURL) {
    console.log("Setting skin " + skinURL);
    let selector; // to be queried

    if (skinURL in cellColorList) skinURL = "premium/" + cellColorList[skinURL][0];

    if (skinURL === 'None') {
        selector = `[onclick="setSkin('None');"]`;
    } else if (skinURL.startsWith("res/skins/")) {
        selector = `[onclick="setSkin('${skinURL.slice(10, -4)}');"]`; // lol
    } else if (skinURL.startsWith("https://i.imgur.com/")) {
        selector = `[onclick="setSkin('${skinURL}')"]`;
    } else if (skinURL in cellColorList) { // Lazy
        selector = `[onclick="setSkin('premium/${skinURL}')"]`;
    } else {
        selector = `[onclick="setSkin('${skinURL}')"]`
    }
    // TODO: A player may have a skin set that they don't have saved. I suppose you could save it then click its button in that case, but that's too much work for me right now.

    const skinContainer = document.getElementById("skinContainer");
    const skinButton = skinContainer.querySelector(selector);
    if (skinButton) {
        skinButton.click();
        console.log("Success!");
        return true;
    } else {
        console.warn("Failed to find button for URL " + skinURL + " with selector " + selector);
        return false;
    }
}


