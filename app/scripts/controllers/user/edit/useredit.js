(function() {
  'use strict';

  angular.module('sslv2App')
    .controller('UserEditCtrl', UserEditCtrl);

  UserEditCtrl.$inject = ['$state','UserService','$cookies','$timeout'];

  function UserEditCtrl($state,UserService,$cookies,$timeout) {
    var profile = $cookies.getObject(sessionStorage.getItem('id'));
    var vm = this;
    vm.save = save;
    vm.user = {
      first_name:'',
      middle_name:'',
      last_name:'',
      email:'',
      password:'',
      confirm_password:'',
    }
    UserService.getById(profile.id)
    .then(function(response){
        vm.user.first_name = _.get(response,'data.first_name',"");  
        vm.user.last_name = _.get(response,'data.last_name',"");
        vm.user.middle_name = _.get(response,'data.middle_name',"");
        vm.user.email = _.get(response,'data.email',"");
    },function(error){
      console.log(error);
    });
    function save(data){
        if(data.password !== data.confirm_password){
            vm.message = "Password confirmation not match";
            closeMessage("password");
        }else{
        UserService.updateProfile(data)
        .then(function(response){
            if(response.data.success === true){
                vm.message = response.data.message;
                closeMessage();
            }
        },function(error){
            console.log(error);
        });
        }
    }
    function closeMessage(type){
        if(type === "password"){
$timeout(function(){
            vm.message = "";
        },2000);
        }else{
$timeout(function(){
            vm.message = "";
            $state.go("dashboard");
        },2000);
        }
        
    }
  }

})();