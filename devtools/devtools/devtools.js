/**
This script is run whenever the devtools are open.
In here, we can create our panel.
*/

function handleShown() {
  chrome.devtools.inspectedWindow.eval("window.__FASTRX_DEVTOOLS__ = true")
}

function handleHidden() {
  chrome.devtools.inspectedWindow.eval("window.__FASTRX_DEVTOOLS__ = false")
}

/**
Create a panel, and add listeners for panel show/hide events.
*/
chrome.devtools.panels.create(
  "FastRx",
  "/icons/Rx_Logo_S.png",
  "/devtools/panel/dist/index.html"
  , (newPanel) => {
    newPanel.onShown.addListener(handleShown);
    newPanel.onHidden.addListener(handleHidden);
  });
