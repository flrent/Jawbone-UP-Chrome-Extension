chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    switch(request.action) {

      case 'oauth2.begin':
        var user;
        console.log(sender);
        chrome.storage.local.get('user', function(value) {
        if(value.user === undefined || value.user.token === undefined) {
            chrome.identity.launchWebAuthFlow({
              'url': 'https://jawbone.com/auth/oauth2/auth?response_type=code&client_id=WtzakOFOnN4&redirect_uri='+chrome.identity.getRedirectURL()+'&scope=extended_readsleep_read',
              'interactive': true
            }, function(url) { 
               var token = url.slice(parseInt(url.indexOf("?code="), 10)+6, url.length);
               
               $.getJSON('https://jawbone.com/nudge/api/users/@me/', {access_token: token})
                .success( function(json) {
                  var user = json.data;
                    user.token = token;

                  chrome.storage.local.set({'user': json.data}, function() {
                    chrome.storage.local.get('user', function(value) {
                      console.log(value);
                    });
                    sendResponse(user);
                  });
                })
                .error( function(json) {
                  alert("There has been an error.");
                  console.log(json);
                });
            });
          }
          else {
            user = value.user;
            sendResponse(user);
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
