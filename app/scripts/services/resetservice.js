(function () {
  'use strict'

  angular.module('sslv2App')
    .service('ResetService', ResetService)

  ResetService.$inject = ['$http', 'ENV']

  function ResetService ($http, ENV) {
    var service = {
      reset: reset
    }

    return service

    function reset (user) {
      return $http.post(ENV.AUTH_URL + 'user/forgotpassword', $.param(user),{
        headers:{
          'Authorization': 'Bearer' + ''
        }
      });
    }
  }
})();
