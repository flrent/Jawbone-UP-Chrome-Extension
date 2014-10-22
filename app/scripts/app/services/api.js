angular.module('jawbone.services')
  .service('Api', ['$rootScope', '$http', function($rootScope, $http) {
      var _API = {};
       var stats = [];

      // _API.authenticate(function(user) {
      //    $scope.user = user;
      //    $scope.$apply();
      //    console.log("Authenticated");
      //   console.log($scope.user);
      // });

      // _API.loadStats(function(data) {
      //   _.each(data.data, function(day, index, list) {
      //     var data = day[1];
      //     var _stat = {
      //       day: moment(day[0], "YYYYMMDD").format('MM/DD'),
      //       walked: data.m_distance/1000,
      //       s_quality: data.s_quality
      //     };
      //     _stat.s_quality = data.s_quality;
      //    stats.push(stat);
      //   });

      // });

    /******************************************************************************/

    return {

    };
  }]);
