(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('SubmissionCtrl', SubmissionCtrl);

    SubmissionCtrl.$inject = [''];

    function SubmissionCtrl($state) {

        var vm = this;
        vm.login_greetings = localStorage.getItem("first_name") || "";
        vm.help = {
            templateUrl: 'templates/help.html'
        };
    }

})();