(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('ResetCtrl', ResetCtrl);

    ResetCtrl.$inject = ['$state', 'ResetService', '$stateParams', '$timeout'];

    function ResetCtrl($state, ResetService, $stateParams, $timeout) {

        var vm = this;
        vm.help = {
            templateUrl: 'templates/help.html'
        }
        vm.user = {
            email: $stateParams.email,
            password: "",
            confirm_password: "",
            _csrf: $stateParams.csrfToken,
            redirect_to: $stateParams.redirectTo
        }
        vm.reset = reset;
        vm.message = "";

        function reset(user) {
            if (vm.user.password !== vm.user.confirm_password) {
                vm.message = "Password does not match the confirm password.";
                $timeout(function() {
                    vm.message = "";
                }, 5000);
            } else {
                ResetService.reset(user)
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
                $state.go('login');
            }, 2000);
        }
    }

})();