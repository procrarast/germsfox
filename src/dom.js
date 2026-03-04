/*
 * Generally handles DOM mutations
 * But you'd be wrong to assume that was all this does. It's a big bowl of spaghetti
 */

console.debug("Running dom.js");

function renderGermsfoxButton() {
    const settingsButton = document.getElementById("settingsButton");
    if (settingsButton) {
        let button = document.createElement("button");
        button.id = "germsfoxButton";
        button.type = "button";
        button.classList.add("btn", "germsfox-btn");
        /*const overlay = document.getElementById("germsfoxSettings");
        button.addEventListener("click", () => overlay.setAttribute("style", ""));*/
        // onclick for consistency with how germs handles similar button clicks
        button.onclick = openGermsfoxSettings;
        
        let img = document.createElement("img");
        img.id = "germsfoxIcon";
        img.alt = "Icon";
        img.src = chrome.runtime.getURL('images/gsDuhFox-38.png');

        button.append(img, " Germsfox ");
        settingsButton.insertAdjacentElement('afterend', button);
    }

    function openGermsfoxSettings() {
        let germsfoxSettings = document.getElementById("germsfoxSettings");
        if (germsfoxSettings) {
            renderGeneralTabPane();
            renderControlsTabPane();
            renderBlocklistTabPane();
            renderSkinsTabPane();
            const germsfoxSettingsContainer = document.getElementById("germsfoxSettingsContainer");
            const settingsContainer = document.getElementById("settingsContainer");
            germsfoxSettingsContainer.style.transform = settingsContainer.style.transform;
        } else {
            germsfoxSettings = renderGermsfoxSettings();
        }
        germsfoxSettings.setAttribute("style", "");
    }
}

function renderGermsfoxSettings() {
    // Settings overlay will be appended to menu later
    const menu = document.getElementById("menu");

    // ===== Background Overlay =====
    const overlay = document.createElement("div");

    overlay.id = "germsfoxSettings";
    overlay.style.display = 'none';
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) overlay.style.display = 'none';
    });

    // ===== Container div =====
    const container = document.createElement("div");
    const settingsContainer = document.getElementById("settingsContainer");
    container.id = "germsfoxSettingsContainer";
    // Note that the transform scale does not update upon window resize
    container.style.transform = settingsContainer.style.transform;

    // ===== Card div =====
    const card = document.createElement("div");
    card.id = "germsfoxSettingsCard";
    card.classList.add("card");

    // ===== Close i =====
    const closeBtn = document.createElement("i");
    closeBtn.id = "germsfoxSettingsClose";
    closeBtn.classList.add("fas", "fa-times");
    closeBtn.addEventListener("click", () => overlay.style.display = 'none');

    // ===== Nav ul =====
    const tabsNav = document.createElement("ul");
    tabsNav.id = "germsfoxSettingsTabs";
    tabsNav.classList.add("nav", "nav-pills");

    // ===== Tab Content div =====

    const tabContent = document.createElement("div");
    tabContent.id = "germsfoxSettingsTabsContent";
    tabContent.classList.add("tab-content");

    const tabNames = ["General", "Controls", "Blocklist", "Skins"];

    tabNames.forEach((name, index) => {
        const tabId = `germsfox-settings-${name.toLowerCase()}`;

        // ---- Nav li ----
        const li = document.createElement("li");
        li.classList.add("nav-item");

        const button = document.createElement("a");
        button.classList.add("nav-link");
        button.href = `#${tabId}`;
        button.textContent = name;
        button.dataset.toggle = "pill";
        button.role = "tab";

        if (index === 0) button.classList.add("active", "show");

        button.addEventListener("click", () => {
            // deactivate all buttons + content
            tabsNav
                .querySelectorAll(".nav-link")
                .forEach(b => b.classList.remove("active", "show"));

            tabContent
                .querySelectorAll(".tab-pane")
                .forEach(p => {
                    p.classList.remove("active", "show");
                });

            // activate selected button + content
            button.classList.add("active");
            const tabToShow = tabContent.querySelector(`#${tabId}`);
            tabToShow.classList.add("active");  // display: block
            tabToShow.offsetHeight;             // Hack to update style
            tabToShow.classList.add("show");    // opacity: 1
        });

        li.appendChild(button);
        tabsNav.appendChild(li);

        // ---- Tab Pane div ----
        const pane = document.createElement("div");
        pane.id = tabId;
        pane.classList.add("tab-pane", "fade");

        if (index === 0) pane.classList.add("active", "show");
        tabContent.appendChild(pane);
    });

    // ===== Assemble =====
    card.append(closeBtn, tabsNav, tabContent);
    container.appendChild(card);
    overlay.appendChild(container);

    menu.appendChild(overlay);

    renderGeneralTabPane();
    renderControlsTabPane();
    renderBlocklistTabPane();
    renderSkinsTabPane();

    return overlay;
}

