(function () {
    const port = chrome.runtime.connect({
        name: 'content-script'
    })

    port.onMessage.addListener(sendMessageToBackend)
    window.addEventListener('message', sendMessageToDevtools)
    port.onDisconnect.addListener(handleDisconnect)

    sendMessageToBackend('init')

    function sendMessageToBackend(payload) {
        window.postMessage({
            source: 'fastrx-devtools-proxy',
            payload: payload
        }, '*')
    }

    function sendMessageToDevtools(e) {
        if (e.data && e.data.source === 'fastrx-devtools-backend') {
            port.postMessage(e.data.payload)
        } else if (e.data && e.data.source === 'fastrx-devtools-backend-injection') {
            if (e.data.payload === 'listening') {
                sendMessageToBackend('init')
            }
        }
    }

    function handleDisconnect() {
        window.removeEventListener('message', sendMessageToDevtools)
        sendMessageToBackend('shutdown')
    }

})()
