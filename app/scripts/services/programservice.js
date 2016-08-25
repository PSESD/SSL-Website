(function () {
    'use strict'

    angular.module('sslv2App')
        .service('ProgramService', ProgramService)

    ProgramService.$inject = ['$http','$cookies','RESOURCES']

    function ProgramService ($http,$cookies,RESOURCES) {
        var profile = $cookies.getObject(sessionStorage.getItem('id'));
        var service = {
            getAll:getAll
        }
        return service;

        function getAll(){
            return $http.get(RESOURCES.API_URL + profile.organization_id + '/programs', {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }

    }
})();

