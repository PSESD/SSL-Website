(function() {
    'use strict'

    angular.module('sslv2App')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['LoginService','$window'];

    function LoginCtrl(LoginService,$window) {
        var vm = this;
        var email = localStorage.getItem("email") || "";
        vm.message = '';
        vm.show_login_loading = false;
        vm.user = {
            email: '',
            password: '',
            remember: false
        }
        vm.login_greetings = localStorage.getItem("first_name") || "";
        vm.help = {
            templateUrl: 'templates/help.html'
        }

        if (email !== "") {
            vm.user.email = email = localStorage.getItem("email");
            vm.user.remember = true;
        }else if(email === ""){
            localStorage.setItem("email","");
            vm.user.email = "";
            vm.user.remember = false;
        }
        vm.auth = auth;

        function auth(user) {
            LoginService.validate(user,vm);
        }
    }
})();