angular.module('jawbone.services', [])
  .service('API', ['$rootScope', function($rootScope) {
   var isAuthenticating = false,
    token = false;

   var authenticate = function(callback) {
      if(!isAuthenticating) {
        isAuthenticating = true;
        console.log('API called : authenticate');

        chrome.runtime.sendMessage({action:'getToken'}, function(token) {
          if(!token) {
            console.log('token not saved, calling oauth2');
            chrome.runtime.sendMessage({action:'oauth2.begin'}, function(response) {
              isAuthenticating = false;
              callback(response);
            });
          }
          else {
            console.log('token already saved, returning ' + token);
            callback(token)
          }
        });
      }
    };


    var loadStats = function(callback) {
      console.log('API called : loadStats');
     $.getJSON('https://jawbone.com/nudge/api/users/@me/trends',{range_duration: '7', range:'d',bucket_size:'d'}, function(data) {
        callback(data.data)
      });
    };

    var _getUserInfos = function(callback) {
      console.log('API called : getUserInfos');

      var user = localStorage['user'];
      if(!user) {
        $.getJSON('https://jawbone.com/nudge/api/users/@me/',{}, function(data) {
          localStorage['user'] = JSON.stringify(data.data);
          callback(data.data);
        });
      }
      else {
          callback(JSON.parse(user));
      }
    };

    return {
      loadStats: loadStats,
      getUserInfos: _getUserInfos,
      authenticate: authenticate
    };
  }]);
