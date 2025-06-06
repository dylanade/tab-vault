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
  
  // Save tabs every 60 seconds
  setInterval(saveAllTabs, 60 * 1000); // 60 * 1000 ms = 1 min
  
  // Save when a window is closed (partial coverage of Chrome closing)
  chrome.windows.onRemoved.addListener(() => {
    saveAllTabs();
  });
  
  // On Chrome startup, offer to restore saved tabs
  chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get(['savedTabs'], (result) => {
      if (result.savedTabs && result.savedTabs.length > 0) {
        chrome.windows.create({ url: result.savedTabs.map(tab => tab.url) });
      }
    });
  });
  
  // Optional: initial save on install
  chrome.runtime.onInstalled.addListener(() => {
    saveAllTabs();
  });
  
  // Expose function to popup if needed
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveTabs") {
      saveAllTabs();
      sendResponse({ status: "done" });
    }
  });
  