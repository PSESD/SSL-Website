(function() {
    'use strict';

    angular
        .module('sslv2App')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {

        $stateProvider
            .state('dashboard.program_student', {
                url: "^/program/student/:id",
                templateUrl: "views/program_student.html",
                controller:'ProgramStudentCtrl',
                controllerAs:'vm'
            });

    }

})();