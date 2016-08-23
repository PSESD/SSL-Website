(function() {
  'use strict';

  angular.module('sslv2App')
    .controller('UserCtrl', UserCtrl);

  UserCtrl.$inject = ['$state','UserService','$confirm'];

  function UserCtrl($state,UserService,$confirm) {

    var vm = this;
    vm.reInvite = reInvite;
    vm.deleteUser = deleteUser;
    UserService.getAll()
               .then(function(response){
                  if(response.data.success){
                    vm.users = _.get(response,'data.data',"");
                  }
               },function(error){
                 $state.go('login');
               });

   function reInvite(user){
    UserService.reInvite(user)
    .then(function(response){
      console.log(response);
    },function(error){
      console.log(error);
    });
  }
  function deleteUser(id){
    $confirm({text:'Are you sure you want to delete this record?'})
    .then(function(){
      
    });
  }
  }
})();