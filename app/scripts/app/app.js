"use strict"

/**
 * Declare app level module which depends on filters, and services
 */
angular.module('jawbone', [
  'ui.router',
  'jawbone.services',
  'jawbone.controllers',
  'xeditable',
  'ui.bootstrap',
  'templates-main'
])

/**
 * Prepare routes
 */
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'scripts/app/templates/home.html'
  });

}])

/**
 * This filter will be globally available
 */
.filter("reverse", function() {
  return function(items) {
    return items.slice().reverse();
  };
});

// Just for initialization purposes
angular.module('jawbone.controllers', []);
angular.module('jawbone.services', []);

// angular.module('jawbone').run(function(editableOptions) {
//   editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
// });
