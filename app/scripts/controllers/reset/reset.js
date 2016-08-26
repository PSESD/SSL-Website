(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('ResetCtrl', ResetCtrl);

    ResetCtrl.$inject = ['ResetService', '$stateParams', '$timeout','LoginService'];

    function ResetCtrl(ResetService, $stateParams, $timeout,LoginService) {

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
                            var credentials ={
                                email: vm.user.email,
                                password: vm.user.password,
                                remember: false
                            }
                            LoginService.validate(credentials,vm);
                        }
                    }, function(error) {

                    });
            }
        }
    }

})();