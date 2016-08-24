(function() {
  'use strict';

  angular
    .module('sslv2App')
    .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

  function configFunction($stateProvider) {

    $stateProvider
    .state('dashboard', {
      url: "/",
      templateUrl: "views/dashboard.html",
      controller:'DashboardCtrl',
      controllerAs:'vm'
    });

  }

})();