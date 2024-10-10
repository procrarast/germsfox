console.info("Running popup.js");


const exportButton = document.getElementById("exportBtn");
const skinsInput = document.getElementById("skinsInput");


exportButton.addEventListener('click', exportSkins);

skinsInput.addEventListener('cancel', () => {
    console.log("Cancelled file input");
});

skinsInput.addEventListener('change', () => {
    for (const file of skinsInput.files) {
        if (file && file.type === "application/json") {
            console.log("Reading file", file.name);
            const reader = new FileReader();
            reader.onload = (event) => parseJsonToArray(event, storeSkins);
            reader.readAsText(file);
        } else {
            console.warn("Invalid file type for", file.name);
        }
    }
});

function parseJsonToArray(event, callback) {
    console.log("Parsing json");
    const data = event.target.result;
    try {
        const jsonData = JSON.parse(data);
        callback(jsonData);
    } catch (error) {
        console.error(error);
    }
}

// sends a message to the active tab with an array of skins which it must store
function storeSkins(customSkins) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "storeSkins", skins: customSkins }, response => {
            if (chrome.runtime.lastError || !response.success) {
                console.error("Failed to store skins: ", chrome.runtime.lastError);
            }
        });
    }); 
}


function exportSkins() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "exportSkins" }, response => {
            if (chrome.runtime.lastError || !response.success) {
                console.error("Failed to export skins: ", chrome.runtime.lastError);
            }
        });
    });
}
