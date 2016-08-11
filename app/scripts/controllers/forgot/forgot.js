(function(){
'use strict';

angular.module('sslv2App')
  .controller('ForgotCtrl',ForgotCtrl);

ForgotCtrl.$inject = ['$state'];  

  function ForgotCtrl($state){
    
    var vm = this;

    vm.user = {
      email:'',
    }

    vm.reset = reset;

  }

  function reset(user){

    console.log(user);

  }

})();