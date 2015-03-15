(function() {
  'use strict';

  // factory
  angular
    .module('app.dashboard')
    .factory('dashBoardService', ['$http', dashBoardService]);


  function dashBoardService($http) {

    var service = {
      getDashboardData: getOverview
    };
    return service;

    ////////////

    /**
     * return the overview beats
     * @returns {HttpPromise}
     */
    function getOverview() {
      return $http.get('/api/ui/overviewBeats');
    }
  }
})();


