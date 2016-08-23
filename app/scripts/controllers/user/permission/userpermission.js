(function() {
  'use strict';

  angular.module('sslv2App')
    .controller('UserEditPermissionCtrl', UserEditPermissionCtrl);

  UserEditPermissionCtrl.$inject = ['$state','$stateParams','UserService','$timeout'];

  function UserEditPermissionCtrl($state,$stateParams,UserService,$timeout) {

    var vm = this;
    var id = $stateParams.id;
    vm.update = update;
    vm.message = "";
    vm.user = {
        full_name:'',
        role:''
    }
    UserService.getById(id)
    .then(function(response){
        vm.user.full_name = response.data.full_name;
        vm.user.role = response.data.role;
    },function(error){
        $state.go('login');
    });
    
    function update(user){
        var data ={
            role:user.role
        }
        UserService.updatePermission(id,data)
        .then(function(response){
            if(response.data.success === true){
                vm.message = response.data.message;
                closeMessage();
            }
        },function(error){
            console.log(error);
        })
    }
    function closeMessage(){
        $timeout(function(){
            vm.message = "";
            $state.go('dashboard.manage');
        },2000);
    }
  }

})();