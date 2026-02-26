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

async function parseJsonToArray(event, callback) {
    console.log("Parsing json");
    const data = event.target.result;
    try {
        const jsonData = JSON.parse(data);
        callback(jsonData);
    } catch (error) {
        console.error(error);
    }
}

// storeSkins and exportSkins actions gets sent to storage.js (content_script)
function storeSkins(customSkins) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "storeSkins", skins: customSkins }, () => {
            if (chrome.runtime.lastError) {
                console.error("Failed to store skins: ", chrome.runtime.lastError);
            }
        });
    }); 
}


function exportSkins() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "exportSkins" });
        if (chrome.runtime.lastError) {
            console.error("Failed to export skins: ", chrome.runtime.lastError);
        }
    });
}
