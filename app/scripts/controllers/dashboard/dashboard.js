(function() {
  'use strict';

  angular.module('sslv2App')
    .controller('DashboardCtrl', DashboardCtrl);

  DashboardCtrl.$inject = ['$state', '$cookies', 'RESOURCES'];

  function DashboardCtrl($state, $cookies, RESOURCES) {

    var vm = this;
    var profile = $cookies.getObject(sessionStorage.getItem('id'));
    vm.full_name  = profile.full_name;
    vm.email = profile.email;
    vm.logout = logout;

    function logout(){
      $cookies.remove(profile.id);
      sessionStorage.clear();
      $state.go('login');
    }
  }

})();