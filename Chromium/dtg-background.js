chrome.browserAction.onClicked.addListener(function (tab) {
  Chrome.getCurrentTab().then((currTab) => {
    if (currTab.url.includes('youtube.com/')) {
      chrome.tabs.sendMessage(currTab.id, { action: 'brightness(0.8)' });
      return;
    }
    chrome.tabs.sendMessage(currTab.id, { action: 'go-dark' }, (response) => {
      if (chrome.runtime.lastError && !response) {
        chrome.tabs.executeScript(currTab.id, {
          code: 'location.reload();',
        });
      }
    });
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('Message:', request);
});

chrome.contextMenus.create({
  id: 'btn-generateTheme',
  title: 'Generate Theme',
  contexts: ['browser_action'],
  onclick: function () {
    Chrome.getCurrentTab().then((currTab) => {
      chrome.tabs.sendMessage(currTab.id, { action: 'generate-theme' });
    });
  },
});

let menuBrightness = chrome.contextMenus.create({
  title: 'Brightness',
  contexts: ['browser_action'],
});

chrome.contextMenus.create({
  id: 'btn-bright50',
  title: '50%',
  contexts: ['browser_action'],
  parentId: menuBrightness,
  onclick: function () {
    Chrome.getCurrentTab().then((currTab) => {
      chrome.tabs.sendMessage(currTab.id, { action: 'brightness(0.5)' });
    });
  },
});

chrome.contextMenus.create({
  id: 'btn-bright70',
  title: '70%',
  contexts: ['browser_action'],
  parentId: menuBrightness,
  onclick: function () {
    Chrome.getCurrentTab().then((currTab) => {
      chrome.tabs.sendMessage(currTab.id, { action: 'brightness(0.7)' });
    });
  },
});

chrome.contextMenus.create({
  id: 'btn-bright80',
  title: '80%',
  contexts: ['browser_action'],
  parentId: menuBrightness,
  onclick: function () {
    Chrome.getCurrentTab().then((currTab) => {
      chrome.tabs.sendMessage(currTab.id, { action: 'brightness(0.8)' });
    });
  },
});

chrome.contextMenus.create({
  id: 'btn-zapper',
  title: '→ Start Zapper',
  contexts: ['all'],
  onclick: function () {
    Chrome.getCurrentTab().then((currTab) => {
      chrome.tabs.sendMessage(currTab.id, { action: 'start-zapper' });
    });
  },
});
