(function () {
    'use strict'

    angular.module('sslv2App')
        .service('ProgramStudentService', ProgramStudentService)

    ProgramStudentService.$inject = ['$http','$cookies','RESOURCES'];

    function ProgramStudentService ($http,$cookies,RESOURCES) {
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

            return $http.get(RESOURCES.API_URL + profile.organization_id + '/programs/' + id + '/students/' + student_id, {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }

        function getAll(){
            return $http.get(RESOURCES.API_URL + profile.organization_id + '/students'+profile.status, {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }

        function addProgram(id,data){
            return  $http.post(RESOURCES.API_URL + profile.organization_id + '/programs/' + id + '/students', $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }

        function getById(id){
            return  $http.get(RESOURCES.API_URL + profile.organization_id + '/programs/' + id + '/students', {
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

        function deleteStudent(id,student_id){
            return $http.delete(RESOURCES.API_URL + profile.organization_id + '/programs/' + id + '/students/' + student_id, {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }

        function addStudent(id,data){
           return $http.post(RESOURCES.API_URL + profile.organization_id + '/programs/' + id + '/students', $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }

        function updateProgramStudent(id,student_id,data){
            return $http.put(RESOURCES.API_URL + profile.organization_id + '/programs/' + id + '/students/' + student_id, $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }

    }
})();

