(function() {
  'use strict';

  angular
    .module('sslv2App')
    .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

  function configFunction($stateProvider) {

    $stateProvider
    .state('dashboard.manage', {
      url: "/manage",
      templateUrl: "views/user.html",
      controller:'UserCtrl',
      controllerAs:'vm'
    });

  }

})();