function renderControlsTabPane() {
    console.debug("Rendering");
    const pane = document.getElementById("germsfox-settings-controls");
    pane.replaceChildren();

    const multiboxPill = createPill("Multibox");
    const multiboxCheckbox = createKeyTester("multibox", "Switch Tabs");

    const togglePill = createPill("Toggle Settings");

    const toggleCheckbox = createCheckbox("toggleSettings", "Toggle Names/Skins");
    const toggleInput = toggleCheckbox.querySelector("#toggleSettings");

    const toggleNamesKeyTester = createKeyTester("toggleNames", "Toggle Names");
    const toggleNamesDropdown = createToggleDropdown("toggleNames", "Switch Between");
    const toggleSkinsKeyTester = createKeyTester("toggleSkins", "Toggle Skins");
    const toggleSkinsDropdown = createToggleDropdown("toggleSkins", "Switch Between");

    const toggleFoodKeyTester = createKeyTester("toggleFood", "Toggle Food");
    const toggleMassKeyTester = createKeyTester("toggleMass", "Toggle Show Mass");

    pane.append(
        multiboxPill,
        multiboxCheckbox,

        togglePill,
        toggleCheckbox,
        toggleNamesKeyTester,
        toggleNamesDropdown,
        toggleSkinsKeyTester,
        toggleSkinsDropdown,
        toggleMassKeyTester,
        toggleFoodKeyTester
    );

    updateControlsTabPane();

    // Would love it if this were animated
    function updateControlsTabPane() {
        const clearfixes = pane.querySelectorAll(".clearfix");

        const toggleNamesLabel = toggleNamesKeyTester.querySelector(".col-md-6"); // The first column, whose textContent is the label
        const toggleSkinsLabel = toggleSkinsKeyTester.querySelector(".col-md-6");
        const toggleNamesClearfix = clearfixes[clearfixes.length - 2];
        const toggleSkinsClearfix = clearfixes[clearfixes.length - 1];

        if (settings.toggleSettings) {
            toggleNamesLabel.textContent = "Toggle Names";
            toggleSkinsLabel.textContent = "Toggle Skins";
            toggleNamesClearfix.style.display = "block";
            toggleSkinsClearfix.style.display = "block";
        } else {
            toggleNamesLabel.textContent = "Cycle Names";
            toggleSkinsLabel.textContent = "Cycle Skins";
            toggleNamesClearfix.style.display = "none";
            toggleSkinsClearfix.style.display = "none";
        }
    }
    
    // This input is special in that it updates a few elements, so override onchange
    toggleInput.onchange = async function() {
        await setSetting("toggleSettings", toggleInput.checked);
        updateControlsTabPane();
    };

    return pane;
}

// Update an existing controls tab pane
function updateControlsTabPane() {
    const pane = document.getElementById("germsfox-settings-controls");
    if (settings.toggleSettings) {
        toggleNamesKeyTester = createKeyTester("toggleNames", "Toggle Names");
        toggleNamesDropdown = createToggleDropdown("toggleNames", "Switch Between");
        toggleSkinsKeyTester = createKeyTester("toggleSkins", "Toggle Skins");
        toggleSkinsDropdown = createToggleDropdown("toggleSkins", "Switch Between");
        pane.replaceChildren(
            toggleNamesKeyTester,
            toggleNamesDropdown,
            toggleSkinsKeyTester,
            toggleSkinsDropdown
        );
    } else {
        toggleNamesKeyTester = createKeyTester("toggleNames", "Cycle Names");
        toggleSkinsKeyTester = createKeyTester("toggleSkins", "Cycle Skins");
        pane.append(toggleNamesKeyTester, toggleSkinsKeyTester);
    }
}

function createToggleDropdown(key, text) {
    const clearfix = document.createElement("div");
    clearfix.classList.add("clearfix");

    const label = document.createElement("p");
    label.classList.add("optionLabel");
    label.style.marginRight = "8px";
    label.style.float = "right";
    label.textContent = text;

    const firstSelect = createDropdown(key + "First");
    console.debug(settings[key]);
    firstSelect.value = settings[key][0];
    firstSelect.onchange = function() {
        setSetting(key, [this.value, settings[key][1]]);
    };

    const betweenText = document.createElement("p");
    betweenText.classList.add("optionLabel");
    betweenText.style.float = "right";
    betweenText.style.marginLeft = "8px";
    betweenText.style.marginRight = "8px";
    betweenText.textContent = "and";

    const secondSelect = createDropdown(key + "Second");
    secondSelect.value = settings[key][1];
    secondSelect.onchange = function() {
        setSetting(key, [settings[key][0], this.value]);
    };

    // backwards cause of float: right
    clearfix.append(
        secondSelect,
        betweenText,
        firstSelect,
        label
    );

    return clearfix;
}


// Return dropdown select
// onchange() is defined afterwards
function createDropdown(id) {
    const select = document.createElement("select");
    select.id = id;
    
    const values = [
        "All",
        "Party",
        "Self",
        "None"
    ];

    for (const value of values) {
        const option = document.createElement("option");
        option.value = value.toLowerCase();
        option.textContent = value;
        select.appendChild(option);
    }
    return select;
}


