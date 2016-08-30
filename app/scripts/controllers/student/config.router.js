(function() {
    'use strict';

    angular
        .module('sslv2App')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {

        $stateProvider
            .state('dashboard.student', {
                url: "^/student",
                templateUrl: "views/student.html",
                controller:'StudentCtrl',
                controllerAs:'vm'
            });

    }

})();