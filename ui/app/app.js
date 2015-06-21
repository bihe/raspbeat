(function() {
  'use strict';

  angular
    .module('raspApp', [
      'ui.router',
      'hSweetAlert',                       // sweet alert: native alert replacement
      'app.dashboard',
      'app.user'
    ])
    .constant('_', window._)
    .constant('moment', window.moment)
    .config(['$stateProvider', '$urlRouterProvider','$compileProvider',
      function ($stateProvider, $urlRouterProvider, $compileProvider) {
        //
        // for any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/");

        //
        // defined states
        $stateProvider
        .state('initial', {
          url: "/",
          templateUrl: "views/dashboard.html"
        })


        //
        // speedup
        $compileProvider.debugInfoEnabled(false);

      }])
    .run(['$rootScope', '$location',
      function($rootScope, $location) {
        $rootScope.$on("$routeChangeStart", function(event, next, current) {

        });
      }]);
})();
