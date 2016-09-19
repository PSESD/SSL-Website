(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('UserStudentCtrl', UserStudentCtrl);

    UserStudentCtrl.$inject = ['$state', 'UserService', '$timeout', 'RESOURCES', '$stateParams'];

    function UserStudentCtrl($state, UserService, $timeout, RESOURCES, $stateParams) {

        var vm = this;
        vm.students = {};
        vm.user_id = $stateParams.id;
        vm.submit = submit;

        UserService.getListStudent($stateParams.id)
            .then(function(response) {
                var data = _.get(response, 'data.data', "");
                if (data !== "") {
                    vm.students = _.filter(data, function(v) {
                        return !v.added;
                    });
                }
            }, function(error) {

            });

        function submit(data) {
            if (vm.new_student) {
                var data = _.omit(data, ['student_id']);
                UserService.addNewStudent(vm.user_id, data)
                    .then(function(response) {
                        if (response.data.success === true) {
                            vm.message = response.data.message;
                            closeMessage();
                        }
                    }, function(error) {

                    });
            } else {
                var data = _.omit(data, ['district_student_id', 'first_name', 'last_name', 'school_district', '']);
                UserService.updateStudent(vm.user_id, data.student_id)
                    .then(function(response) {
                        if (response.data.success === true) {
                            vm.message = response.data.message;
                            closeMessage();
                        }
                    }, function(error) {

                    });
            }
        }

        function closeMessage() {
            $timeout(function() {
                vm.message = "";
                $state.go('dashboard.user_group', { id: vm.user_id });
            }, 2000);
        }
    }

})();