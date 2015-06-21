(function() {
  'use strict';

  // factory
  angular
    .module('app.dashboard')
    .factory('dashBoardService', ['$http', dashBoardService]);


  function dashBoardService($http) {

    var service = {
      getDashboardData: getOverview,
      getStats: getStats,
      removeEntry: removeEntry
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

    /**
     * remove the given entry from the store
     * @param id
     * @returns {HttpPromise}
     */
    function removeEntry(id) {
      return $http.delete('/api/ui/remove/' + id.title + '/' + id.ip);
    }
  }
})();


