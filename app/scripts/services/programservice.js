(function () {
    'use strict'

    angular.module('sslv2App')
        .service('ProgramService', ProgramService)

    ProgramService.$inject = ['$http','RESOURCES','ProfileService']

    function ProgramService ($http,RESOURCES,ProfileService) {

        var service = {
            getAll:getAll,
            addProgram:addProgram,
            getById:getById,
            updateProgram:updateProgram,
            deleteProgram:deleteProgram
        }
        return service;

        function getAll(){

            return $http.get(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/programs', {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function addProgram(data){
            return $http.post(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/programs', $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function getById(id){
            return  $http.get(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/programs/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function updateProgram(id,data){
            return $http.put(RESOURCES.API_URL  + ProfileService.getOrganizationId() + '/programs/' + id, $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function deleteProgram(id){
            return $http.delete(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/programs/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

    }
})();

