
/**
When we receive the message, execute the given script in the given
tab.
*/
function handleMessage(request, sender, sendResponse) {
 
  if (sender.url != chrome.runtime.getURL("/devtools/panel/panel.html")) {
    return;
  }

  chrome.tabs.executeScript(
    request.tabId, 
    {
      code: request.script
    });
  
}

/**
Listen for messages from our devtools panel.
*/
chrome.runtime.onMessage.addListener(handleMessage); 
