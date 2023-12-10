// Load settings when the popup is opened
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['switcherEnabled', 'switcherKeycode', 'switcherWindowed'], function(items) {
        document.getElementById('enabledCheckbox').checked = items.switcherEnabled;
        document.getElementById('windowedCheckbox').checked = items.switcherWindowed;
        document.getElementById('keycodeTester').value = items.switcherKeycode || '';
    });
   
    let saveButton = document.getElementById("saveButton");
    saveButton.addEventListener('click', saveSettings);
});

function saveSettings() {
    const switcherEnabled = document.getElementById('enabledCheckbox').checked;
    const switcherWindowed = document.getElementById('windowedCheckbox').checked;
    const switcherKeycode = document.getElementById('keyTester').value;
    
    chrome.storage.local.set({ "switcherEnabled": switcherEnabled, "switcherKeycode": switcherKeycode, "switcherWindowed": switcherWindowed }, function() {
        console.log('Settings saved');
        updateSettings();
    })
}

/* Send the updateKeycode message to each germs tab in current window */
function updateSettings() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs.length > 0 && tabs[0].id != null) {
            console.log("Sending updateSettings message");
            chrome.tabs.sendMessage(tabs[0].id, { action: "updateSettings" });
        } else {
            console.log("No active tab found or tab ID is undefined.");
        }
    });
}