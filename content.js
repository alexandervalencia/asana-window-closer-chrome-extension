const loadingObserver = new MutationObserver(onLoadingComplete);
const loadingIndicator = document.querySelector(
  ".DesktopRedirectPage-loadingIndicatorContainer"
);

loadingObserver.observe(loadingIndicator, { childList: true });

function onLoadingComplete([mutationRecord]) {
  const [removedNode] = mutationRecord.removedNodes;
  if (removedNode.classList.contains("DesktopRedirectPage-loadingIndicator")) {
    setTimeout(() => chrome.runtime.sendMessage({}), 6000);
  }
}