function renderSkinsTabPane() {
    const pane = document.getElementById("germsfox-settings-skins");
    pane.replaceChildren();

    const skinsPill = createPill("Custom Skins");
    const skinsExportButton = createDownloadButton("Export to File", "Export");
    const skinsImportButton = createFileInputButton(importSkinsFromFile, "Import from File", "Import");
    const skinsBlockerPill = createPill("Skin Blocker");
    const skinsResetButton = createButton(resetBlockRules, "Unblock All Skins", "Reset");

    pane.append(
        skinsPill,
        skinsExportButton,
        skinsImportButton,
        skinsBlockerPill,
        skinsResetButton
    );
    return pane;
}


function renderGeneralTabPane() {
    const pane = document.getElementById("germsfox-settings-general");
    pane.replaceChildren();

    const multiboxPill = createPill("Multibox"); 
    const multiboxEnabledCheckbox = createCheckbox("switcherEnabled", "Enable Multiboxing");
    const multiboxWindowedCheckbox = createCheckbox("switcherWindowed", "Windowed Mode");

    const generalPill = createPill("General");
    const generalInvitesCheckbox = createCheckbox("ignoreInvites", "Ignore Party Invites");
    const generalWarningCheckbox = createCheckbox("autoLogout", "Skip Logout Warnings");
   
    pane.append(
        generalPill,
        generalInvitesCheckbox,
        generalWarningCheckbox,

        multiboxPill,
        multiboxEnabledCheckbox,
        multiboxWindowedCheckbox,
    ); 

    return pane;
}

function renderBlocklistTabPane() {
    const pane = document.getElementById("germsfox-settings-blocklist");
    pane.replaceChildren();

    const muteChattersPill = createPill("Mute Players");
    pane.appendChild(muteChattersPill);

    const chatters = getChatNames(10);

    if (chatters.length === 0) {
        console.debug("Creating message");
        const ltgGif = document.createElement("img");
        ltgGif.src = "https://media1.tenor.com/m/pYh_Xp0IuloAAAAC/low-tier-god-ltg.gif";

        const message = `
            Nobody has chatted yet.\n
            When someone does, you can block them here!`;
        const messageLabel = document.createElement("p");
        messageLabel.textContent = message;
        pane.append(messageLabel, ltgGif);
        return pane;
    }

    for (const chatter of chatters) {
        const clearfix = document.createElement("div");
        clearfix.classList.add("clearfix");

        const chatterMuteButton = renderMuteButton(chatter);
        clearfix.appendChild(chatterMuteButton);
        pane.appendChild(clearfix);
    }
    return pane;
}

function createPill(text) {
    const pill = document.createElement("span");
    pill.classList.add("badge", "badge-pill", "badge-primary");
    pill.textContent = text;
    return pill;
}

function createFileInputButton(onChange, labelText, buttonText) {
    // Same as below, but perhaps the input could just be a label for a file input with .json acceptance
    const buttonRow = document.createElement("div");
    buttonRow.classList.add("row");
    buttonRow.style.marginLeft = "20px";

    const buttonLabelColumn = document.createElement("div");
    buttonLabelColumn.classList.add("col-md-6");
    buttonLabelColumn.style.fontSize = "20px";
    buttonLabelColumn.textContent = labelText;
    buttonLabelColumn.style.textAlign = "left";
    buttonLabelColumn.style.paddingLeft = "0px";

    const buttonColumn = document.createElement("div");
    buttonColumn.classList.add("col-md-6");
    buttonColumn.style.fontSize = "20px";

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("input-group", "input-group-sm");
    buttonContainer.style.marginBottom = "15px";

    const fileInput = document.createElement("input");
    fileInput.id = "skinsInput";
    fileInput.type = "file";
    fileInput.accept = "application/json";
    fileInput.style.display = "none";

    fileInput.addEventListener("change", (event) => {
        console.debug("Input clicked");
        onChange(event.target.files);
    });

    const button = document.createElement("label");
    button.htmlFor = "skinsInput";
    button.classList.add("btn");
    button.textContent = buttonText;

    // ===== Assemble =====
    buttonContainer.append(button, fileInput);
    buttonColumn.appendChild(buttonContainer);
    buttonRow.append(buttonLabelColumn, buttonColumn);

    return buttonRow;
}

