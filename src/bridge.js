/*
 * Talks to bundle.js (which runs in the page's MAIN world, injected as a real <script> tag)
 * over window.postMessage. Content scripts execute in an isolated JS world and can't read
 * `instance`/`game` state or call its methods directly — this is the replacement for
 * scraping rendered DOM (e.g. regexing debugText's innerHTML for "Mass:") or simulating
 * clicks/change events on native controls just to trigger the logic they're wired to.
 *
 * See the matching listener/GERMSFOX_BRIDGE_CALLABLE block in overrides/bundle.js.
 */

console.debug("Running bridge.js");

let germsfoxRequestId = 0;
const germsfoxPendingStateRequests = new Map();

window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    const data = event.data;
    if (!data || data.__germsfox !== true) return;

    if (data.type === 'state') {
        const resolve = germsfoxPendingStateRequests.get(data.requestId);
        if (resolve) {
            germsfoxPendingStateRequests.delete(data.requestId);
            resolve(data.state);
        }
    } else if (data.type === 'death') {
        // Unsolicited push from bundle.js's Game.onDeath() (only sent when logged in) - relayed
        // to background.js since submitting to pishi.dev needs host_permissions/network access
        // a content script doesn't have, and background.js is where the opt-out setting and
        // per-install client ID live.
        chrome.runtime.sendMessage({
            action: 'submitScore',
            mode: data.mode,
            mass: data.mass,
            name: data.name,
        });
    } else if (data.type === 'modeChange') {
        // Unsolicited push from bundle.js's Network.connect(). Re-dispatched as a plain DOM
        // event (rather than every interested script adding its own 'message' listener) so
        // bridge.js stays the single postMessage listener other isolated-world code reacts to.
        document.dispatchEvent(new CustomEvent('germsfox:modeChange', { detail: { mode: data.mode } }));
    }
});

// Calls one of bundle.js's own functions directly (e.g. setSkin, changeSetting) instead of
// simulating a click/change event on a DOM control that happens to trigger it.
function germsfoxCall(fn, ...args) {
    window.postMessage({ __germsfox: true, type: 'call', fn, args }, '*');
}

// Requests a snapshot of live game state (alive/mass/settings/owned skins/login/etc.)
// directly from bundle.js instead of scraping it out of rendered DOM.
// Resolves to null if bundle.js doesn't respond in time (e.g. not loaded yet).
function germsfoxGetState(timeoutMs = 500) {
    const requestId = ++germsfoxRequestId;
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            germsfoxPendingStateRequests.delete(requestId);
            resolve(null);
        }, timeoutMs);

        germsfoxPendingStateRequests.set(requestId, (state) => {
            clearTimeout(timeout);
            resolve(state);
        });

        window.postMessage({ __germsfox: true, type: 'getState', requestId }, '*');
    });
}
