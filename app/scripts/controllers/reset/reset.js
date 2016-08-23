(function() {
  'use strict';

  angular.module('sslv2App')
    .controller('ResetCtrl', ResetCtrl);

  ResetCtrl.$inject = ['$state','ResetService','$stateParams','$timeout'];

  function ResetCtrl($state,ResetService,$stateParams,$timeout) {

    var vm = this;
    vm.user = {
      email:$stateParams.email,
      password:"",
      confirm_password:"",
      _csrf:$stateParams.csrfToken,
      redirect_to:$stateParams.redirectTo
    }
    vm.reset = reset;
   
    function reset(user){
      if(vm.user.password !== vm.user.confirm_password){
        vm.message = "Password does not match the confirm password.";
        $timeout(function(){
          vm.message = "";
        },5000);
      }else{
    ResetService.reset(user)
      .then(function(response){
      },function(error){
        
      });
      }
    }

  }

})();