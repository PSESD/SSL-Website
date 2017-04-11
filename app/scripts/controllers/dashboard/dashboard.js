(function() {
  'use strict';

  angular.module('sslv2App')
    .controller('DashboardCtrl', DashboardCtrl);

  DashboardCtrl.$inject = ['$state', '$cookies'];

  function DashboardCtrl($state, $cookies) {
    var vm = this;
    var profile = localStorage.getItem('id');
    var profile_roll = localStorage.getItem('profile_roll');
    vm.full_name  = localStorage.getItem('full_name');
    vm.email = profile.email;
    vm.logout = logout;

    if(profile_roll === "admin"){
      vm.dashboard_show_manage = true;
    };

    function logout(){
      $cookies.remove(profile.id);
      localStorage.removeItem('id');
      localStorage.removeItem('student_profiles');
      localStorage.setItem('logged_in', '0');
      sessionStorage.clear();
      $state.go('login');
    }
  }

})();
