/*
 * Generally handles DOM mutations
 * But you'd be wrong to assume that was all this does. It's a big bowl of spaghetti
 */

console.debug("Running dom.js");

function renderGameMenu() {
    // Move socials to the right side of the menu to make room for cell preview+customizations
    const spectateIcon = document.getElementById("spectate").querySelector("i");
    spectateIcon.classList.replace("fa-eye", "fa-search"); // The eye has always creeped me out

    // Version href doesn't even work, so adding our own shouldn't be too invasive
    const versionAnchor = document.getElementById("version");
    versionAnchor.removeAttribute("href");
    
    //TODO add germsfox info

    const menuLeft = document.getElementById("menuLeft");

    const partyCard = document.getElementsByClassName("partyCard")[0];
    const socialIconsCard = document.getElementById("socialIcons").parentElement.parentElement;
    menuLeft.insertBefore(partyCard, socialIconsCard);

    // Remove locked name features from login menu, leaving only locked name code redemption
    //document.getElementById("loginCustom").remove();

    // Make room for the cell preview card
    const serversCard = document.getElementById("servers").parentElement;
    serversCard.style.height = "261px";
    document.getElementById("connecting").style.height = "250px";
    document.getElementById("serversTitle").style.marginBottom = "5px";

    renderCellPreviewCard();
}

