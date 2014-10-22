angular.module('jawbone.services', [])
  .service('API', ['$rootScope', function($rootScope) {
   var isAuthenticating = false;
   var authenticate = function(callback) {
      if(!isAuthenticating) {
        isAuthenticating = true;
        chrome.runtime.sendMessage({action:'oauth2.begin'}, function(response) {
          callback(response);
          isAuthenticating = false;
        });
      }
    };
    var loadStats = function(callback) {
     $.getJSON('https://jawbone.com/nudge/api/users/@me/trends',{range_duration: '7', range:'d',bucket_size:'d'}, function(data) {
        callback(data.data)
      });
    }

    return {
      loadStats: loadStats,
      authenticate: authenticate
    };
  }]);
