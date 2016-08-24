(function() {
    'use strict';

    angular
        .module('sslv2App')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {

        $stateProvider
            .state('submission', {
                url: "/submission",
                templateUrl: "views/submission.html",
                controller: 'SubmissionCtrl',
                controllerAs: 'vm'
            });

    }

})();