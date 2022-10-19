const ASANA_DIALOG = document.querySelector(
  ".DesktopRedirectPage-redirectDialog"
);
const ELEMENT_HEADER = document.createElement("h1");
const ELEMENT_BUTTON = document.createElement("button");
const ELEMENT_OVERLAY = document.createElement("div");
const INITIAL_TIMEOUT_SECONDS = 6;
const ONE_SECOND_IN_MILLISECONDS = 1000;

const loadingObserver = new MutationObserver(onLoadingComplete);
const loadingIndicator = document.querySelector(
  ".DesktopRedirectPage-loadingIndicatorContainer"
);

let currentSecond = INITIAL_TIMEOUT_SECONDS;
let secondsRemainingInterval;
let tabClosingTimeout;

loadingObserver.observe(loadingIndicator, { childList: true });

function buildUI() {
  ELEMENT_BUTTON.innerText = "Cancel";
  ELEMENT_HEADER.innerHTML = `This window will close in <span id="wc-timeRemaining">${currentSecond}</span> <span id="wc-seconds">seconds</span>`;

  ELEMENT_BUTTON.className = "asana-window-closer-button";
  ELEMENT_HEADER.className = "asana-window-closer-header";
  ELEMENT_OVERLAY.className = "asana-window-closer-overlay";

  ELEMENT_OVERLAY.appendChild(ELEMENT_HEADER);
  ELEMENT_OVERLAY.appendChild(ELEMENT_BUTTON);

  ASANA_DIALOG.appendChild(ELEMENT_OVERLAY);

  ELEMENT_BUTTON.addEventListener("click", () => {
    clearTimeout(tabClosingTimeout);
    clearInterval(secondsRemainingInterval);
    ELEMENT_OVERLAY.remove();
  });
}

function onLoadingComplete([mutationRecord]) {
  const [removedNode] = mutationRecord.removedNodes;
  if (removedNode.classList.contains("DesktopRedirectPage-loadingIndicator")) {
    buildUI();

    secondsRemainingInterval = setInterval(
      startCountdown,
      ONE_SECOND_IN_MILLISECONDS
    );
    tabClosingTimeout = setTimeout(
      sendCloseTabMessage,
      INITIAL_TIMEOUT_SECONDS * 1000
    );
  }

  function sendCloseTabMessage() {
    chrome.runtime.sendMessage({ closeTab: true });
  }

  function startCountdown() {
    const timeRemainingSpan = document.getElementById("wc-timeRemaining");
    const secondsSpan = document.getElementById("wc-seconds");

    currentSecond = parseInt(timeRemainingSpan.innerText, 10);

    secondsSpan.innerText = `second${currentSecond === 2 ? "" : "s"}`;
    timeRemainingSpan.innerText = currentSecond - 1;

    if (currentSecond === 1) clearInterval(secondsRemainingInterval);
  }
}
