(function() {
  'use strict';

  // factory
  angular
    .module('app.dashboard')
    .factory('dashBoardService', ['$http', dashBoardService]);


  function dashBoardService($http) {

    var service = {
      getDashboardData: getOverview,
      getStats: getStats
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

    /**
     * retrieve the stats
     * @returns {HttpPromise}
     */
    function getStats() {
      return $http.get('/api/ui/sumBeats');
    }
  }
})();


