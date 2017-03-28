(function () {
    'use strict'

    angular.module('sslv2App')
        .service('ProgramService', ProgramService)

    ProgramService.$inject = ['$http','ENV','ProfileService']

    function ProgramService ($http,ENV,ProfileService) {

        var service = {
            getAll:getAll,
            addProgram:addProgram,
            getById:getById,
            updateProgram:updateProgram,
            deleteProgram:deleteProgram
        }
        return service;

        function getAll(){

            return $http.get(ENV.API_URL + ProfileService.getOrganizationId() + '/programs', {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function addProgram(data){
            return $http.post(ENV.API_URL + ProfileService.getOrganizationId() + '/programs', $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function getById(id){
            return  $http.get(ENV.API_URL + ProfileService.getOrganizationId() + '/programs/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function updateProgram(id,data){
            return $http.put(ENV.API_URL  + ProfileService.getOrganizationId() + '/programs/' + id, $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function deleteProgram(id){
            return $http.delete(ENV.API_URL + ProfileService.getOrganizationId() + '/programs/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

    }
})();

