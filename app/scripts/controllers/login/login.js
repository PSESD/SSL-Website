(function(){
'use strict';

angular.module('sslv2App')
  .controller('LoginCtrl',LoginCtrl);

LoginCtrl.$inject = ['$state'];  

  function LoginCtrl($state){
    
    var vm = this;

    vm.user = {
      email:'',
      password:'',
      remember:false
    }

    vm.auth = auth;

  }

  function auth(user){

    console.log(user);

  }

})();