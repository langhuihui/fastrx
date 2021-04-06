window.addEventListener("message", function (e) {
    console.log("abc")
    console.log(e.data);
}, false);
chrome.runtime.onConnect.addListener(function (port) {
    console.log(port);
    if (port.name == 'test-connect') {
        port.onMessage.addListener(function (msg) {
            console.log('收到长连接消息：', msg);
            if (msg.question == '你是谁啊？') port.postMessage({ answer: '我是你爸！' });
        });
    }
});