var API = (function () {

  var _API = function(options) {
    this.rootUrl = 'https://jawbone.com/nudge/api/users/@me/';
    this.oauth2 = {};
  };

  _API.prototype = (function() {
    var user = {};

    var _setUser = function(userData) {

    };
// , {access_token: this.oauth2.access_token}
    var _callApi = function(route, params, callback) {
      $.getJSON(this.rootUrl+route, params)
        .success( function(json) {
          callback(json.data);
        })
        .error( function(json) {
          callback(json);
        });
    };

    var _checkIfAuthorized = function(callback) {
      var api = this;

      chrome.storage.sync.get('oauth2', function(data) {
        if(!data) {
          _authorize();
          return;
        }
        else if(data && 'oauth2' in data) {
            api.oauth2 = data.oauth2;
            $.getJSON(api.rootUrl, {access_token: api.oauth2.access_token})
              .success( function(json) {
                user = json.data;
                callback(user);
              })
              .error( function(json) {
                _authorize();
              });
        }
        else {
          _authorize();
          return;
        }
      });
    };

    var _getToken = function(callback) {

    };

    var _authorize = function() {
      chrome.runtime.sendMessage({action:'oauth2.begin'}, function(response) {});
    };

    return {
      getUser: function() {
        return user;
      },
      init: function(callback) {
        _checkIfAuthorized.call(this, callback);
        return this;
      },
      getData: function(route, params, callback) {
        _callApi.call(this, route, params, callback);
      }
    };
  }());

  return _API;
})();
