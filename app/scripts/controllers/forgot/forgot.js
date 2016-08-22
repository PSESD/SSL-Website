(function() {
  'use strict';

  angular.module('sslv2App')
    .controller('ForgotCtrl', ForgotCtrl);

  ForgotCtrl.$inject = ['$state','ForgotService','RESOURCES'];

  function ForgotCtrl($state,ForgotService,RESOURCES) {

    var vm = this;
    vm.login_greetings = localStorage.getItem("first_name") || "";
    vm.help = {
      templateUrl: 'templates/help.html'
    };

    vm.user = {
      email:"",
      redirect_url:""
    }

    vm.reset = reset;

    function reset(user) {
      user.redirect_url = RESOURCES.ENV;
      user.callback_url = RESOURCES.CALLBACK_URL;
      ForgotService.resetPassword(user)
      .then(function(response){
        $state.go('submission');
      },function(error){
        
      });
    }

  }

})();