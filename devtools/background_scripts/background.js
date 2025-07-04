/**
When we receive the message, execute the given script in the given
tab.
*/
// function handleMessage(request, sender, sendResponse) {

//   if (sender.url != chrome.runtime.getURL("/devtools/panel/panel.html")) {
//     return;
//   }

//   chrome.tabs.executeScript(
//     request.tabId, 
//     {
//       code: request.script
//     });

// }

// /**
// Listen for messages from our devtools panel.
// */
// chrome.runtime.onMessage.addListener(handleMessage); 
const ports = {};

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'fastrx-event') {
    // 转发消息到 devtools
    const tabId = sender.tab.id;
    if (ports[tabId] && ports[tabId].devtools) {
      ports[tabId].devtools.postMessage(message.payload);
    }
  }
});

chrome.runtime.onConnect.addListener(port => {
  let tab;
  let name;
  if (isNumeric(port.name)) {
    tab = port.name;
    name = 'devtools';
    installProxy(+port.name);
  } else {
    tab = port.sender.tab.id;
    name = 'backend';
  }

  if (!ports[tab]) {
    ports[tab] = {
      devtools: null,
      backend: null
    };
  }
  ports[tab][name] = port;

  if (ports[tab].devtools && ports[tab].backend) {
    doublePipe(tab, ports[tab].devtools, ports[tab].backend);
  }
});

function isNumeric(str) {
  return +str + '' === str;
}

async function installProxy(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['/proxy.js']
    });
    console.log('injected proxy to tab ' + tabId);
  } catch (error) {
    console.error('Failed to inject proxy to tab ' + tabId, error);
    if (ports[tabId] && ports[tabId].devtools) {
      ports[tabId].devtools.postMessage('proxy-fail');
    }
  }
}

function doublePipe(id, one, two) {
  one.onMessage.addListener(lOne);
  function lOne(message) {
    if (message.event === 'log') {
      return console.log('tab ' + id, message.payload);
    }
    console.log('devtools -> backend', message);
    two.postMessage(message);
  }
  two.onMessage.addListener(lTwo);
  function lTwo(message) {
    if (message.event === 'log') {
      return console.log('tab ' + id, message.payload);
    }
    console.log('backend -> devtools', message);
    one.postMessage(message);
  }
  function shutdown() {
    console.log('tab ' + id + ' disconnected.');
    one.onMessage.removeListener(lOne);
    two.onMessage.removeListener(lTwo);
    one.disconnect();
    two.disconnect();
    ports[id] = null;
  }
  one.onDisconnect.addListener(shutdown);
  two.onDisconnect.addListener(shutdown);
  console.log('tab ' + id + ' connected.');
}