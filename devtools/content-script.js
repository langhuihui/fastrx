if (document instanceof HTMLDocument) {
  // 直接设置全局变量，避免使用 eval
  window.__FASTRX_DEVTOOLS__ = true;
}

// 监听来自页面的消息
window.addEventListener('message', function (event) {
  // 只处理来自页面的消息，不是来自扩展的消息
  if (event.source !== window) return;

  // 检查是否是 FastRx 相关的消息
  if (event.data && event.data.source === 'fastrx-devtools-backend') {
    // 转发消息到 background script
    chrome.runtime.sendMessage({
      type: 'fastrx-event',
      payload: event.data.payload
    }).catch(error => {
      console.error('Failed to send message to background script:', error);
    });
  }
});

// 监听来自 background script 的消息
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'fastrx-proxy') {
    // 转发消息到页面
    window.postMessage({
      source: 'fastrx-devtools-proxy',
      payload: message.payload
    }, '*');
  }
});