function createDownloadButton(labelText, buttonText) {
    const stringifiedArray = JSON.stringify(settings.customSkins);
    const blob = new Blob([stringifiedArray], {type: 'application/json'});
    const blobUrl = window.URL.createObjectURL(blob);

    const buttonRow = document.createElement("div");
    buttonRow.classList.add("row");
    buttonRow.style.marginLeft = "20px";

    const buttonLabelColumn = document.createElement("div");
    buttonLabelColumn.classList.add("col-md-6");
    buttonLabelColumn.style.fontSize = "20px";
    buttonLabelColumn.textContent = labelText;
    buttonLabelColumn.style.textAlign = "left";
    buttonLabelColumn.style.paddingLeft = "0px";

    const buttonColumn = document.createElement("div");
    buttonColumn.classList.add("col-md-6");
    buttonColumn.style.fontSize = "20px";

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("input-group", "input-group-sm");
    buttonContainer.style.marginBottom = "15px";

    const button = document.createElement("input");
    button.type = "button";
    button.classList.add("btn");
    button.value = buttonText;
    button.style.width = "100px";
    button.style.height = "35px";
    button.style.lineHeight = "1";

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "skins";
    
    // ===== Assemble =====
    a.append(button);
    buttonContainer.append(a);
    buttonColumn.appendChild(buttonContainer);
    buttonRow.append(buttonLabelColumn, buttonColumn);

    return buttonRow;
}
// Creates a button row
function createButton(onClick, labelText, buttonText) {
    const buttonRow = document.createElement("div");
    buttonRow.classList.add("row");
    buttonRow.style.marginLeft = "20px";

    const buttonLabelColumn = document.createElement("div");
    buttonLabelColumn.classList.add("col-md-6");
    buttonLabelColumn.style.fontSize = "20px";
    buttonLabelColumn.textContent = labelText;
    buttonLabelColumn.style.textAlign = "left";
    buttonLabelColumn.style.paddingLeft = "0px";

    const buttonColumn = document.createElement("div");
    buttonColumn.classList.add("col-md-6");
    buttonColumn.style.fontSize = "20px";

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("input-group", "input-group-sm");
    buttonContainer.style.marginBottom = "15px";

    const button = document.createElement("input");
    button.onclick = onClick;
    button.type = "button";
    button.classList.add("btn");
    button.value = buttonText;
    button.style.width = "100px";
    button.style.height = "35px";
    button.style.lineHeight = "1";
    
    // ===== Assemble =====
    buttonContainer.append(button);
    buttonColumn.appendChild(buttonContainer);
    buttonRow.append(buttonLabelColumn, buttonColumn);

    return buttonRow;
}
// Return a div .row with a key (as in "keyboard") tester for settings.key
function createKeyTester(key, text) {
    const keyRow = document.createElement("div");
    keyRow.classList.add("row");
    keyRow.style.marginLeft = "20px";

    const keyLabelColumn = document.createElement("div");
    keyLabelColumn.classList.add("col-md-6");
    keyLabelColumn.style.fontSize = "20px";
    keyLabelColumn.style.paddingLeft = "0px";
    keyLabelColumn.style.textAlign = "left";
    keyLabelColumn.textContent = text;

    const keyTesterColumn = document.createElement("div");
    keyTesterColumn.classList.add("col-md-6");
    keyTesterColumn.style.fontSize = "20px";
    
    const keyTesterContainer = document.createElement("div");
    keyTesterContainer.classList.add("input-group", "input-group-sm");
    keyTesterContainer.style.width = "100px";

    const keyTester = document.createElement("input");
    keyTester.id = "keyMultibox"
    keyTester.classList.add("form-control");
    keyTester.type = "text";
    keyTester.value = settings.controls[key][1];

    keyTester.addEventListener('focus', () => {
        keyTester.addEventListener('keydown', submitSwitcherKey);
        usingInput = true;
    });

    keyTester.addEventListener('blur', () => {
        keyTester.removeEventListener('keydown', submitSwitcherKey);
        usingInput = false;
    });

    function submitSwitcherKey(event) {
        event.stopPropagation(); // I've never seen this before either! It prevents the event from reaching the document event listener
        event.preventDefault();
        if (event.key === "Escape") {
            // Unset the keybind
            keyTester.value = "";
            setControlsSetting(key, ["", ""]);
        } else {
            let prettyEventKey = event.key.charAt(0).toUpperCase() + event.key.slice(1);
            if (prettyEventKey === " ") prettyEventKey = "Space"; // There may be more edge cases to prettify
            keyTester.value = prettyEventKey;
            setControlsSetting(key, [event.code, prettyEventKey]);
        }
        keyTester.blur();
    }

    keyTesterContainer.appendChild(keyTester);
    keyTesterColumn.appendChild(keyTesterContainer);
    keyRow.append(keyLabelColumn, keyTesterColumn);

    return keyRow;
}

// Return a div .clearfix 
function createCheckbox(key, text) {
    const row = document.createElement("div");
    row.classList.add("clearfix");

    const header = document.createElement("h5");
    header.classList.add("optionLabel");
    header.textContent = text;

    const label = document.createElement("label");
    label.classList.add("switch");

    const checkbox = document.createElement("input");
    checkbox.id = key;
    checkbox.type = "checkbox";
    checkbox.checked = settings[key];
    checkbox.onchange = function() {
        setSetting(key, this.checked);
    }

    const slider = document.createElement("span");
    slider.classList.add("slider", "round");

    label.append(checkbox, slider);
    row.append(header, label);

    return row;
}

