/* 
 * Handles skins.json downloads, multibox tab/window state, and blocking rules 
 * Ideally, it would handle settings state, but I wasn't smart enough to consider this when I wrote it!
 */

console.log("Running background.js");

const DEFAULT_CONTROLS = {
    multibox: ["Tab", "Tab"],
    toggleNames: ["KeyN", "N"],
    toggleSkins: ["KeyB", "B"],
    toggleMass: ["KeyM", "M"],
    toggleFood: ["", ""]
};

const DEFAULT_SETTINGS = {
    controls: DEFAULT_CONTROLS,
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

settings = structuredClone(DEFAULT_SETTINGS);

const handlers = {
    switchTabs,
    switchWindows,
    updateSettings,
    clearBlockRules,
    addBlockRule: ({ url }) => url && addBlockRule(url)
};

chrome.runtime.onMessage.addListener((request, sender) => {
    console.debug(request.action);
    const handler = handlers[request.action];
    if (!handler) return;
    handler(request, sender);
});

// Useful when multiboxing to prevent per-tab settings desync
async function updateSettings() {
    const tabs = await chrome.tabs.query({
        url: "https://germs.io/*"
    });

    for (const tab of tabs) {
        console.debug(`Sending getSettings message to tab ${tab.id}`);
        chrome.tabs.sendMessage(tab.id, { action: "getSettings" });
    }

}

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "loading") {
        chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS)).then((storedSettings) => {
            for (item in DEFAULT_SETTINGS) {
                if (storedSettings[item]) {
                    DEFAULT_SETTINGS[item] = storedSettings[item];
                } else {
                    DEFAULT_SETTINGS[item] = settings[item];
                }
            }

            chrome.scripting.executeScript({
                target: { tabId }, world: "MAIN",
                func: inject,
                args: [DEFAULT_SETTINGS]
            });
        });
    };
});

function inject(settings) {
    if (!WebGL2RenderingContext.prototype?.shaderSource) return;

    const original = WebGL2RenderingContext.prototype.shaderSource;
    const originalClear = WebGL2RenderingContext.prototype.clear;
    const originalClearColor = WebGL2RenderingContext.prototype.clearColor;

    const backgroundColorEnabled = settings.backgroundColorEnabled;
    const cellColorEnabled = settings.cellColorEnabled;
    const foodColorEnabled = settings.foodColorEnabled;
    const virusColorEnabled = settings.virusColorEnabled;
    const borderColorEnabled = settings.borderColorEnabled;

    const backgroundColor = settings.backgroundColor;
    const cellColor = settings.cellColor;
    const foodColor = settings.foodColor;
    const virusColor = settings.virusColor;
    const borderColor = settings.borderColor;

    if (backgroundColorEnabled) {
        WebGL2RenderingContext.prototype.clear = function (mask) {
            // we pass ...[ ...backgroundColor, 1 ] instead of just ...backgroundColor because GLSL expects an alpha argument as well
            originalClearColor.call(this, ...[...backgroundColor, 1]);
            return originalClear.call(this, mask);
        };
    }

    // override WebGL2's shader source with "our own"
    WebGL2RenderingContext.prototype.shaderSource = function (shader, source) {
        // only check for shader sources that include vColor
        if (typeof source === "string" && source.includes("vColor")) {
            source = source.replace(
                /gl_FragColor\s*=\s*color\s*\*\s*vColor\s*;/g,
                `
                // pass over our settings to GLSL
                bool cellColorEnabled = ${cellColorEnabled};
                vec4 cellColor = vec4(${cellColor[0]}, ${cellColor[1]}, ${cellColor[2]}, 1.0);
                bool foodColorEnabled = ${foodColorEnabled};
                vec4 foodColor = vec4(${foodColor[0]}, ${foodColor[1]}, ${foodColor[2]}, 1.0);
                bool virusColorEnabled = ${virusColorEnabled};
                vec4 virusColor = vec4(${virusColor[0]}, ${virusColor[1]}, ${virusColor[2]}, 1.0);
                bool borderColorEnabled = ${borderColorEnabled};
                vec4 borderColor = vec4(${borderColor[0]}, ${borderColor[1]}, ${borderColor[2]}, 1.0);

                // ignore pure white as to not recolor things such as names and mass
                if (vColor == vec4(1.0, 1.0, 1.0, 1.0)) {
                    gl_FragColor = color * vColor;
                } else {
                    // texture coordinates are referenced from https://germs.io/res/assets/texture.png?v=5 (512x1024)
                    // 0x - 512x & 0y - 512y -> cell texture
                    if (vTextureCoord.x >= 0.0 && vTextureCoord.x <= 1.0 && vTextureCoord.y >= 0.0 && vTextureCoord.y < 0.5) {
                        if (cellColorEnabled) {
                            gl_FragColor = color * cellColor;
                        } else {
                            gl_FragColor = color * vColor;
                        }
                    }

                    // 0x - 512x (technically less but irrelevant) & 768y - 1024y -> food textures
                    if (vTextureCoord.x >= 0.0 && vTextureCoord.x <= 1.0 && vTextureCoord.y >= 0.75 && vTextureCoord.y <= 1.0) {
                        if (foodColorEnabled) {
                            gl_FragColor = color * foodColor;
                        }  else {
                            gl_FragColor = color * vColor;
                        }
                    }

                    // 0x - 512x & 512y - 768y -> virus texture
                    if (vTextureCoord.x >= 0.0 && vTextureCoord.x <= 1.0 && vTextureCoord.y >= 0.5 && vTextureCoord.y <= 0.75) {
                        if (virusColorEnabled) {
                            gl_FragColor = color * virusColor;
                        } else {
                            gl_FragColor = color * vColor;   
                        }
                    }

                    // "out of bounds" (for lack of a better explanation) (maybe a better condition exists?) -> border "texture"
                    if (vTextureCoord.x < 0.0 || vTextureCoord.y < 0.0 || vTextureCoord.x > 1.0 || vTextureCoord.y > 1.0) {
                        if (borderColorEnabled) {
                            gl_FragColor = color * borderColor;
                        } else {
                            gl_FragColor = color * vColor;    
                        }
                    }
                }
                `
            );
        }
        return original.call(this, shader, source);
    };

    console.log("Injecting into tab");
}

