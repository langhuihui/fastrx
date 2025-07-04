// 测试页面的 JavaScript 代码
let eventCount = 0;
let debugInfo = [];

function addDebugInfo(message) {
  debugInfo.push(`[${new Date().toLocaleTimeString()}] ${message}`);
  if (debugInfo.length > 10) debugInfo.shift();
  document.getElementById('debugInfo').innerHTML = debugInfo.join('<br>');
}

function testConnection() {
  const status = document.getElementById('status');
  if (window.__FASTRX_DEVTOOLS__) {
    status.className = 'status success';
    status.innerHTML = '<p>✅ FastRx 扩展已连接并正常工作！</p>';
    addDebugInfo('✅ 扩展连接正常');
  } else {
    status.className = 'status error';
    status.innerHTML = '<p>❌ FastRx 扩展未连接。请确保扩展已安装并启用。</p>';
    addDebugInfo('❌ 扩展未连接');
  }
}

function testMessage() {
  addDebugInfo('发送测试消息...');
  const testMessage = {
    source: 'fastrx-devtools-backend',
    payload: {
      event: 'test',
      data: '测试消息',
      timestamp: Date.now()
    }
  };

  window.postMessage(testMessage, '*');
  addDebugInfo('测试消息已发送');
}

function simulateEvents() {
  addDebugInfo('开始模拟事件...');
  // 模拟一些 Rx 事件
  const events = [
    { type: 'subscribe', message: '订阅数据流', nodeId: 'stream1' },
    { type: 'next', message: '数据: Hello World', nodeId: 'stream1' },
    { type: 'next', message: '数据: 42', nodeId: 'stream1' },
    { type: 'next', message: '数据: { id: 1, name: "test" }', nodeId: 'stream2' },
    { type: 'complete', message: '流完成', nodeId: 'stream1' }
  ];

  events.forEach((event, index) => {
    setTimeout(() => {
      logEvent(event);
      // 发送消息到扩展
      if (window.__FASTRX_DEVTOOLS__) {
        const message = {
          source: 'fastrx-devtools-backend',
          payload: {
            event: event.type,
            data: event.message,
            nodeId: event.nodeId,
            timestamp: Date.now()
          }
        };

        window.postMessage(message, '*');
        addDebugInfo(`发送事件: ${event.type} - ${event.message}`);
      }
    }, index * 1000);
  });
}

function clearEvents() {
  document.getElementById('eventLog').innerHTML = '';
  eventCount = 0;
  debugInfo = [];
  document.getElementById('debugInfo').innerHTML = '已清除';
}

function logEvent(event) {
  const log = document.getElementById('eventLog');
  const eventDiv = document.createElement('div');
  eventDiv.style.padding = '5px';
  eventDiv.style.margin = '2px 0';
  eventDiv.style.backgroundColor = '#f8f9fa';
  eventDiv.style.borderRadius = '4px';
  eventDiv.innerHTML = `
        <strong>${++eventCount}.</strong> 
        <span style="color: #8a2be2;">[${event.type.toUpperCase()}]</span> 
        ${event.message}
        <small style="color: #666;">(${new Date().toLocaleTimeString()})</small>
    `;
  log.appendChild(eventDiv);
}

// 监听来自扩展的消息
window.addEventListener('message', function (event) {
  if (event.data && event.data.source === 'fastrx-devtools-proxy') {
    addDebugInfo(`收到代理消息: ${JSON.stringify(event.data.payload)}`);
  }
});

// 页面加载时测试连接
window.addEventListener('load', () => {
  setTimeout(testConnection, 1000);
  addDebugInfo('页面加载完成');
}); 