/**
Handle errors from the injected script.
Errors may come from evaluating the JavaScript itself
or from the devtools framework.
See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/devtools.inspectedWindow/eval#Return_value
*/
import { initDevTools } from '@front'
import Bridge from '../../bridge'

initDevTools({

  /**
   * Inject backend, connect to background, and send back the bridge.
   *
   * @param {Function} cb
   */

  connect (cb) {
    // 1. inject backend code into page
    injectScript(chrome.runtime.getURL('build/backend.js'), () => {
      // 2. connect to background to setup proxy
      const port = chrome.runtime.connect({
        name: '' + chrome.devtools.inspectedWindow.tabId
      })
      let disconnected = false
      port.onDisconnect.addListener(() => {
        disconnected = true
      })

      const bridge = new Bridge({
        listen (fn) {
          port.onMessage.addListener(fn)
        },
        send (data) {
          if (!disconnected) {
            // if (process.env.NODE_ENV !== 'production') {
            //   console.log('[chrome] devtools -> backend', data)
            // }
            port.postMessage(data)
          }
        }
      })
      // 3. send a proxy API to the panel
      cb(bridge)
    })
  },

  /**
   * Register a function to reload the devtools app.
   *
   * @param {Function} reloadFn
   */

  onReload (reloadFn) {
    chrome.devtools.network.onNavigated.addListener(reloadFn)
  }
})