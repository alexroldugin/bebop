import browser from 'webextension-polyfill';
import { getActiveTabId } from '../popup_window';

export function getActiveTab() {
  const options = { currentWindow: true, active: true };
  return browser.tabs.query(options).then((tabs) => {
    if (tabs.length > 0) {
      return tabs[0];
    }
    return null;
  });
}

export function getActiveContentTab() {
  const activeTabId = getActiveTabId();
  if (activeTabId) {
    return browser.tabs.get(activeTabId);
  }
  return getActiveTab();
}

export function sendMessageToActiveContentTab(msg) {
  return getActiveContentTab().then((t) => {
    if (t.url.startsWith('chrome://')
        || t.url.startsWith('about:')) {
      return Promise.resolve();
    }
    return browser.tabs.sendMessage(t.id, msg);
  });
}