function renderMuteButton(chatter) {
    const blockButton = document.createElement("button");
    blockButton.classList.add("btn", "block-button");

    const muteIcon = document.createElement("i");
    muteIcon.classList.add("fas");

    const label = document.createTextNode(
        " " + chatter.replace(/\r?\n|\r/g, " ") + " "
    );

    blockButton.append(muteIcon, label);

    function updateBlockButton() {
        const blocked = settings.playerBlocklist.includes(chatter);

        blockButton.classList.toggle("blocked", blocked);

        muteIcon.classList.remove("fa-volume-up", "fa-volume-mute");
        muteIcon.classList.add(blocked ? "fa-volume-mute" : "fa-volume-up");
    }

    blockButton.addEventListener("click", () => {
        const blocked = settings.playerBlocklist.includes(chatter);

        if (blocked) {
            unblockPlayerName(chatter);
        } else {
            blockPlayerName(chatter);
        }

        updateBlockButton(); // update appearance only
    });

    updateBlockButton();
    return blockButton;
}

function getOwnedSkins() {
    const ownedSkins = []; // list of strings of skin names owned by the user, generated by iterating through the owned skins div
    const ownedSkinsDiv = document.getElementById("paidSkinList");
    const ownedSkinsLis = ownedSkinsDiv.getElementsByTagName("li");

    for (const ownedSkinLi of ownedSkinsLis) {
        if (ownedSkinLi.id == "skinSkin") {
            const filePath = ownedSkinLi.getElementsByTagName("img")[0].dataset.src;
            if (filePath.startsWith("res/skins/premium")) {
                ownedSkins.push(filePath.slice(18, -4)); //filename minus extension
                console.debug(filePath.slice(18, -4));
            }
        }
    }
    console.debug(`You have ${ownedSkins.length} owned skins.`); 
    return ownedSkins;
}

function renderCustomColorsMenu() {
    console.debug("Rendering custom colors menu");
    
    const ownedSkins = getOwnedSkins();

    // name of the cell picker - name of the skin - approximate color that the skin provides
    const cellColorList = {
        "Brown": [ "Griffin", "#371f0f" ],
        "Dark Red": ["black comets", "#860410" ],
        "Orange": [ "Trident", "#d37400" ],
        "Yellow": [ "Xiphos", "#ddb920" ],
        "Lime": [ "green dragon" , "#75d600"],
        "Green": [ "germs gorilla", "#00dd00" ],
        "Dark green": [ "jello alien", "#3fbb00" ],
        "Turquoise": [ "robo cat", "#0aaada" ],
        "Blue": [ "Omega", "#2389dd" ],
        "Dark Blue": [ "scenery", "#406cc7" ],
        "Purple": [ "boo", "#6936a6" ],
    }

    const skinListUl = document.getElementsByClassName("skinList")[0];
    
    const oldColorList = skinListUl.querySelector("#customCellColor");
    if (oldColorList) oldColorList.remove();

    /*const colorPickerContainerHTML = `
    <div id="customCellColor" style="display: block;">
        <span class="badge badge-pill badge-primary" style="margin-bottom: 15px;width: 100%;font-size: 17px;">Cell Color Picker</span>
        <div id="customColorList"></div>
    </div>`;*/

    const customColorsContainer = document.createElement("div");
    customColorsContainer.id = "customCellColor";
    customColorsContainer.style.display = "block";

    const customColorsPill = document.createElement("span");
    customColorsPill.classList.add("badge", "badge-pill", "badge-primary");
    customColorsPill.style.marginBottom = "15px";
    customColorsPill.style.width = "100%";
    customColorsPill.style.fontSize = "17px";
    customColorsPill.textContent = "Cell Colors";

    const customColorsTable = document.createElement("div");
    customColorsTable.id = "customColorList";

    for (const key in cellColorList) {
        const colorLi = document.createElement("li");

        const skinName = cellColorList[key][0];
        const cellColor = cellColorList[key][1];

        /*let imgHTML = `<li id="cellColorBtn"><img onclick="${items.autoLogout ? "logout();" : ""} setSkin('premium/${skinName}')" class="lazy loaded" style="border: 5px solid ${cellColor}; width="84" height="85"><p>${key}</p></li>`
        customColorsContainer.innerHTML += imgHTML;*/

        const colorDiv = document.createElement("div");
        colorDiv.classList.add("cellColorBtn");
        colorDiv.style.backgroundColor = cellColor;

        if (ownedSkins.includes(skinName)) {
            console.debug("Creating logout warning for " + cellColor);

            const colorTooltip = document.createElement("div");
            colorTooltip.classList.add("tooltip");

            const colorTooltipInner = document.createElement("p");
            colorTooltipInner.classList.add("tooltip-inner");
            colorTooltipInner.textContent = "You will be logged out!";

            colorTooltip.appendChild(colorTooltipInner);

            const colorWarning = document.createElement("span");
            colorWarning.textContent = "!";
            colorWarning.classList.add("cellColorWarning");
            colorWarning.appendChild(colorTooltip);

            if (settings.autoLogout) {
                colorDiv.setAttribute("onclick", `logout(); setSkin('premium/${skinName}')`);
            } else {
                // If you think this is disgusting, that's because it is. But it works!
                const message = 
                    `You are about to be logged out!\\n\\nTo stay logged in, use an account that does not own the ${skinName} skin.`;
                colorDiv.setAttribute("onclick", `if(confirm('${message}')){logout();}else{return;}setSkin('premium/${skinName}');`);
            }
            colorDiv.appendChild(colorWarning);
        } else {
            colorDiv.setAttribute("onclick", `setSkin('premium/${skinName}')`);
        }

        const colorLabel = document.createElement("p");
        colorLabel.textContent = key;

        colorLi.append(colorDiv, colorLabel);
        customColorsTable.appendChild(colorLi);
    }
    customColorsContainer.append(customColorsPill, customColorsTable);
    skinListUl.prepend(customColorsContainer);
}

