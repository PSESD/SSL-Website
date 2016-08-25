(function () {
    'use strict'

    angular.module('sslv2App')
        .service('ProgramService', ProgramService)

    ProgramService.$inject = ['$http','$cookies','RESOURCES']

    function ProgramService ($http,$cookies,RESOURCES) {
        var profile = $cookies.getObject(sessionStorage.getItem('id'));
        var service = {
            getAll:getAll,
            addProgram:addProgram,
            getById:getById,
            updateProgram:updateProgram,
            deleteProgram:deleteProgram
        }
        return service;

        function getAll(){
            return $http.get(RESOURCES.API_URL + profile.organization_id + '/programs', {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }

        function addProgram(data){
            return $http.post(RESOURCES.API_URL + profile.organization_id + '/programs', $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }

        function getById(id){
            return  $http.get(RESOURCES.API_URL + profile.organization_id + '/programs/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }

        function updateProgram(id,data){
            return $http.put(RESOURCES.API_URL  + profile.organization_id + '/programs/' + id, $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }

        function deleteProgram(id){
            return $http.delete(RESOURCES.API_URL + profile.organization_id + '/programs/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }

    }
})();

