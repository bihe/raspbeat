(function() {
  'use strict';

  // factory
  angular
    .module('app.user')
    .factory('userService', ['$http', userService]);


  function userService($http) {

    var service = {
      getUser: getUser
    };
    return service;

    ////////////

    /**
     * return the overview beats
     * @returns {HttpPromise}
     */
    function getUser() {
      return $http.get('/api/ui/user');
    }
  }
})();


