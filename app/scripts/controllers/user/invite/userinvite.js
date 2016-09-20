(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('UserInviteCtrl', UserInviteCtrl);

    UserInviteCtrl.$inject = ['$state', 'UserService', '$timeout', 'RESOURCES'];

    function UserInviteCtrl($state, UserService, $timeout, RESOURCES) {

        var vm = this;
        vm.message = "";
        vm.user = {
            email: '',
            role: '',
            caseWorkerRestricted: true,
            redirect_url: RESOURCES.REDIRECT_URL
        }
        vm.submit = submit;

        function submit(user) {
            UserService.invite(user)
                .then(function(response) {

                    if (response.data.success === true) {
                        vm.message = response.data.message;
                        closeMessage();
                    }else{
                        vm.message = response.data.error;
                        $timeout(function() {
                            vm.message = "";
                        }, 2000);
                    }
                }, function(error) {

                })
        }

        function closeMessage() {
            $timeout(function() {
                vm.message = "";
                $state.go('dashboard.manage');
            }, 2000);
        }
    }

})();