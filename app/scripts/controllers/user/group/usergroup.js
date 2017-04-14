(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('UserGroupCtrl', UserGroupCtrl);

    UserGroupCtrl.$inject = ['$state', '$stateParams', 'UserService', '$confirm'];

    function UserGroupCtrl($state, $stateParams, UserService, $confirm) {

        var vm = this;
        vm.show_user_group = false;
        vm.user_id = $stateParams.id;
        vm.deleteUser = deleteUser;
        UserService.getAssignedStudent($stateParams.id)
            .then(function(response) {
                vm.students = _.get(response, 'data.data', "");
                vm.show_user_group = true;
                vm.full_name = localStorage.getItem("full_name");
            }, function(error) {

            });

        function deleteUser(id, index) {
            $confirm({ text: 'Are you sure you want to delete this record?' })
                .then(function() {
                    UserService.deleteStudent(vm.user_id, id)
                        .then(function(response) {
                            if (response.data.success === true) {
                                vm.students.splice(index, 1);
                            }
                        }, function(error) {

                        })
                });
        }
    }

})();