function renderCellPreviewCard() {
    if (settings.setSkin.includes("free/")) {
        setSkin('None'); // Free skins buttons don't exist on load, so just set to none and let the user set it again themself
        setSetting("setSkin", "None");
    }
    console.debug("Rendering cell preview card");
    const skinsCard = document.getElementById("skins");
    const skinsListUl = document.getElementsByClassName("skinList")[0];

    const previewCard = document.createElement("div");
    previewCard.classList.add("card", "nodrag");
    previewCard.style.height = "250px";
    previewCard.style.padding = "11px 13px";
    previewCard.style.overflow = "none";
    previewCard.style.flexDirection = "row";
    
    const cellPanel = document.createElement("div");
    cellPanel.id = "cellPanel";

    const cellContainer = document.createElement("div");
    cellContainer.id = "cellContainer"

    let ownedSkins = getOwnedSkins();

    // Skin button
    const cellSkinButton = document.createElement("button");
    cellSkinButton.id = "cellSkinButton";
    cellSkinButton.style.backgroundImage = `url("${settings.setSkin}")`;
    
    const cellSkinLabel = document.createElement("p");
    cellSkinLabel.innerText = "Skin";
    cellSkinButton.appendChild(cellSkinLabel);

    function skinsListClicked(event) {
        event.preventDefault();
        event.stopPropagation();
        //console.debug("Skins list clicked");
        //console.debug(event.target.className, event.target.tagName);
        if (event.target.className === "cellColorBtn") {

            console.debug("Clicked a cell color. Setting the color and your skin");
            skinsCard.style.display = 'none';
            skinsListUl.removeEventListener('click', skinsListClicked, true);
            setSkin(settings.setSkin);
            hasSpawned = false;
            setSetting('setColor', event.target.nextElementSibling.textContent); // Adjacent p element has the key
        } else if (event.target.tagName === "IMG") {
            //console.debug("Preventing default click and setting a skin");
            if (event.target.src.startsWith("data")) {
                console.debug("Clicked a 'None' skin. Setting the skin setting");
                setSetting("setSkin", "None");
                cellSkin.style.display = "none";
                cellSkinButton.style.removeProperty("background-image");
                if (settings.setColor !== 'None' && hasSpawned) { // If you have a color and you have spawned
                    console.debug("Since you have a color and have spawned, setting your skin to 'None'");
                    skinsCard.style.display = 'none';
                    skinsListUl.removeEventListener('click', skinsListClicked, true);
                    setSkin("None");
                }
            } else { // Normal skin
                console.debug("You clicked a regular skin. Setting the skin");
                if (event.target.src.includes("imgur")) {
                    cellSkin.src = event.target.src;
                    skinsCard.style.display = 'none';
                    skinsListUl.removeEventListener('click', skinsListClicked, true);
                    
                    // Would the skin you're about to equip have on override your cell color?
                    const match = Object.entries(cellColorList).find(([_, val]) => val[0] === event.target.src.slice(18, -4));
                    if (match) {
                        // Set color to your skin
                        cellColor.style.backgroundColor = cellColorList[match[0]][1];
                    } else {
                        // If not, set color to your color
                        //console.debug(settings.setSkin.slice(18, -4) + " was not a match.");
                        cellColor.style.backgroundColor = cellColorList[settings.setColor][1];
                    }

                    setSkin(event.target.src);
                    cellSkinButton.style.backgroundImage = `url('${event.target.src}')`;
                    setSetting('setSkin', event.target.src);
                } else { // Not a custom skin
                    const completeSrc = `res/skins/${event.target.dataset.src.slice(10, -4)}.png`;
                    cellSkin.src = completeSrc;
                    
                    // Would the skin you're about to equip have on override your cell color?
                    const match = Object.entries(cellColorList).find(([_, val]) => val[0] === completeSrc.slice(18, -4));
                    if (match) {
                        // Set color to your skin
                        cellColor.style.backgroundColor = cellColorList[match[0]][1];
                    } else {
                        // If not, set color to your color
                        //console.debug(settings.setSkin.slice(18, -4) + " was not a match.");
                        cellColor.style.backgroundColor = cellColorList[settings.setColor][1];
                    }

                    skinsCard.style.display = 'none';
                    skinsListUl.removeEventListener('click', skinsListClicked, true);
                    setSkin(completeSrc);
                    cellSkinButton.style.backgroundImage = `url('${completeSrc}')`;
                    setSetting('setSkin', completeSrc);
                }
                cellSkin.style.display = "block";
            }
            hasSpawned = false;
            const match = debugText.innerHTML.match(/Mass:<\/b>\s*([\d.]+)/);

            if (match &&  parseFloat(match[1]) > 0) { // You're alive
                initDebugAfterDeath();
            } else {
                initDebug();
            }
        }
    }

    cellSkinButton.onclick = () => {
        document.getElementById("skin").click();

        console.debug("Adding event listener");
        skinsListUl.addEventListener('click', skinsListClicked, true); // If capture is not true, the card closes before the event listener triggers 

        const skinsObserver = new MutationObserver(() => {
            if (skinsCard.style.display === "none") {
                console.debug("Removing event listener and skins observer");
                skinsListUl.removeEventListener('click', skinsListClicked, true);
                skinsObserver.disconnect();
            }
        });
        skinsObserver.observe(skinsCard, { attributes: true, attributeFilter: ['style'] });
    }

    // Color buttons
    const buttonsContainer = renderColorButtons();

    // Cell preview
    const cellColor = document.createElement("div");
    cellColor.id = "cellColor";

    const cellSkin = document.createElement("img");
    cellSkin.id = "cellSkin";
    cellSkin.src = settings.setSkin;

    const cellNameContainer = document.createElement("div");
    cellNameContainer.id = "cellNameContainer";

    const cellName = document.createElement("h4");
    cellName.id = "cellName";
    const nickname = document.getElementById("nick").value;
    cellName.textContent = nickname;
    cellName.dataset.nick = nickname;

    // The size scaling at 0 and 25 chars is almost exact, but the curve between the two is not
    const rem = 2.75 - 1.375 * (nickname.length / 25); 
    cellName.style.fontSize = rem.toFixed(3) + "rem";

    // locked buttons (up, down, color picker
    const lockedButtons = document.createElement("div");
    lockedButtons.id = "lockedButtons";

    const lockedLabel = document.createElement("p");
    lockedLabel.innerText = "Locked";

    const lockedPosButtons = document.createElement("div");
    lockedPosButtons.id = "lockedPosButtons";

    const lockedUpButton = document.createElement("button");
    const lockedUpIcon = document.createElement("i");
    lockedUpIcon.classList.add("fas", "fa-arrow-up");
    lockedUpButton.onclick = () => {
        const lockedPosSelect = document.getElementById("lockedNamePositionSelect");
        if (document.getElementById("lockedNamePositionSelect")) {
            lockedPosSelect.selectedIndex = ((lockedPosSelect.selectedIndex - 1) + 3) % 3;
            lockedPosSelect.dispatchEvent(new Event("change"));
        }
    };
    lockedUpButton.appendChild(lockedUpIcon);

    const lockedDownButton = document.createElement("button");
    const lockedDownIcon = document.createElement("i");
    lockedDownIcon.classList.add("fas", "fa-arrow-down");
    lockedDownButton.onclick = () => {
        const lockedPosSelect = document.getElementById("lockedNamePositionSelect");
        if (lockedPosSelect) {
            lockedPosSelect.selectedIndex = (lockedPosSelect.selectedIndex + 1) % 3;
            lockedPosSelect.dispatchEvent(new Event("change"));
        }
    };
    lockedDownButton.appendChild(lockedDownIcon);

    lockedPosButtons.append(lockedUpButton, lockedDownButton);
    lockedButtons.append(lockedLabel, lockedPosButtons);
    
    // When you change accounts, update the preview
    const loginDiv = document.getElementById("login");
    const loginObserver = new MutationObserver(() => updatePreview());
    loginObserver.observe(loginDiv, { childList: true });

    // Color picker might not exist. If it doesn't, this observer will be attached later.
    let colorDiv = document.getElementById("lockedNameColorPicker");
    const colorObserver = new MutationObserver(() => updateColor());
    if (colorDiv) colorObserver.observe(colorDiv, { attributes: true, attributeFilter: ['style'] });

    // Track whether event listener is bound to locked position select
    let positionListenerAttached = false;

    updatePreview();
    previewCard.append(cellContainer, cellPanel);
    cellPanel.append(cellSkinButton, buttonsContainer, lockedButtons);//TODO: skin select, locked color, locked position
    cellNameContainer.appendChild(cellName);
    cellContainer.append(cellColor, cellSkin, cellNameContainer, );

    document.getElementById("menuRight").insertBefore(previewCard, document.getElementById("servers").parentElement);

    function updateColor() { // Triggered on color picker background change
        cellName.style.color = colorDiv.style.background;
    }
    function renderColorButtons() {
        const buttonsContainer = document.createElement("div");
        buttonsContainer.id = "cellButtons";

        const buttonsLabel = document.createElement("p");
        buttonsLabel.textContent = "Cell Color";
        buttonsContainer.appendChild(buttonsLabel);

        const randomColorButton = document.createElement("button");
        randomColorButton.style.backgroundColor = "rgb(200, 200, 200)";
        randomColorButton.style.display = "flex";
        randomColorButton.style.justifyContent = "center";
        randomColorButton.style.alignItems = "center";
        randomColorButton.style.fontSize = "9pt";
        randomColorButton.style.color = "rgba(0, 0, 0, 0.5)";
        randomColorButton.onclick = () => {
            console.debug("Set color to none");
            setSkin(settings.setSkin); // perhaps heavy handed? what condition would prevent duplicate setSkin calls
            // Would the skin you have on override your cell color?
            const match = Object.entries(cellColorList).find(([_, val]) => val[0] === settings.setSkin.slice(18, -4));
            if (match) {
                // Set color to your skin
                cellColor.style.backgroundColor = cellColorList[match[0]][1];
            } else {
                // If not, set color to gray
                //console.debug(settings.setSkin.slice(18, -4) + " was not a match.");
                cellColor.style.backgroundColor = "rgb(200,200,200)";
            }
            setSetting('setColor', 'None');
        };
        const randomColorIcon = document.createElement("i");
        randomColorIcon.classList.add("fas", "fa-random");
        randomColorButton.appendChild(randomColorIcon);
        buttonsContainer.appendChild(randomColorButton);

        for (const key in cellColorList) {
            // todo: disable owned skins

            const colorButton = document.createElement("button");
            colorButton.style.backgroundColor = cellColorList[key][1];
            //const skinName = cellColorList[key][0];
            colorButton.onclick = () => {
                console.debug("Set color to " + key);
                // Either spawned, has no skin, or isn't logged in
                if (hasSpawned || settings.setSkin === "None" || document.getElementById("login").getElementsByTagName("h5").length === 1) setSkin(key);

                // Would the skin you have on override your cell color?
                const match = Object.entries(cellColorList).find(([_, val]) => val[0] === settings.setSkin.slice(18, -4));
                if (match) {
                    // Set color to your skin
                    cellColor.style.backgroundColor = cellColorList[match[0]][1];
                } else {
                    // If not, set color to your color
                    //console.debug(settings.setSkin.slice(18, -4) + " was not a match.");
                    cellColor.style.backgroundColor = cellColorList[key][1];
                }
                setSetting('setColor', key);
            };
            buttonsContainer.appendChild(colorButton);
        }
        return buttonsContainer;
    }
    function updatePreview() { // Triggered on login
        if (document.getElementById("loginCustomLockedName")?.style.display === "block") { // Has locked
            // Locked color
            colorDiv = document.getElementById("lockedNameColorPicker");
            colorObserver.disconnect();
            colorObserver.observe(colorDiv, { attributes: true, attributeFilter: ['style'] });
            // Locked color may not be updated yet. If so, colorObserver will update it later.
            cellName.style.color = colorDiv.style.background;
            cellName.className = "locked";
            
            // Position
            const positionSelect = document.getElementById("lockedNamePositionSelect");
            if (positionSelect && !positionListenerAttached) {
                positionSelect.addEventListener("change", () => {
                    cellNameContainer.className = positionSelect.value.toLowerCase();
                });
                positionListenerAttached = true;
            }
            cellNameContainer.className = positionSelect.value.toLowerCase();

            // Hide relocated locked name settings from its dedicated menu
            document.getElementById("lockedNameColor").style.display = "none";
            document.getElementById("lockedNamePosition").style.display = "none";
            document.getElementById("lockedNamePositionSelect").style.display = "none";
            document.getElementById("loginCustomLockedName").style.height = "72px";

            // Set your skin, in case it got unset by logging out
            setSkin(settings.setSkin);
        } else { // broke boy doesn't have locked
            colorObserver.disconnect();
            if (!document.getElementById("lockedNamePositionSelect")) positionListenerAttached = false;
            cellName.style.color = "white";
            cellName.className = "default";
            cellNameContainer.className = "center";
        }

        // Re-enable shop buttons. Nitrozeus re-enabled the buttons and the purchase worked, so I assume disabling them was accidental?
        const shopButtonList = document.getElementById("shopTabBucks").querySelector("ul");
        if (shopButtonList) { // It's empty if you're logged out
            [...shopButtonList.children].forEach(li => {
                li.querySelector("button").disabled = false;
            });
        }

        // Cell color
        ownedSkins = getOwnedSkins(); // Refresh ownedSkins; you may have logged out since init
        if (ownedSkins.includes(settings.setColor[0])) {
            console.log("You own the skin respective to the color " + settings.setColor + ". Removing...");
            settings.setColor = 'None'; // To avoid async. Wish I handled settings differently
            setSetting('setColor', 'None');
        }
        
        // TODO Please break this code out into its own function. It's referenced 4 or 5 times. I have to go to bed
        // Would the skin you have on override your cell color?
        const match = Object.entries(cellColorList).find(([_, val]) => val[0] === settings.setSkin.slice(18, -4));
        if (match) { //match[0] is the key, if it finds it within the colors constant
            // Set color to your skin
            cellColor.style.backgroundColor = cellColorList[match[0]][1];
        } else if (settings.setColor !== "None") {
            // If not, set color to your color
            //console.debug(settings.setSkin.slice(18, -4) + " was not a match.");
            cellColor.style.backgroundColor = cellColorList[settings.setColor][1];
        }
        
        // Color picker
        let lockedColorPicker = document.getElementById("lockedNameColorPicker");
        const fakeColorPicker = document.getElementById("fakeColorPicker");

        if (!lockedColorPicker && !fakeColorPicker) {
            // If neither exists, you've either just logged out or this is a first pass
            // Make a fake picker that'll get replaced later when you log in
            console.debug("Creating fake color picker");
            lockedColorPicker = document.createElement("div");
            lockedColorPicker.id = "fakeColorPicker";
            lockedColorPicker.style.background = "rgb(253, 253, 253)";
        } else if (lockedColorPicker && fakeColorPicker) {
            // If both exist, that's because a real picker was created after the last preview refresh 
            // We'll remove the fake one 
            fakeColorPicker.remove();
        }
        // Moves the real picker if it exists, appends the fake picker if not
        // Does nothing if the picker is already in position
        lockedButtons.appendChild(lockedColorPicker);
        // Germs creates duplicate pickers if you've already moved one and log back in
        if (document.querySelectorAll("#lockedNameColorPicker").length > 1) {
            lockedButtons.querySelector("#lockedNameColorPicker").remove(); // The first one is the 'dead' one
        }
        
        // Preview skin
        // Do you own the skin you have in storage? If so, display it in the preview
        const isLoggedIn = (document.getElementById("customSkin").style.display === "block");
        const skinsList = document.getElementsByClassName("skinList")[0];
        console.debug(`[onclick="setSkin('${settings.setSkin.slice(10, -4)}');"]`);
        if (settings.setSkin === "None") {
            cellSkin.style.display = "none";
        } else if (
            settings.setSkin.includes("free/") || // Free skin
            (isLoggedIn && settings.setSkin.includes("https://i.imgur.com/")) || // Logged in with custom skin
            skinsList.querySelector(`[onclick="setSkin('${settings.setSkin.slice(10, -4)}');"]`) // Premium/veteran skin is owned
        )
        {
            console.debug(settings.setSkin.slice(18, -4));
            console.log("You own the skin with src " + settings.setSkin);
            cellSkin.style.display = "block";
        } else {
            console.log("You do not own the skin with src " + settings.setSkin);
            setSkin(settings.setColor);
            cellSkin.style.display = "none";
        }

        // Cell preview color buttons
        renderCustomColorsMenu(); // Since it gets referenced to create new onclick functions
        renderColorButtons();
    };
}

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
            renderThemeTabPane();
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

    const tabNames = ["General", "Controls", "Theme", "Blocklist"];

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
    renderThemeTabPane();

    return overlay;
}

