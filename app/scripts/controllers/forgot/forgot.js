(function() {
  'use strict';

  angular.module('sslv2App')
    .controller('ForgotCtrl', ForgotCtrl);

  ForgotCtrl.$inject = ['$state','ForgotService','RESOURCES', '$cookies'];

  function ForgotCtrl($state,ForgotService,RESOURCES, $cookies) {

    var vm = this;
    vm.login_greetings = localStorage.getItem("first_name") || "";
    vm.help = {
      templateUrl: 'templates/help.html'
    };

    vm.user = {
      email:"",
      redirect_url:""
    }
    vm.organization_name = $cookies.get('organization_name');
    vm.reset = reset;

    function reset(user) {
      user.callback_url = window.location.origin + "/#!reset";
      user.redirect_url = window.location.origin + "/";
      ForgotService.resetPassword(user)
      .then(function(response){
        $state.go('submission');
      },function(error){

      });
    }

  }

})();
