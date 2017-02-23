(function () {
  'use strict'

  angular.module('sslv2App')
      .service('ForgotService', ForgotService)

  ForgotService.$inject = ['$http', 'ENV']

  function ForgotService ($http, ENV) {
    var service = {
      resetPassword: resetPassword
    }

    return service

    function resetPassword (user) {
      return $http.post(ENV.AUTH_URL + 'user/send/forgotpassword', $.param(user),{
        headers:{
          'Authorization': 'Bearer' + null
        }
      });
    }
  }
})();
