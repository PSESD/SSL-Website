(function() {
  'use strict';

  angular.module('sslv2App')
    .controller('UserViewCtrl', UserViewCtrl);

  UserViewCtrl.$inject = ['$state','$stateParams','UserService'];

  function UserViewCtrl($state,$stateParams,UserService) {

    var vm = this;
    vm.user = {
      id:'',
      first_name:'',
      middle_name:'',
      last_name:'',
      email:'',
      created:'',
      last_updated:'',
      full_name:''
    }
    UserService.getById($stateParams.id)
    .then(function(response){
      
        vm.user.id = response.data._id;
        vm.user.first_name = _.get(response,'data.first_name',"");
        
        vm.user.last_name = _.get(response,'data.last_name',"");
        vm.user.middle_name = _.get(response,'data.middle_name',"");
        vm.user.email = _.get(response,'data.email',"");
        vm.user.created = _.get(response,'data.created',"");
        vm.user.last_updated = _.get(response,'data.last_updated',"");
        vm.user.full_name = _.get(response,'data.full_name',"");
      
    },function(error){

    });
  }

})();