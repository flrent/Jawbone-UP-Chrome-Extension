angular.module('jawbone.controllers')
.controller('ApplicationController',
  ['Storage', 'Api', '$scope', '$location',
    function(Storage, Api, $scope, $location) {
    var a = 2;

    }
  ]
)




.controller('StatsController', ['$scope', 'API', function($scope, API) {
  $scope.stats = [];
  var token = false;
  $scope.user = {};

  console.log('authenticating');

  API.authenticate(function(newToken) {
    token = newToken;
    console.log('authentication done');

    API.getUserInfos(function(data) {
      console.log('user loaded');
      $scope.user = data;
      API.loadStats(function(data) {
        _.each(data.data, function(day, index, list) {
          var data = day[1];
          var stats = {
            day: moment(day[0], "YYYYMMDD").format('MM/DD'),
            walked: data.m_distance/1000,
            s_quality: data.s_quality
          };
          stats.s_quality = data.s_quality;
         $scope.stats.push(stats);
        });
       $scope.$apply();
      });
    });
  });



}])





.controller('ActionsController', ['$scope','API' , function($scope, API) {
  $scope.contribute = function() {
    chrome.tabs.create({url: 'https://github.com/flrent/Jawbone-UP-Chrome-Extension'}, function(){});
  };
  $scope.clear = function() {
    chrome.storage.local.clear(function() {
      window.close();
    });
  };
  $scope.close = function() {
   window.close();
  };
}]);
