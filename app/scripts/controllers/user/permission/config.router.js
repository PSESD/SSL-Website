(function() {
  'use strict';

  angular
    .module('sslv2App')
    .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

  function configFunction($stateProvider) {

    $stateProvider
    .state('dashboard.user_edit_permission', {
      url: "^/user/edit/permission/:id",
      templateUrl: "views/user_edit_permission.html",
      controller:'UserEditPermissionCtrl',
      controllerAs:'vm'
    });

  }

})();