function renderControlsTabPane() {
    //console.debug("Rendering");
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
    toggleInput.onchange = async function () {
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
    //console.debug(settings[key]);
    firstSelect.value = settings[key][0];
    firstSelect.onchange = function () {
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
    secondSelect.onchange = function () {
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

// Creates a scary red button
function createDangerousButton(onClick, labelText, buttonText) {
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
    button.classList.add("btn", "btn-danger");
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

function renderThemeTabPane() {
    const pane = document.getElementById("germsfox-settings-theme");
    pane.replaceChildren();

    const customThemePill = createPill("Custom Theme");
    const customThemeBackgroundColorCheckbox = createCheckbox("backgroundColorEnabled", "Background Color Enabled");
    const backgroundColorInput = customThemeBackgroundColorCheckbox.querySelector("#backgroundColorEnabled");
    const customThemeBackgroundColorPicker = createColorPicker("backgroundColor", "Background Color");
    const customThemeCellColorCheckbox = createCheckbox("cellColorEnabled", "Cell Color Enabled");
    const cellColorInput = customThemeCellColorCheckbox.querySelector("#cellColorEnabled");
    const customThemeCellColorPicker = createColorPicker("cellColor", "Cell Color");
    const customThemeFoodColorCheckbox = createCheckbox("foodColorEnabled", "Food Color Enabled");
    const foodColorInput = customThemeFoodColorCheckbox.querySelector("#foodColorEnabled");
    const customThemeFoodColorPicker = createColorPicker("foodColor", "Food Color");
    const customThemeVirusColorCheckbox = createCheckbox("virusColorEnabled", "Virus Color Enabled");
    const virusColorInput = customThemeVirusColorCheckbox.querySelector("#virusColorEnabled");
    const customThemeVirusColorPicker = createColorPicker("virusColor", "Virus Color");
    const customThemeBorderColorCheckbox = createCheckbox("borderColorEnabled", "Border Color Enabled");
    const borderColorInput = customThemeBorderColorCheckbox.querySelector("#borderColorEnabled");
    const customThemeBorderColorPicker = createColorPicker("borderColor", "Border Color");

    pane.append(
        customThemePill,
        customThemeBackgroundColorCheckbox,
        customThemeBackgroundColorPicker,
        customThemeCellColorCheckbox,
        customThemeCellColorPicker,
        customThemeFoodColorCheckbox,
        customThemeFoodColorPicker,
        customThemeVirusColorCheckbox,
        customThemeVirusColorPicker,
        customThemeBorderColorCheckbox,
        customThemeBorderColorPicker
    )

    updateThemeTabPane();

    function updateThemeTabPane() {
        if (settings.backgroundColorEnabled) {
            customThemeBackgroundColorPicker.style.display = "flex";
        } else {
            customThemeBackgroundColorPicker.style.display = "none";
        }

        if (settings.cellColorEnabled) {
            customThemeCellColorPicker.style.display = "flex";
        } else {
            customThemeCellColorPicker.style.display = "none";
        }

        if (settings.foodColorEnabled) {
            customThemeFoodColorPicker.style.display = "flex";
        } else {
            customThemeFoodColorPicker.style.display = "none";
        }

        if (settings.virusColorEnabled) {
            customThemeVirusColorPicker.style.display = "flex";
        } else {
            customThemeVirusColorPicker.style.display = "none";
        }

        if (settings.borderColorEnabled) {
            customThemeBorderColorPicker.style.display = "flex";
        } else {
            customThemeBorderColorPicker.style.display = "none";
        }
    }

    backgroundColorInput.onchange = async function () {
        await setSetting("backgroundColorEnabled", backgroundColorInput.checked);
        updateThemeTabPane();
    };

    cellColorInput.onchange = async function () {
        await setSetting("cellColorEnabled", cellColorInput.checked);
        updateThemeTabPane();
    };

    foodColorInput.onchange = async function () {
        await setSetting("foodColorEnabled", foodColorInput.checked);
        updateThemeTabPane();
    };

    virusColorInput.onchange = async function () {
        await setSetting("virusColorEnabled", virusColorInput.checked);
        updateThemeTabPane();
    };

    borderColorInput.onchange = async function () {
        await setSetting("borderColorEnabled", borderColorInput.checked);
        updateThemeTabPane();
    };

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

    const skinsPill = createPill("Custom Skins");
    const skinsExportButton = createDownloadButton("Export to File", "Export");
    const skinsImportButton = createFileInputButton(importSkinsFromFile, "Import from File", "Import");
    const skinsDeleteButton = createDangerousButton(deleteAllCustomSkins, "Delete All Skins", "Delete");
    const skinsBlockerPill = createPill("Skin Blocker");
    const skinsResetButton = createDangerousButton(resetBlockRules, "Unblock All Skins", "Reset");

    pane.append(
        generalPill,
        generalInvitesCheckbox,
        generalWarningCheckbox,

        multiboxPill,
        multiboxEnabledCheckbox,
        multiboxWindowedCheckbox,

        skinsPill,
        skinsExportButton,
        skinsImportButton,
        skinsDeleteButton,
        skinsBlockerPill,
        skinsResetButton
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
        //console.debug("Creating message");
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

function createColorPicker(key, labelText) {
    function hexToRgbFloat(hex) {
        hex = hex.startsWith("#") ? hex.slice(1) : hex;
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join("");

        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;

        return [r, g, b];
    }

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    const colorPickerRow = document.createElement("div");
    colorPickerRow.classList.add("row");
    colorPickerRow.style.marginLeft = "20px";

    const colorPickerLabelColumn = document.createElement("div");
    colorPickerLabelColumn.classList.add("col-md-6");
    colorPickerLabelColumn.style.fontSize = "20px";
    colorPickerLabelColumn.textContent = labelText;
    colorPickerLabelColumn.style.textAlign = "left";
    colorPickerLabelColumn.style.paddingLeft = "0px";
    colorPickerLabelColumn.style.paddingBottom = ".5rem";

    const colorPickerColumn = document.createElement("div");
    colorPickerColumn.classList.add("col-md-6");
    colorPickerColumn.style.fontSize = "20px";

    const colorPickerContainer = document.createElement("div");
    colorPickerContainer.style.position = "relative";
    colorPickerContainer.style.width = "100px";
    colorPickerContainer.style.height = "35px";

    const realColorPicker = document.createElement("input");
    realColorPicker.id = key;
    realColorPicker.type = "color";
    realColorPicker.style.position = "absolute";
    realColorPicker.style.top = "0";
    realColorPicker.style.left = "0";
    realColorPicker.style.width = "100%";
    realColorPicker.style.height = "100%";
    realColorPicker.style.opacity = "0";
    realColorPicker.style.cursor = "pointer";
    realColorPicker.style.border = "none";
    realColorPicker.style.padding = "0";
    realColorPicker.value = rgbToHex(settings[key][0] * 255, settings[key][1] * 255, settings[key][2] * 255).toString();

    const fakeColorPicker = document.createElement("div");
    fakeColorPicker.classList.add("colorPicker", "form-control");
    fakeColorPicker.style.width = "100%";
    fakeColorPicker.style.height = "100%";
    fakeColorPicker.style.backgroundColor = realColorPicker.value;

    realColorPicker.onchange = function () {
        fakeColorPicker.style.backgroundColor = realColorPicker.value;
        setSetting(key, hexToRgbFloat(this.value));
    };

    colorPickerContainer.append(fakeColorPicker);
    colorPickerContainer.append(realColorPicker);
    colorPickerColumn.appendChild(colorPickerContainer);
    colorPickerRow.append(colorPickerLabelColumn, colorPickerColumn);

    return colorPickerRow;
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
        //console.debug("Input clicked");
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
    const blob = new Blob([stringifiedArray], { type: 'application/json' });
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
    keyTester.id = "key" + key.charAt(0).toUpperCase() + key.slice(1);
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
    checkbox.onchange = function () {
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
                //console.debug(filePath.slice(18, -4));
            }
        }
    }
    //console.debug(`You have ${ownedSkins.length} owned skins.`);
    return ownedSkins;
}

function renderCustomColorsMenu() {
    console.debug("Rendering custom colors menu");

    const ownedSkins = getOwnedSkins();
    const skinListUl = document.getElementsByClassName("skinList")[0];

    const oldColorList = skinListUl.querySelector("#customCellColor");
    if (oldColorList) oldColorList.remove();

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

        const colorDiv = document.createElement("div");
        colorDiv.classList.add("cellColorBtn");
        colorDiv.style.backgroundColor = cellColor;

        if (ownedSkins.includes(skinName)) {
            //console.debug("Creating logout warning for " + cellColor);

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
        colorDiv.setAttribute("onclick", `setSkin('premium/${skinName}')`);

        const colorLabel = document.createElement("p");
        colorLabel.textContent = key;

        colorLi.append(colorDiv, colorLabel);
        customColorsTable.appendChild(colorLi);
    }
    customColorsContainer.append(customColorsPill, customColorsTable);
    skinListUl.append(customColorsContainer); // Pushed way down 'cause you should be using the color buttons in the preview menu now
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

    copySkinItem.addEventListener('click', async function () {
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

    blockSkinItem.addEventListener('click', function () {
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

    muteButton.addEventListener('click', function () {
        //console.debug("Mute button clicked");
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
        //console.debug("Player menu mutated");
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
    //console.debug("Rendering nickname");
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
        nickTextarea.style.fontFamily = "Ubuntu";

        nickInput.parentNode.replaceChild(nickTextarea, nickInput);
        nickInput = document.getElementById("nick"); // set to the new element
        // Prevent unintended tab switches
        nickInput.addEventListener('focus', () => {
            usingInput = true;
        });
        nickInput.addEventListener('blur', () => {
            usingInput = false;
        });
        // For cell preview
        nickInput.addEventListener("input", (e) => {
            const cellName = document.getElementById("cellName");
            if (cellName) {
                const nickname = e.target.value.trim();
                
                const rem = 2.75 - 1.375 * (nickname.length / 25);
                cellName.style.fontSize = rem.toFixed(3) + "rem";
                cellName.textContent = nickname;
                cellName.dataset.nick = nickname;
            }
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
    //console.debug("Creating elements for " + settings.customSkins.length + " skins");
    for (i = 0; i < settings.customSkins.length; i++) {
        customSkinsTable.appendChild(createSkinLi(settings.customSkins[i]));
    }

    customSkinsContainer.appendChild(customSkinsTable);

    // right click to display a delete button
    customSkinsTable.addEventListener("contextmenu", function (event) {
        //console.debug("Context menu opened");
        tryRemoveDeleteButton();

        const imgSrc = event.target.src;
        if (imgSrc?.startsWith("https://i.imgur.com/")) {
            //console.debug("Context menu opened for skin " + event.target.src);
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
        console.debug(`Creating delete button for skin ${imgSrc}`);

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
            chrome.storage.local.set({ "customSkins": settings.customSkins });
            console.log(`Deleted ${imgSrc}`);
            renderCustomSkinsMenu(); // Would rather do a parentNode.remove() but it won't work, so just re-render the whole thing
        });

        const skinsCard = document.getElementById("skinsCard");
        skinsCard.addEventListener('click', () => {
            tryRemoveDeleteButton();
        }, { once: true });

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

    chrome.storage.local.set({ "playerBlocklist": settings.playerBlocklist });
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

