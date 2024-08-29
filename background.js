async function updateBadge(tabId, url) {
    let count = 0;

    // Verificar cookies
    try {
        const cookies = await chrome.cookies.getAll({url: url});
        if (cookies.length > 0) count++;
    } catch (error) {
        console.error("Error checking cookies:", error);
    }

    // Asumimos que indexedDB, webSQL y otros datos están presentes
    count += 3;

    chrome.action.setBadgeText({ text: count.toString(), tabId: tabId });
    chrome.action.setBadgeBackgroundColor({ color: '#4688F1' });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        updateBadge(tabId, tab.url);
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        updateBadge(tab.id, tab.url);
    });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "clearDataContextMenu",
        title: "Borrar datos de navegación",
        contexts: ["all"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "clearDataContextMenu") {
        clearBrowsingData(tab.url, tab.id);
    }
});

function clearBrowsingData(url, tabId) {
    const currentUrl = new URL(url);

    chrome.browsingData.remove({
        "origins": [currentUrl.origin]
    }, {
        "localStorage": true,
        "cookies": true,
        "indexedDB": true,
        "webSQL": true
    }, () => {
        console.log('Datos locales borrados para ' + currentUrl.hostname);

        chrome.browsingData.remove({
            "since": 0
        }, {
            "history": true,
            "passwords": true,
            "formData": true
        }, () => {
            console.log('Datos globales borrados');
            chrome.tabs.sendMessage(tabId, {action: "showAlert", message: 'Datos de navegación borrados para ' + currentUrl.hostname});
            updateBadge(tabId, url);
        });
    });
}