chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message.closeTab) chrome.tabs.remove(sender.tab.id);
});
