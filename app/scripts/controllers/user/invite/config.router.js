(function() {
  'use strict';

  angular
    .module('sslv2App')
    .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

  function configFunction($stateProvider) {

    $stateProvider
    .state('dashboard.user_invite', {
      url: "^/user/invite",
      templateUrl: "views/user_invite.html",
      controller:'UserInviteCtrl',
      controllerAs:'vm'
    });

  }

})();