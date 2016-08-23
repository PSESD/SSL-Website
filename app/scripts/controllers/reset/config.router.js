(function() {
  'use strict';

  angular
    .module('sslv2App')
    .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

  function configFunction($stateProvider) {

    $stateProvider
    .state('reset', {
      url: "/reset?csrfToken&redirectTo&email",
      templateUrl: "views/reset.html",
      controller:'ResetCtrl',
      controllerAs:'vm'
    });

  }

})();