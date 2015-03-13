(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('dashBoardController', ['dashBoardService', dashBoardController]);

  /**
   * the main logic of the dashboard
   * @constructor
   */
  function dashBoardController(dashBoardService) {
    /* jshint validthis: true */
    var vm = this;

    load();


    /**
     * load the overview data
     */
    function load() {
      dashBoardService.getDashboardData().success(function(data) {
        vm.data = data;
      }).error( function(data, status, headers) {
        alert('Error: ' + data + '\nHTTP-Status: ' + status);
      });
    }
  }
})();
