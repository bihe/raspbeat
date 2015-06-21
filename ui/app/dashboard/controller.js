(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('dashBoardController', ['dashBoardService', '_', 'moment', 'sweet', dashBoardController]);

  /**
   * the main logic of the dashboard
   * @constructor
   */
  function dashBoardController(dashBoardService, _, moment, sweet) {
    var vm = this;

    // event handler

    vm.removeBeat = removeBeat;

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
            formatData.push({id: elem._id, title: elem._id.title, ip: elem._id.ip, count: elem.count, last: moment(elem.lastEntry).fromNow(), down: elem.timeIsOver});
          } catch (err) {
            console.log(err);
          }
        });
        vm.data = formatData;

      }).error( function(data, status, headers) {
        alert('Error: ' + data + '\nHTTP-Status: ' + status);
      });
    }

    /**
     * delete a beat entry
     * @param id
     */
    function removeBeat(id) {

      sweet.show({
        title: 'Löschen bestätigen!',
        text: 'Soll der Eintrag gelöscht werden?',
        type: 'error',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Löschen',
        animation: false,
        closeOnConfirm: true
      }, function() {

        dashBoardService.removeEntry(id).success(function(data) {
          // entry deleted - load the data again
          load();
        }).error( function(data, status, headers) {

          console.log('Error: ' + data);
          sweet.show('Oops...', 'Got an error: ' + status, 'error');
        });
      });
    }
  }
})();
