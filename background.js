chrome.runtime.onMessage.addListener(function (_message, sender) {
  if (message.closeTab) chrome.tabs.remove(sender.tab.id);
});