async function getTabsState() {
    const tabs = await chrome.tabs.query({
        currentWindow: true,
        url: "https://germs.io/*"
    });

    const ids = tabs.map(t => t.id);
    const active = tabs.find(t => t.active);

    return {
        ids,
        activeIndex: active ? ids.indexOf(active.id) : -1
    };
}

async function getWindowsState() {
    const windows = await chrome.windows.getAll({ populate: true });

    const germsWindows = windows.filter(win =>
        win.tabs.some(tab => tab.url?.includes("https://germs.io"))
    );

    const ids = germsWindows.map(w => w.id);

    const activeWindow = germsWindows.find(win =>
        win.focused &&
        win.tabs.some(tab => tab.active && tab.url?.includes("https://germs.io"))
    );

    return { ids, activeIndex: activeWindow ? ids.indexOf(activeWindow.id) : -1 };
}

async function switchTabs() {
    console.log("Switching tabs");

    const { ids, activeIndex } = await getTabsState();

    switch (ids.length) {
        case 2:
            chrome.tabs.update(ids[1 - activeIndex], { active: true });
            break;

        case 1: {
            const tab = await chrome.tabs.get(ids[0]);
            chrome.tabs.create({ url: tab.url });
            break;
        }

        case 0:
            console.warn("No active germs tab found.");
            break;

        default:
            console.warn("3+ tabs not supported.");
    }
}

async function switchWindows() {
    console.log("Switching windows");

    const { ids, activeIndex } = await getWindowsState();

    switch (ids.length) {
        case 2:
            chrome.windows.update(ids[1 - activeIndex], { focused: true });
            break;

        case 1: {
            const windowObj = await chrome.windows.get(ids[0], { populate: true });
            duplicateGermsWindow(windowObj);
            break;
        }

        case 0:
            console.warn("No active germs window found.");
            break;

        default:
            console.warn("3+ windows not supported.");
    }
}

function duplicateGermsWindow(windowObj) {
    const germsTab = windowObj.tabs.find(tab =>
        tab.url?.includes("https://germs.io")
    );

    if (!germsTab) {
        console.warn("No germs.io tab found in window.");
        return;
    }

    chrome.windows.create({ url: germsTab.url });
}

async function clearBlockRules() {
    console.debug("Received message");
    try {
        const rules = await chrome.declarativeNetRequest.getDynamicRules();

        const ids = rules.map(rule => rule.id);

        if (ids.length === 0) {
            console.log("No dynamic rules to remove.");
            return;
        }

        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: ids
        });

        console.log("Removed rule IDs:", ids);

    } catch (error) {
        console.error("Could not clear dynamic rules:", error);
    }
}

function addBlockRule(url) {
    console.debug("Adding blocking rule for skin " + url);
    const ruleId = Math.round(Math.random() * 2.147e9);

    const rule = {
        id: ruleId,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: url, resourceTypes: ["image", "main_frame"] }
    };

    chrome.declarativeNetRequest.updateDynamicRules(
        { addRules: [rule], removeRuleIds: [] },
        () => {
            if (chrome.runtime.lastError) {
                console.error(`Error adding rule: ${chrome.runtime.lastError.message}`);
            } else {
                console.log(`Added blocking rule for ${url} with ID ${ruleId})`);
            }
        }
    );
}

