(function () {
  'use strict'

  angular.module('sslv2App')
      .service('ForgotService', ForgotService)

  ForgotService.$inject = ['$http', 'RESOURCES']

  function ForgotService ($http, RESOURCES) {
    var service = {
      resetPassword: resetPassword
    }

    return service

    function resetPassword (user) {
      return $http.post(RESOURCES.AUTH_URL + '/user/send/forgotpassword', $.param(user),{
        headers:{
          'Authorization': 'Bearer' + null
        }
      });
    }
  }
})();
