(function() {
    'use strict';

    angular
        .module('sslv2App')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {

        $stateProvider
            .state('dashboard.report', {
                url: "^/report",
                templateUrl: "views/report.html",
                controller:'ReportCtrl',
                controllerAs:'vm'
            });

    }

})();