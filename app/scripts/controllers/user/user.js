(function() {
  'use strict';

  angular.module('sslv2App')
  .controller('UserCtrl', UserCtrl);

  UserCtrl.$inject = ['$state','UserService','$confirm', '$timeout'];

  function UserCtrl($state,UserService,$confirm,$timeout) {

    var vm = this;
    var userID = localStorage.getItem('id');
    vm.show_user = false;
    vm.reInvite = reInvite;
    vm.deleteUser = deleteUser;
    UserService.getAll()
    .then(function(response){
      if(response.data.success){
        vm.users = _.get(response,'data.data',"");
      }
      vm.show_user = true;
    },function(error){
     $state.go('login');
   });

    function reInvite(user){
      UserService.reInvite(user)
      .then(function(response){
      },function(error){

      });
    }
    function deleteUser(id,user){
      $confirm({
        title: 'Delete User',
        text:'Are you sure you want to delete this record?'
      })
      .then(function(){
        UserService.deleteUser(id)
        .then(function(response){
          if(response.data.success === true && userID === id){
            vm.message = 'You have succesfully deleted yourself. You will now be logged out.';
            logout();
          }else if(response.data.success === true){
            vm.users.splice(vm.users.indexOf(user), 1)
            vm.message = response.data.message;
          }
        },function(error){

        })
      });
    }

    function logout() {
      $timeout(function() {
        vm.message = "";
        $state.go('login');
      }, 6000);
    }
  }
})();
