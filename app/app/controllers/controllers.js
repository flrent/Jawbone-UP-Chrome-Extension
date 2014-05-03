angular.module('jawbone')
.controller('StatsController', ['$scope', 'API', function($scope, API) {
  $scope.stats = [];

  API.authenticate(function(user) {
    $scope.user = user;
    $scope.$apply();
    console.log("Authenticated");
    console.log($scope.user);
  }); 

  API.loadStats(function(data) {
    _.each(data.data, function(day, index, list) {
      var data = day[1];
      var stats = {
        day: moment(day[0], "YYYYMMDD").format('MM/DD'),
        walked: data.m_distance/1000,
        s_quality: data.s_quality
      };
      var cssClass = "progress-bar progress-bar-";
      if(data.s_quality>75) cssClass+="success";
      else if(data.s_quality>60) cssClass+="info";
      else if(data.s_quality>40) cssClass+="warning";
      else cssClass+="danger";
      stats.cssClass = cssClass;
     $scope.stats.push(stats);
    });
   $scope.$apply();
  });

}])
.controller('ActionsController', ['$scope', function($scope, API) {
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
