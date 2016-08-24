(function() {
  'use strict';

  angular
    .module('sslv2App')
    .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

  function configFunction($stateProvider) {

    $stateProvider
    .state('dashboard.user_edit', {
      url: "^/user/edit/profile",
      templateUrl: "views/user_edit_profile.html",
      controller:'UserEditCtrl',
      controllerAs:'vm'
    });

  }

})();