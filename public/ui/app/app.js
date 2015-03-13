(function() {
  'use strict';

  angular
    .module('raspApp', [
      'ui.router',
      'app.dashboard'
    ])
    .constant('_', window._)
    .config(['$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {
        //
        // for any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/");

        //
        // defined states
        $stateProvider
        .state('initial', {
          url: "/",
          templateUrl: "app/dashboard/main.html"
        })

      }])
    .run(['$rootScope', '$location',
      function($rootScope, $location) {
        $rootScope.$on("$routeChangeStart", function(event, next, current) {

        });
      }]);
})();
