/**
 * Background service worker. Pairs each devtools panel port with the matching
 * library port (from the inspected page via externally_connectable) and pipes
 * them bidirectionally.
 *
 * - Panel connects via chrome.runtime.connect({name:'fastrx-panel:<tabId>'})
 *   (own extension; received via onConnect).
 * - Library connects via chrome.runtime.connect(extId, {name:'fastrx-backend'})
 *   from the inspected page (external; received via onConnectExternal). The
 *   tabId is read from port.sender.tab.id.
 */

const ports = {}; // tabId -> { panel, backend }

chrome.runtime.onConnect.addListener((port) => {
  const m = /^fastrx-panel:(\d+)$/.exec(port.name);
  if (m) {
    pair(m[1], 'panel', port);
  }
});

chrome.runtime.onConnectExternal.addListener((port) => {
  if (port.name === 'fastrx-backend' && port.sender && port.sender.tab != null) {
    pair(String(port.sender.tab.id), 'backend', port);
  }
});

function pair(tabId, side, port) {
  if (!ports[tabId]) ports[tabId] = { panel: null, backend: null };
  ports[tabId][side] = port;
  if (ports[tabId].panel && ports[tabId].backend) {
    doublePipe(tabId, ports[tabId].panel, ports[tabId].backend);
  }
}

function doublePipe(id, one, two) {
  function lOne(message) { two.postMessage(message); }
  function lTwo(message) { one.postMessage(message); }
  one.onMessage.addListener(lOne);
  two.onMessage.addListener(lTwo);

  function shutdown() {
    one.onMessage.removeListener(lOne);
    two.onMessage.removeListener(lTwo);
    try { one.disconnect(); } catch (_) {}
    try { two.disconnect(); } catch (_) {}
    if (ports[id]) ports[id] = { panel: null, backend: null };
  }
  one.onDisconnect.addListener(shutdown);
  two.onDisconnect.addListener(shutdown);
}
