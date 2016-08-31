(function() {
    'use strict';

    angular
        .module('sslv2App')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {

        $stateProvider
            .state('dashboard.student_add', {
                url: "^/student/add",
                templateUrl: "views/student_add.html",
                controller: 'StudentAddCtrl',
                controllerAs: 'vm'
            });

    }

})();