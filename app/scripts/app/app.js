"use strict"

angular.module('jawbone', [
  'ui.router',
  'jawbone.services',
  'jawbone.controllers',
  'xeditable',
  'ui.bootstrap',
  'templates-main'
])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'scripts/app/templates/home.html'
  });

}])

.filter("reverse", function() {
  return function(items) {
    return items.slice().reverse();
  };
});

angular.module('jawbone.controllers', []);
angular.module('jawbone.services', []);