(function() {
    'use strict'
    angular.module('sslv2App')
        .service('ReportService', ReportService);

    ReportService.$inject = ['$http', 'ENV','$cookies','ProfileService'];

    function ReportService($http, ENV, $cookies,ProfileService) {
        var profile = $cookies.getObject(sessionStorage.getItem('id'));
        var service = {
            getStudentFilters:getStudentFilters
        };

        return service;

        function getStudentFilters()
        {
            return $http.get(ENV.API_URL + ProfileService.getOrganizationId() + '/reports/student-filters', {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }
    }
})();