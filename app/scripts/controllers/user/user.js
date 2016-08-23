(function() {
  'use strict';

  angular.module('sslv2App')
    .controller('UserCtrl', UserCtrl);

  UserCtrl.$inject = ['$state','UserService','$uibModal'];

  function UserCtrl($state,UserService,$uibModal) {

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

  function deleteUser(id, index) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'templates/modal.html',
                controller: 'UserModalInstanceCtrl',
                size: "sm",
                resolve:{
                    items:function(){
                        return {
                            "id":id,
                            index:index
                        }
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if(result.success === true)
                {
                }else{
                }

            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });

        };

  }
})();