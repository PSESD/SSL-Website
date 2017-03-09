(function() {
  'use strict';

  angular.module('sslv2App')
    .controller('DashboardCtrl', DashboardCtrl);

  DashboardCtrl.$inject = ['$state', '$cookies'];

  function DashboardCtrl($state, $cookies) {
    // console.log($cookies);
    // console.log($cookies.getObject(sessionStorage.getItem('id')));
    // console.log($cookies.get('id'));
    var vm = this;
    var profile = localStorage.getItem('id');;
    vm.full_name  = localStorage.getItem('full_name');
    vm.email = profile.email;
    vm.logout = logout;

    function logout(){
      //$cookies.remove(profile.id);
      sessionStorage.clear();
      var rememberEmail = localStorage.getItem('email');
      localStorage.clear();
      localStorage.setItem('email',rememberEmail);
      $state.go('login');
    }
  }

})();
