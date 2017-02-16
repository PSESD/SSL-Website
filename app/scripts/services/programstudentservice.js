(function () {
    'use strict'

    angular.module('sslv2App')
        .service('ProgramStudentService', ProgramStudentService)

    ProgramStudentService.$inject = ['$http','ENV','ProfileService','$cookies'];

    function ProgramStudentService ($http,ENV,ProfileService,$cookies) {

        var profile = $cookies.getObject(sessionStorage.getItem('id'));
        var service = {
            addProgram:addProgram,
            getById:getById,
            updateProgram:updateProgram,
            deleteStudent:deleteStudent,
            addStudent:addStudent,
            getAll:getAll,
            getProgramStudent:getProgramStudent,
            updateProgramStudent:updateProgramStudent
        }
        return service;

        function getProgramStudent(id,student_id){

            return $http.get(ENV.API_URL + ProfileService.getOrganizationId() + '/programs/' + id + '/students/' + student_id, {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function getAll(){
            return $http.get(ENV.API_URL + ProfileService.getOrganizationId() + '/students'+profile.status, {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function addProgram(id,data){
            return  $http.post(ENV.API_URL + ProfileService.getOrganizationId() + '/programs/' + id + '/students', $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function getById(id){
            return  $http.get(ENV.API_URL + ProfileService.getOrganizationId() + '/programs/' + id + '/students', {
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

        function deleteStudent(id,student_id){
            return $http.delete(ENV.API_URL + ProfileService.getOrganizationId() + '/programs/' + id + '/students/' + student_id, {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function addStudent(id,data){
           return $http.post(ENV.API_URL + ProfileService.getOrganizationId() + '/programs/' + id + '/students', $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function updateProgramStudent(id,student_id,data){
            return $http.put(ENV.API_URL + ProfileService.getOrganizationId() + '/programs/' + id + '/students/' + student_id, $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

    }
})();

