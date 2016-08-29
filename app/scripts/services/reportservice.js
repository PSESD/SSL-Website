(function() {
    'use strict'
    angular.module('sslv2App')
        .service('ReportService', ReportService);

    ReportService.$inject = ['$http', 'RESOURCES','$cookies','LoginService','GeneralService','CookieService','$timeout','$state'];

    function ReportService($http, RESOURCES, $cookies) {
        var profile = $cookies.getObject(sessionStorage.getItem('id'));
        var service = {
        };

        return service;
    }
})();