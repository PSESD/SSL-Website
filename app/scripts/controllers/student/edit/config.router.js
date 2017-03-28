(function() {
    'use strict';

    angular
        .module('sslv2App')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {

        $stateProvider
            .state('dashboard.student_edit', {
                url: "^/student/:id/edit",
                params: {
                    student: null
                },
                templateUrl: "views/student_edit.html",
                controller:'StudentEditCtrl',
                controllerAs:'vm'
            });

    }

})();