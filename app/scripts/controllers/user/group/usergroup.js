(function() {
  'use strict';

  angular.module('sslv2App')
    .controller('UserGroupCtrl', UserGroupCtrl);

  UserGroupCtrl.$inject = ['$state','$stateParams','UserService'];

  function UserGroupCtrl($state,$stateParams,UserService) {

    var vm = this;
    
    UserService.getAssignedStudent($stateParams.id)
    .then(function(response){
      
      vm.students = _.get(response,'data.data',"");
      
    },function(error){
      console.log(error);
    });
  }

})();