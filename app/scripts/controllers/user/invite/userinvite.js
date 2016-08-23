(function() {
  'use strict';

  angular.module('sslv2App')
    .controller('UserInviteCtrl', UserInviteCtrl);

  UserInviteCtrl.$inject = ['$state','UserService'];

  function UserInviteCtrl($state,UserService) {

    var vm = this;
    vm.user = {
        email:'',
        role:''
    }
    vm.submit = submit;

    function submit(user){
        UserService.invite(user)
        .then(function(response){
          console.log(response);
        },function(error){
          console.log(error);
        })
    }
  }

})();