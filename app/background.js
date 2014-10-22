chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    switch(request.action) {

      case 'oauth2.begin':
        var user;
        console.log(sender);

        console.log(chrome.identity.getRedirectURL());

        var url = 'https://jawbone.com/auth/oauth2/auth?response_type=code&client_id=QVOCChMnoV4&redirect_uri=https://ohikpieihplepggdbikfcpignafcafkd.chromiumapp.org/&scope=extended_readsleep_read';

        console.log(url);

        // chrome.tabs.create({url: url} , function(tabs) {
        //   console.log('created');
        // });

        chrome.identity.launchWebAuthFlow({
            'url': url,
            'interactive': true
          }, function(url) {
            if(chrome.runtime.lastError) {
              alert(chrome.runtime.lastError.message);
            }
            else {
              console.log(url);
               var token = url.slice(parseInt(url.indexOf("?code="), 10)+6, url.length);

               $.getJSON('https://jawbone.com/nudge/api/users/@me/', {access_token: token})
                .success( function(json) {
                  var user = json.data;
                    user.token = token;
                    sendResponse(user);
                })
                .error( function(json) {
                  alert("There has been an error.");
                  console.log(json);
                });
            }
        });

        break;

      case 'oauth2.codeReceived':
        // oauth2.requestToken(request.code);
        break;

      default:
        console.log('bad message');
        console.log(request);
        break;
    };

    return true;
  });
