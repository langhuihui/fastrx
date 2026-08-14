/**
 * Devtools page script. Creates the FastRx panel and signals the inspected
 * page to connect to the extension by setting window.__fastrxExtId.
 *
 * The library (running in the page main world) observes __fastrxExtId and opens
 * a long-lived port via chrome.runtime.connect(extId, {name:'fastrx-backend'}).
 * The background pairs that port with this panel's port.
 */

function handleShown() {
  chrome.devtools.inspectedWindow.eval(
    "window.__fastrxExtId = " + JSON.stringify(chrome.runtime.id) + ";"
  );
}

function handleHidden() {
  chrome.devtools.inspectedWindow.eval("window.__fastrxExtId = '';");
}

chrome.devtools.panels.create(
  "FastRx",
  "/icons/favicon.png",
  "/devtools/panel/dist/index.html",
  (newPanel) => {
    newPanel.onShown.addListener(handleShown);
    newPanel.onHidden.addListener(handleHidden);
  }
);
