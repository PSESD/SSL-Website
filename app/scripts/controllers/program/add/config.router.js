(function() {
    'use strict';

    angular
        .module('sslv2App')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {

        $stateProvider
            .state('dashboard.program_add', {
                url: "^/program/add",
                templateUrl: "views/program_add.html",
                controller:'ProgramAddCtrl',
                controllerAs:'vm'
            });

    }

})();