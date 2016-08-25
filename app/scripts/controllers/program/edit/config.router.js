(function() {
    'use strict';

    angular
        .module('sslv2App')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {

        $stateProvider
            .state('dashboard.program_edit', {
                url: "^/program/edit/:id",
                templateUrl: "views/program_edit.html",
                controller:'ProgramEditCtrl',
                controllerAs:'vm'
            });

    }

})();