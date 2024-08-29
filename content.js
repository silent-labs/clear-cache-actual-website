chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkLocalStorage") {
        sendResponse({hasData: localStorage.length > 0});
    }
    return true;
});