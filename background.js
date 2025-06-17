// Save all open tabs
function saveAllTabs() {
    chrome.windows.getAll({ populate: true }, (windows) => {
      const allTabs = windows.flatMap(win => win.tabs.map(tab => ({
        url: tab.url,
        pinned: tab.pinned
      })));
  
      chrome.storage.local.set({ savedTabs: allTabs }, () => {
        console.log("Tabs saved at", new Date().toLocaleTimeString());
      });
    });
  }
  
  // On Chrome startup, offer to restore saved tabs
  chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get(['savedTabs'], (result) => {
      if (result.savedTabs && result.savedTabs.length > 0) {
        chrome.windows.create({ url: result.savedTabs.map(tab => tab.url) });
      }
    });
  });
  
  // Expose function to popup if needed
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveTabs") {
      saveAllTabs();
      sendResponse({ status: "done" });
    }
  });
  