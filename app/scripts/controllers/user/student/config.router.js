(function() {
    'use strict';

    angular
        .module('sslv2App')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {

        $stateProvider
            .state('dashboard.user_student_add', {
                url: "^/user/add/student/:id",
                templateUrl: "views/user_student_add.html",
                controller: 'UserStudentCtrl',
                controllerAs: 'vm'
            });

    }

})();