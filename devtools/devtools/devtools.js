/**
This script is run whenever the devtools are open.
In here, we can create our panel.
*/

function handleShown() {
  console.log("panel is being shown");
}

function handleHidden() {
  console.log("panel is being hidden");
}

/**
Create a panel, and add listeners for panel show/hide events.
*/
chrome.devtools.panels.create(
  "FastRx",
  "/icons/Rx_Logo_S.png",
  "/devtools/panel/panel.html"
  , (newPanel) => {
    newPanel.onShown.addListener(handleShown);
    newPanel.onHidden.addListener(handleHidden);
  });
