document.getElementById('save').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "saveTabs" }, (response) => {
      alert("Tabs saved!");
    });
  });
  
  document.getElementById('restore').addEventListener('click', () => {
    chrome.storage.local.get(['savedTabs'], (result) => {
      if (result.savedTabs && result.savedTabs.length > 0) {
        chrome.windows.create({ url: result.savedTabs.map(tab => tab.url) });
      }
    });
  });
  