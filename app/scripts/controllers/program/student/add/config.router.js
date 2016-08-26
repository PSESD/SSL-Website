(function() {
    'use strict';

    angular
        .module('sslv2App')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {

        $stateProvider
            .state('dashboard.program_student_add', {
                url: "^/program/student/add/:id",
                templateUrl: "views/program_student_add.html",
                controller:'ProgramStudentAddCtrl',
                controllerAs:'vm'
            });

    }

})();