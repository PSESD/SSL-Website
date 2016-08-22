(function () {
  'use strict'

  angular.module('sslv2App')
    .service('ResetService', ResetService)

  ResetService.$inject = ['$http', 'RESOURCES']

  function ResetService ($http, RESOURCES) {
    var service = {
      reset: reset
    }

    return service

    function reset (user) {
      return $http.post(RESOURCES.AUTH_URL + 'user/forgotpassword', $.param(user),{
        headers:{
          'Authorization': 'Bearer' + ''
        }
      });
    }
  }
})();
