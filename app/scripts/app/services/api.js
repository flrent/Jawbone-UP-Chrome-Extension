angular.module('recorder.services')
  .service('Api', ['$rootScope', '$http', function($rootScope, $http) {

    /**
     * Reused internally according to settings
     * @type {string}
     */
    var baseUrl = 'https://app.bugbuster.com';

    chrome.storage.local.get('settings', function(r){
      if(r.settings && r.settings.base_url) {
        baseUrl = r.settings.base_url;
      }
    });

    /**
     * Will produce an Api get call and execute the given success and error functions
     * @param success function
     * @param error function
     */
    var checkApiKey = function(success, error) {
      _getApiKeyAndExecute(function(baseUrl, apiKey){
        $http.get(baseUrl + '/api/v1/projects?limit=200&api_key=' + apiKey)
          .success(success)
          .error(error);
      }, error);
    };

    /**
     * Will produce an Api get call and execute the given success and error functions
     * @param success function
     * @param error function
     */
    var getTenants = function(callback) {
      _getApiKeyAndExecute(function(baseUrl, apiKey){
        $http.get(baseUrl + '/api/v1/tenants?api_key=' + apiKey)
          .success(callback)
          .error(function(){
            callback({tenant:[]})
          });
      }, function(){
        callback({tenant:[]})
      });
    };

    /**
     * Will produce an Api post call and execute the given success and error functions
     * @param success
     * @param error
     * @param data
     */
    var postSequence = function(success, error, data) {
      _getApiKeyAndExecute(function(baseUrl, apiKey){
        $http.post(baseUrl+'/api/v1/recorder/scenario?api_key=' + apiKey, data)
          .success(success)
          .error(error);
      }, error);
    };

    /**
     * Will execute a function (normally an Ajax query) after the Api key is retrieved from storage
     * @param callback function
     * @private
     */
    function _getApiKeyAndExecute(callback, error){
      chrome.storage.local.get('settings', function(data){
        if (data && data.settings) {
          callback( _filterBaseUrl(data.settings.base_url) || baseUrl, data.settings.api_key);
        }
        else {
          error();
        }
      });
    }

    /**
     * Removes trailing slash
     * @param settings
     * @returns {*}
     */
    function _filterBaseUrl(baseUrl) {

      if (baseUrl){
        var lastPosition = baseUrl.length-1;

        if (baseUrl.lastIndexOf('/') == lastPosition){
          return baseUrl.substring(0, lastPosition);
        }
      }

      return baseUrl;
    }

    /******************************************************************************/
    /***************************** External Interface *****************************/
    /******************************************************************************/

    return {
      getTenants: getTenants,
      getProjects: checkApiKey,
      checkApiKey: checkApiKey,
      postSequence: postSequence
    };
  }]);
