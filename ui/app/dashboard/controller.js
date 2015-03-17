(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('dashBoardController', ['dashBoardService', '_', 'moment', dashBoardController]);

  /**
   * the main logic of the dashboard
   * @constructor
   */
  function dashBoardController(dashBoardService, _, moment) {
    var vm = this;

    load();


    ////////////

    /**
     * load the overview data
     */
    function load() {
      dashBoardService.getDashboardData().success(function(data) {
        var formatData = [];
        _.forEach(data, function(elem) {
          try {
            formatData.push({title: elem._id.title, ip: elem._id.ip, count: elem.count, last: moment(elem.lastEntry).fromNow(), down: elem.timeIsOver});
          } catch (err) {
            console.log(err);
          }
        });
        vm.data = formatData;

      }).error( function(data, status, headers) {
        alert('Error: ' + data + '\nHTTP-Status: ' + status);
      });
    }
  }
})();
