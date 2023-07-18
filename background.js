let totalTabsRemoved = 0;

chrome.storage.sync.get('totalTabsRemoved', function (data) {
  totalTabsRemoved = data.totalTabsRemoved || 0;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg === "cleanup") {
    cleanupTabs().then(numTabsClosed => {
      totalTabsRemoved += numTabsClosed;
      chrome.storage.sync.set({ totalTabsRemoved: totalTabsRemoved });

      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Tab Deduplicator",
        message: `Removed ${numTabsClosed} duplicate tab(s)! Total tabs removed since installation: ${totalTabsRemoved}`
      });

      sendResponse({ totalTabsRemoved: totalTabsRemoved, numTabsClosed: numTabsClosed });
    });
    return true;
  }
});

async function cleanupTabs() {
  const tabs = await chrome.tabs.query({});
  const urls = new Map();
  let tabsClosed = 0;

  for (const tab of tabs) {
    if (urls.has(tab.url)) {
      await chrome.tabs.remove(tab.id);
      tabsClosed++;
    } else {
      urls.set(tab.url, tab.id);
    }
  }

  return tabsClosed;
}
