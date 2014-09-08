"use strict"

/**
 * Declare app level module which depends on filters, and services
 */
angular.module('recorder', [
  'ui.router',
  'recorder.services',
  'recorder.controllers',
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

  $stateProvider.state('settings', {
    url: '/settings',
    templateUrl: 'scripts/app/templates/settings.html'
  });

  $stateProvider.state('credits', {
    url: '/credits',
    templateUrl: 'scripts/app/templates/credits.html'
  });

  $stateProvider.state('record_list', {
    url: '/records',
    templateUrl: 'scripts/app/templates/record_list.html'
  });

  $stateProvider.state('record_details', {
    url: '/records/:date/details',
    templateUrl: 'scripts/app/templates/record_details.html'
  });

  $stateProvider.state('record_export', {
    url: '/records/:date/export',
    templateUrl: 'scripts/app/templates/record_export.html'
  });

  $stateProvider.state('selector_list', {
    url: '/selectors',
    templateUrl: 'scripts/app/templates/selector_list.html'
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
angular.module('recorder.controllers', []);
angular.module('recorder.services', []);

angular.module('recorder').run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
