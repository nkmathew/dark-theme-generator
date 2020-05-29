chrome.browserAction.onClicked.addListener(function (tab) {
  Chrome.getCurrentTab().then((currTab) => {
    chrome.tabs.sendMessage(currTab.id, { action: 'go-dark' });
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
