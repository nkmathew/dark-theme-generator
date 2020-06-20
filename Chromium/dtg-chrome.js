/**
 * Chrome utility functions
 *
 * Adapted from ...
 */

/* eslint no-var:0 */
var Chrome = Chrome || {};

/**
 * Returns a handle to the current tab in the active window
 */
Chrome.getCurrentTab = function () {
  let query = {
    active: true,
    currentWindow: true,
  };
  return new Promise((resolve) => {
    chrome.tabs.query(query, (tabs) => resolve(tabs[0]));
  });
};

/**
 * Returns tab with the specified id
 */
Chrome.getTabById = function (tabId) {
  return new Promise((resolve) => {
    if (!tabId) {
      Chrome.getCurrentTab().then(resolve);
    } else {
      chrome.tabs.get(tabId, resolve);
    }
  });
};

/**
 * Searches local storage for matching values
 *
 * Pass null to get all the items in local storage
 *
 * >>> Chrome.searchCache(null).then(x => console.log(x))
 */
Chrome.searchCache = function (query) {
  return new Promise((resolve) => {
    chrome.storage.local.get(query, resolve);
  });
};

/**
 * Clears local storage
 */
Chrome.clearCache = function () {
  return new Promise((resolve) => {
    chrome.storage.local.clear(resolve);
  });
};

/**
 * Store item in local storage
 */
Chrome.cacheItem = function (data) {
  return new Promise((resolve) => {
    chrome.storage.local.set(data, resolve);
  });
};

/**
 * Save the extension's options
 */
Chrome.saveOptions = function (data) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(data, resolve);
  });
};

/**
 * Reads the extension's options
 */
Chrome.getOptions = function (query) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(query, resolve);
  });
};

/**
 * Sends a message to the content script
 */
Chrome.sendMessage = function (tabId, msgObject) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, msgObject, resolve);
  });
};

/**
 * Sets the badge colour. Pass null to the set the colour of the current tab
 *
 * > Chrome.setBadgeColor(null, 'red');
 * > Chrome.setBadgeColor(437, 'red');
 *
 */
Chrome.setBadgeColor = function (tabId, color) {
  if (tabId > 0) {
    let badgeColor = { tabId: tabId, color: color };
    chrome.browserAction.setBadgeBackgroundColor(badgeColor);
  } else {
    Chrome.getCurrentTab().then((tab) => {
      if (tab) {
        let badgeColor = { tabId: tab.id, color: color };
        chrome.browserAction.setBadgeBackgroundColor(badgeColor);
      }
    });
  }
};

/**
 * Sets the badge text. Pass null to the set the badge text of the current tab
 *
 * > Chrome.setBadgeText(null, '666');
 * > Chrome.setBadgeText(437, '666');
 *
 */
Chrome.setBadgeText = function (tabId, text) {
  text = text.toString();
  if (tabId > 0) {
    let badgeText = { tabId: tabId, text: text };
    chrome.browserAction.setBadgeText(badgeText);
  } else {
    Chrome.getCurrentTab().then((tab) => {
      if (tab) {
        let badgeText = { tabId: tab.id, text: text };
        chrome.browserAction.setBadgeText(badgeText);
      }
    });
  }
};

/**
 * Returns tab specific badge text
 */
Chrome.getBadgeText = function (tabId) {
  if (tabId > 0) {
    return new Promise((resolve) => {
      chrome.browserAction.getBadgeText({ tabId: tabId }, resolve);
    });
  }
  Chrome.getCurrentTab().then((tab) => {
    if (tab) {
      return new Promise((resolve) => {
        chrome.browserAction.getBadgeText({ tabId: tab.id }, resolve);
      });
    }
  });
};

/**
 * Returns all the tabs
 */
Chrome.getAllTabs = function () {
  return new Promise((resolve) => {
    chrome.tabs.query({}, resolve);
  });
};

/**
 * Clears all notifications
 */
Chrome.clearNotifications = function () {
  chrome.notifications.getAll((ids) => {
    for (let id in ids) {
      chrome.notifications.clear(id);
    }
  });
};
