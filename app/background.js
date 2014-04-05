chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    switch(request.action) {

      case 'oauth2.begin':
        oauth2.begin();
        break;

      case 'oauth2.codeReceived':
        oauth2.requestToken(request.code);
        break;

      default:
        console.log('bad message');
        console.log(request);
        break;
    };
    // sendResponse();

    return true;
  });
