(function() {
    'use strict'
    angular.module('sslv2App')
        .service('ReportService', ReportService);

    ReportService.$inject = ['$http', 'RESOURCES','$cookies','ProfileService'];

    function ReportService($http, RESOURCES, $cookies,ProfileService) {
        var profile = $cookies.getObject($cookies.get('id'));
        var service = {
            getStudentFilters:getStudentFilters
        };

        return service;

        function getStudentFilters()
        {
            return $http.get(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/reports/student-filters', {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }
    }
})();
