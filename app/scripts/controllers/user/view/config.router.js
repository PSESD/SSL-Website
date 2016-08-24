(function() {
  'use strict';

  angular
    .module('sslv2App')
    .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

  function configFunction($stateProvider) {

    $stateProvider
    .state('dashboard.user_view', {
      url: "^/user/view/:id",
      templateUrl: "views/user_view.html",
      controller:'UserViewCtrl',
      controllerAs:'vm'
    });

  }

})();