function clearBrowsingData(currentUrl) {
    // Borrar datos que admiten filtrado por origen
    chrome.browsingData.remove({
        "origins": [currentUrl.origin]
    }, {
        "localStorage": true,
        "cookies": true,
        "indexedDB": true,
        "webSQL": true
    }, function() {
        console.log('Datos locales borrados para ' + currentUrl.hostname);

        // Borrar datos que no admiten filtrado por origen
        chrome.browsingData.remove({
            "since": 0
        }, {
            "history": true,
            "passwords": true,
            "formData": true
        }, function() {
            console.log('Datos globales borrados');
            alert('Datos de navegación borrados para ' + currentUrl.hostname);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const clearDataButton = document.getElementById('clearCache');

    clearDataButton.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0];
            chrome.runtime.getBackgroundPage((backgroundPage) => {
                backgroundPage.clearBrowsingData(currentTab.url, currentTab.id);
            });
        });
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showAlert") {
        alert(request.message);
    } else if (request.action === "checkLocalStorage") {
        sendResponse({hasData: localStorage.length > 0});
    }
    return true;
});