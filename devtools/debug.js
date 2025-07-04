// 调试脚本 - 用于排查消息传递问题
console.log('FastRx Debug Script Loaded');

// 监听所有消息
window.addEventListener('message', function (event) {
  console.log('Window message received:', event.data);
});

// 检查扩展连接状态
function checkExtensionStatus() {
  console.log('Extension status:', {
    __FASTRX_DEVTOOLS__: window.__FASTRX_DEVTOOLS__,
    chrome: typeof chrome !== 'undefined',
    chromeRuntime: typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined'
  });
}

// 发送测试消息
function sendTestMessage() {
  const testMessage = {
    source: 'fastrx-devtools-backend',
    payload: {
      event: 'test',
      data: 'Debug test message',
      timestamp: Date.now()
    }
  };

  console.log('Sending test message:', testMessage);
  window.postMessage(testMessage, '*');
}

// 自动检查
setTimeout(checkExtensionStatus, 1000);
setTimeout(sendTestMessage, 2000);

// 暴露到全局
window.fastrxDebug = {
  checkStatus: checkExtensionStatus,
  sendTest: sendTestMessage
}; 