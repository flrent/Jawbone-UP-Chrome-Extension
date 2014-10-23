chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    switch(request.action) {
      case 'getToken':
         var token = localStorage['token'];
         if(token) return sendResponse(token);
         else return sendResponse(false);
         break;

      case 'oauth2.begin':
        var user;
        console.log(sender);

        console.log(chrome.identity.getRedirectURL());

        var url = 'https://jawbone.com/auth/oauth2/auth?client_id=QVOCChMnoV4&response_type=code&scope=extended_readsleep_read&redirect_uri='+chrome.identity.getRedirectURL();

        chrome.identity.launchWebAuthFlow({
            'url': url,
            'interactive': true
        },
        function(redirectUri) {
            if (chrome.runtime.lastError || !redirectUri) {
                console.log("Error : " + chrome.runtime.lastError.message);
                return;
            }
            var code = redirectUri.slice(parseInt(redirectUri.indexOf("?code="), 10)+6, redirectUri.length);

            $.get('https://jawbone.com/auth/oauth2/token', {
              client_id: 'QVOCChMnoV4',
              client_secret: secret,
              grant_type: 'authorization_code',
              code: code
            })
            .done(function(data) {
              console.log('data received');
              console.log(data);

              if(data) {
                localStorage['token'] = data.access_token;
                localStorage['refreshToken'] = data.refresh_token;

                sendResponse(data.access_token);
              }

            });
          });
        break;

      default:
        console.log('bad message');
        console.log(request);
        break;
    };

    return true;
  });
