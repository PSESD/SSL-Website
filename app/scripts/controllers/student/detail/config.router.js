(function() {
    'use strict';

    angular
        .module('sslv2App')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {

        $stateProvider
            .state('dashboard.student_detail', {
                url: "^/student/:id/detail",
                templateUrl: "views/student_detail.html",
                controller: 'StudentDetailCtrl',
                controllerAs: 'vm'
            });

    }

})();