(function() {
  'use strict';

  angular.module('sslv2App')
    .controller('UserCtrl', UserCtrl);

  UserCtrl.$inject = ['$state','UserService','$confirm'];

  function UserCtrl($state,UserService,$confirm) {

    var vm = this;
    vm.show_user = false;
    vm.reInvite = reInvite;
    vm.deleteUser = deleteUser;
    UserService.getAll()
               .then(function(response){
                  if(response.data.success){
                    vm.users = _.get(response,'data.data',"");
                    vm.users.full_name = _.get(response,'data.data.first_name',"");
                    vm.users.full_name = vm.users.full_name +" "+_.get(response,'data.data.middle_name',"");
                    vm.users.full_name = vm.users.full_name +" "+_.get(response,'data.data.last_name',"");
                    vm.users.full_name = vm.users.full_name.trim();
                  }
                  vm.show_user = true;
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
  function deleteUser(id,index){
    $confirm({text:'Are you sure you want to delete this record?'})
    .then(function(){
      UserService.deleteUser(id)
      .then(function(response){
          if(response.data.success === true){
            vm.users.splice(index,1);
          }
      },function(error){
        console.log(error);
      })
    });
  }
  }
})();