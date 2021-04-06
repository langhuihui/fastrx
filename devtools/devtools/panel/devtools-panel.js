/**
Handle errors from the injected script.
Errors may come from evaluating the JavaScript itself
or from the devtools framework.
See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/devtools.inspectedWindow/eval#Return_value
*/
// var port = chrome.runtime.connect({ name: 'test-connect' });
var port = chrome.tabs.connect(chrome.devtools.inspectedWindow.tabId, { name: 'test-connect' });
port.postMessage({ question: '你是谁啊？' });
port.onMessage.addListener(function (msg) {
  alert('收到消息：' + msg.answer);
  if (msg.answer && msg.answer.startsWith('我是')) {
    port.postMessage({ question: '哦，原来是你啊！' });
  }
});