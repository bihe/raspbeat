(function() {
  'use strict';

  angular
    .module('app.user')
    .controller('userController', ['userService', userController]);

  /**
   * the main logic of the dashboard
   * @constructor
   */
  function userController(userService) {
    /* jshint validthis: true */
    var vm = this;

    load();


    ////////////

    /**
     * load the user
     */
    function load() {
      userService.getUser().success(function(data) {
        vm.user = data;
      }).error( function(data, status, headers) {
        alert('Error: ' + data + '\nHTTP-Status: ' + status);
      });
    }
  }
})();
