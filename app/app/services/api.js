angular.module('jawbone', [])
  .service('API', ['$rootScope', function($rootScope) {
  
   var authenticate = function(callback) {
      chrome.runtime.sendMessage({action:'oauth2.begin'}, function(response) {
        callback(response);
      });
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
