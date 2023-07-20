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
  const { ignoreQuery, ignoreFragment } = await new Promise(resolve => chrome.storage.sync.get(['ignoreQuery', 'ignoreFragment'], resolve));

  const tabs = await chrome.tabs.query({});
  const urls = new Map();
  let tabsClosed = 0;

  for (const tab of tabs) {
    let tabUrl = tab.url;

    if (ignoreQuery) {
      tabUrl = tabUrl.split('?')[0];
    }

    if (ignoreFragment) {
      tabUrl = tabUrl.split('#')[0];
    }

    if (urls.has(tabUrl)) {
      await chrome.tabs.remove(tab.id);
      tabsClosed++;
    } else {
      urls.set(tabUrl, tab.id);
    }
  }

  return tabsClosed;
}