function renderPlayerMenu() {
    console.debug("Rendering player menu");

    const chatBox = document.getElementById("worldTab");
    const playerMenu = document.getElementById("userMenuPlayer");
    const userMenu = document.getElementById("userMenu");
    let muteButton = playerMenu.getElementsByClassName("userMenuItem")[1]; // second menu option

    playerMenu.getElementsByTagName("hr")[1].remove(); // remove the 2nd horizontal line so we can add our own later

    // ===== Block Skin =====
    const blockSkinItem = document.createElement("li");
    blockSkinItem.classList.add("userMenuItem");

    const blockIcon = document.createElement("i");
    blockIcon.classList.add("fas", "fa-ban");

    const blockLabel = document.createElement("p");
    blockLabel.textContent = "Block Skin";

    blockSkinItem.append(blockIcon, blockLabel);

    // ===== Copy Skin =====
    const copySkinItem = document.createElement("li");
    copySkinItem.classList.add("userMenuItem");

    const copyIcon = document.createElement("i");
    copyIcon.classList.add("fas", "fa-copy");
    
    const copyLabel = document.createElement("p");
    copyLabel.textContent = "Copy Skin";

    copySkinItem.append(copyIcon, copyLabel);

    // ===== Assemble menu =====
    const hr = document.createElement("hr");

    playerMenu.append(
        blockSkinItem,
        copySkinItem,
        hr
    );

    // Remove screenshot button 

    const menuLeave = document.getElementById("userMenuLeaveParty");
    const menuCreate = document.getElementById("userMenuCreateParty");
    const menuItems = userMenu.querySelectorAll(".userMenuItem");
    const menuScreenshot = menuItems[menuItems.length - 1];
    menuCreate.querySelector("hr").remove();
    menuScreenshot.remove();

    const playerSkinElement = document.getElementById("userMenuPlayerSkin");

    copySkinItem.addEventListener('click', async function() {
        try {
            const skinURL = playerSkinElement.style.backgroundImage.replace(/url\("([^"]+)"\)/, "$1"); // replace url("https://i.imgur.com/example.png") with just the url itself
            if (skinURL.includes("imgur")) {
                await navigator.clipboard.writeText(skinURL);
                console.log(`Copied ${skinURL} to clipboard`);
            } else {
                console.log("Tried to copy a regular skin, doing nothing");
            }
            playerMenu.parentElement.parentElement.style.display = "none"; // hide the context menu after clicking the option so it behaves normally
        }  
            catch (error) {
            console.error("Failed to copy skin: ", error);
        }
    });

    blockSkinItem.addEventListener('click', function() {
        const skinURL = playerSkinElement.style.backgroundImage.replace(/url\("([^"]+)"\)/, "$1"); // replace url("https://i.imgur.com/example.png") with just the url itself

        if (!settings.skinBlocklist.includes(skinURL)) { // don't add unnecessary duplicates to the list
            if (skinURL.includes("imgur")) { // only accept imgur links
                settings.skinBlocklist.push(skinURL);
                chrome.storage.local.set({ "skinBlocklist": settings.skinBlocklist });
                chrome.runtime.sendMessage({ action: "addBlockRule", url: skinURL });

                let successMessage = `<div class="adminMessage" style="color: white;"><p> <font color="#00FF00">Skin blocked, please refresh this tab!</font></p></div>`;
                chatBox.innerHTML += successMessage;
                chatBox.scrollTop = chatBox.scrollHeight;
            } else {
                let errorMessage = `<div class="errorMessage" style="color: white;" ><p> <font color="#FF0000">You can only block custom skins.</font></p></div>`;
                chatBox.innerHTML += errorMessage;
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        } else { // only triggers when the user doesn't refresh their tab and tries to block the same skin
            let errorMessage = `<div class="errorMessage" style="color: white;"><p> <font color="#FF0000">Skin has already been blocked! Refresh your tab for it to take effect.</font></p></div>`;
            chatBox.innerHTML += errorMessage;
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        playerMenu.parentElement.parentElement.style.display = "none"; // hide the context menu after clicking the option so it behaves normally
    });

    muteButton.addEventListener('click', function() {
        console.debug("Mute button clicked");
        const playerNameElement = document.getElementById("userMenuPlayerName");
        const mutedTextElement = document.getElementById("userMenuBlockText");
        const playerName = playerNameElement.textContent;
        const mutedText = mutedTextElement.textContent;

        if (mutedText === "Mute Player" && !settings.playerBlocklist.includes(playerName)) {
            blockPlayerName(playerName);
            //let muteMessage = `<div class="adminMessage" style="color: white;"><p> <font color="#00FF00">${playerName} has been muted!</font></p></div>`;
            //chatBox.innerHTML += muteMessage;
        }

        else if (mutedText === "Unmute Player") {
            unblockPlayerName(playerName);
            //settings.playerBlocklist.splice(settings.playerBlocklist.indexOf(playerName), 1);
            //let muteMessage = `<div class="adminMessage" style="color: white;"><p> <font color="#00FF00">${playerName} has been unmuted.</font></p></div>`;
            //chatBox.innerHTML += muteMessage;
        }
        setSetting("playerBlocklist", settings.playerBlocklist);
        //chatBox.scrollTop = chatBox.scrollHeight;
    });

    // If the menu opens for an imgur skin, show related options. Else, hide them
    let userMenuObserver = new MutationObserver((mutations) => {
        console.debug("Player menu mutated");
        mutations.forEach((mutation) => {
            if (mutation.type === "attributes" && mutation.attributeName === "style" && userMenu.style.display === "block") {
                const skinURL = playerSkinElement.style.backgroundImage.replace(/url\("([^"]+)"\)/, "$1"); // replace url("https://i.imgur.com/example.png") with just the url itself
                if (skinURL.includes("imgur")) {
                    blockSkinItem.style.display = "block";
                    copySkinItem.style.display = "block";
                } else {
                    blockSkinItem.style.display = "none";
                    copySkinItem.style.display = "none";
                }
            }
        });
    });
    userMenuObserver.observe(userMenu, { attributes: true, attributeFilter: ["style"] });

    return playerMenu;
}

function renderNick() {
    console.debug("Rendering nickname");
    let nickInput = document.getElementById("nick");
    if (nickInput) {
        const nickTextarea = document.createElement('textarea');
        nickTextarea.id = nickInput.id;
        nickTextarea.value = nickInput.value;
        nickTextarea.placeholder = "Nickname";
        nickTextarea.style.textAlign = "left";
        nickTextarea.style.height = "50px";
        nickTextarea.style.resize = "none";
        nickTextarea.spellcheck = false;
        nickTextarea.maxLength = 25;

        nickInput.parentNode.replaceChild(nickTextarea, nickInput);
        nickInput = document.getElementById("nick"); // set to the new element
        nickInput.addEventListener('focus', () => {
            usingInput = true;
        });
        nickInput.addEventListener('blur', () => {
            usingInput = false;
        });
    }
}

function renderCustomSkinsMenu() {
    console.debug("Rendering custom skins menu");

    let customSkinsContainer = document.getElementById("customSkin");

    const oldSkinList = customSkinsContainer.querySelector("#customSkinList");
    if (oldSkinList) oldSkinList.remove();

    let applySkinButton = customSkinsContainer.querySelector(".btn-info");
    applySkinButton.addEventListener('click', submitCustomSkin);

    let customSkinsTable = document.createElement("div");
    customSkinsTable.id = "customSkinList";

    if (settings.customSkins.length === 0) {
        console.debug("No custom skins found");
        let warning = document.createElement('p');
        warning.textContent = `You have no Imgur skins saved!`;
        customSkinsTable.appendChild(warning);
        customSkinsTable.style.width = "100%";
        customSkinsContainer.appendChild(customSkinsTable);
        return customSkinsTable;
    }
    // create a new element to be displayed for each skin in customSkins
    console.debug("Creating elements for " + settings.customSkins.length + " skins");
    for (i = 0; i < settings.customSkins.length; i++) {
        customSkinsTable.appendChild(createSkinLi(settings.customSkins[i]));
    }

    customSkinsContainer.appendChild(customSkinsTable);

    // right click to display a delete button
    customSkinsTable.addEventListener("contextmenu", function(event) {
        console.debug("Context menu opened");
        tryRemoveDeleteButton();

        const imgSrc = event.target.src;
        if (imgSrc?.startsWith("https://i.imgur.com/")) {
            console.debug("Context menu opened for skin " + event.target.src);
            event.preventDefault();
            // creates a delete button at the top right of the image 
            event.target.parentNode.appendChild(createDeleteButton(imgSrc));
        }
    });

    function submitCustomSkin() {
        const customSkinInput = document.getElementById("loginCustomSkinText");
        const inputValue = customSkinInput.value;
        if (tryAddingSkin(inputValue)) {
            renderCustomSkinsMenu();
        }
        customSkinInput.value = ""; // clear the input box
    }

    function createDeleteButton(imgSrc) {
        console.debug(`Rendering delete button for skin ${imgSrc}`);

        tryRemoveDeleteButton();

        /*const deleteButtonHTML = `
        <button type="button" id="deleteButton" class="btn"><b>Delete</b></button>
        `;*/
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.id = "deleteButton";
        deleteButton.classList.add("btn");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener('click', () => {
            deleteButton.remove();
            settings.customSkins.splice(settings.customSkins.indexOf(imgSrc), 1); // assuming it always exists
            chrome.storage.local.set({"customSkins": settings.customSkins});
            console.log(`Deleted ${imgSrc}`);
            renderCustomSkinsMenu(); // Would rather do a parentNode.remove() but it won't work, so just re-render the whole thing
        });

        const skinsCard = document.getElementById("skinsCard");
        skinsCard.addEventListener('click', () => {
            tryRemoveDeleteButton();
        }, { once: true } );

        return deleteButton;
    }

    function tryRemoveDeleteButton() {
    // Trying to remove delete button
    let deleteButton = customSkinsTable.querySelector("#deleteButton");

        if (deleteButton) {
            deleteButton.remove();
            return true;
        } return false;
    }
}

function renderEmotesPanel() {
    const chatContainer = document.getElementById("chat");

    const emotesButton = document.createElement("button");
    emotesButton.id = "btnGermsfoxEmotes";
    // This is how germs hides related elements. Truly horrifying... but perhaps better than how I just handled #toggleSettings!
    emotesButton.setAttribute("onclick", `$('#germsfoxEmotes').toggle(); $('#channels').hide(); $('#emotes').hide(); $('#germsfoxEmotes').focus();`);

    const icon = document.createElement("img");
    icon.src = chrome.runtime.getURL('images/gsDuhFox-48.png');
    icon.classList.add("nodrag");

    emotesButton.appendChild(icon);

    const emotesPanel = document.createElement("div");
    emotesPanel.id = "germsfoxEmotes";
    emotesPanel.style.display = "none";

    const emotesList = document.createElement("ul");
    emotesList.id = "germsfoxEmotesList";

    const emotesHeader = document.createElement("h3");
    emotesHeader.textContent = "Emotes";

    for (const emote of emotes) {
        const filename = emote.slice(0, emote.lastIndexOf("."));

        const emoteLi = document.createElement("li");
        emoteLi.classList.add("emotesEmote");
        emoteLi.setAttribute("onclick", `addEmote('${filename}'); $('#germsfoxEmotes').hide();`);

        const emoteImg = document.createElement("img");
        emoteImg.src = chrome.runtime.getURL(`images/emotes/${emote}`);
        emoteImg.title = filename;
        emoteImg.name = filename; // Yes I know it's deprecated
        
        emoteLi.appendChild(emoteImg);
        emotesList.appendChild(emoteLi);
    }

    document.addEventListener("click", (event) => {
        // Would rather this not be so hacky, but trying to adhere to outdated germs style+convention makes this difficult
        if (emotesPanel.style.display === "block" && event.target != emotesButton && !emotesPanel.contains(event.target)) {
            //console.debug("Closing emotes tab");
            emotesPanel.style.display = 'none';
        }
    });

    emotesPanel.append(emotesHeader, emotesList);
    chatContainer.append(emotesButton, emotesPanel);
}

function createSkinLi(url) {
    let skinLi = document.createElement("li");
    skinLi.id = "skinSkin";

    let skinImg = document.createElement("img");
    // setSkin() provided by germ
    skinImg.setAttribute("onclick", `setSkin('${url}')`);
    skinImg.loading = "lazy";
    skinImg.style.width = 84;
    skinImg.style.height = 85;
    skinImg.src = url;

    skinLi.appendChild(skinImg);
    return skinLi;
}

function unblockPlayerName(playerName) {
    settings.playerBlocklist.splice(settings.playerBlocklist.indexOf(playerName), 1); 

    const chatBox = document.getElementById("worldTab");
    chatBox.scrollTop = chatBox.scrollHeight;

    chrome.storage.local.set({"playerBlocklist": settings.playerBlocklist});
}

function blockPlayerName(playerName) {
    settings.playerBlocklist.push(playerName);

    const chatBox = document.getElementById("worldTab");
    // cleanse chat of sin
    for (const chatMessage of chatBox.children) {
        const messageName = chatMessage.querySelector("b");
        if (!messageName) continue;

        const chatterName = messageName.textContent;
        if (!settings.playerBlocklist.includes(chatterName)) continue;

        chatMessage.remove();
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

