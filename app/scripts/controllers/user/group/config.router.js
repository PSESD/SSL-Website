(function() {
  'use strict';

  angular
    .module('sslv2App')
    .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

  function configFunction($stateProvider) {

    $stateProvider
    .state('dashboard.user_group', {
      url: "/user_group?id",
      templateUrl: "views/user_group.html",
      controller:'UserGroupCtrl',
      controllerAs:'vm'
    });

  }

})();