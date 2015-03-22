(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('statsController', ['dashBoardService', statsController]);

  /**
   * stats logic: number of senders/entries
   * @constructor
   */
  function statsController(dashBoardService) {
    var vm = this;

    load();


    ////////////

    /**
     * load the overview data
     */
    function load() {
      dashBoardService.getStats().success(function(data) {
        vm.stats = data;
      }).error( function(data, status, headers) {
        alert('Error: ' + data + '\nHTTP-Status: ' + status);
      });
    }
  }
})();
