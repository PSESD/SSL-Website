(function() {
    'use strict';

    angular
        .module('sslv2App')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {

        $stateProvider
            .state('dashboard.program_student_edit', {
                url: "^/program/:id/student/:student_id/edit/",
                templateUrl: "views/program_student_edit.html",
                controller:'ProgramStudentEditCtrl',
                controllerAs:'vm'
            });

    }

})();