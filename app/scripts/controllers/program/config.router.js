(function() {
    'use strict';

    angular
        .module('sslv2App')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {

        $stateProvider
            .state('dashboard.program', {
                url: "^/program",
                templateUrl: "views/program.html",
                controller:'ProgramCtrl',
                controllerAs:'vm'
            });

    }

})();