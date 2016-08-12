(function() {
  'use strict';

  angular.module('sslv2App')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$state','$timeout'];

  function LoginCtrl($state,$timeout) {

    var vm = this;

    vm.user = {
      email: '',
      password: '',
      remember: false
    }

    vm.auth = auth;

    function auth(user) {

      vm.message = true;
      $timeout(function() {
        vm.message = false;
      }, 3000);

    }

  }



})();