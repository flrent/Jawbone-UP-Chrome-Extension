angular.module('jawbone.controllers', ['angularCharts'])
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

  $scope.config = {
    title: 'Products',
    tooltips: true,
    labels: false,
    mouseover: function() {},
    mouseout: function() {},
    click: function() {},
    legend: {
      display: true,
      //could be 'left, right'
      position: 'right'
    }
  };

  $scope.data = {
    series: ['Sales', 'Income', 'Expense', 'Laptops', 'Keyboards'],
    data: [{
      x: "Laptops",
      y: [100, 500, 0],
      tooltip: "this is tooltip"
    }, {
      x: "Desktops",
      y: [300, 100, 100]
    }, {
      x: "Mobiles",
      y: [351]
    }, {
      x: "Tablets",
      y: [54, 0, 879]
    }]
  };


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
