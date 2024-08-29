chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "clearDataContextMenu",
        title: "Borrar datos de navegación",
        contexts: ["all"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "clearDataContextMenu") {
        const currentUrl = new URL(tab.url);

        // Borrar datos que admiten filtrado por origen
        chrome.browsingData.remove({
            "origins": [currentUrl.origin]
        }, {
            "localStorage": true,
            "cookies": true,
            "indexedDB": true,
            "webSQL": true
        }, () => {
            console.log('Datos locales borrados para ' + currentUrl.hostname);

            // Borrar datos que no admiten filtrado por origen
            chrome.browsingData.remove({
                "since": 0
            }, {
                "history": true,
                "passwords": true,
                "formData": true
            }, () => {
                console.log('Datos globales borrados');
                chrome.tabs.sendMessage(tab.id, {action: "showAlert", message: 'Datos de navegación borrados para ' + currentUrl.hostname});
            });
        });
    }
});