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
        var formatData = [], timeIsOver = false;
        _.forEach(data, function(elem) {
          try {
            // parse the entry - if there was no entry for more than 12h - the host is down
            timeIsOver = moment(elem.lastEntry).add(13, 'h').isBefore();
            formatData.push({title: elem._id.title, ip: elem._id.ip, count: elem.count, last: moment(elem.lastEntry).fromNow(), down: timeIsOver});
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
