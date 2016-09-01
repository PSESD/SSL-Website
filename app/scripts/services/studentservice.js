(function() {
    'use strict'
    angular.module('sslv2App')
        .service('StudentService', StudentService);

    StudentService.$inject = ['$http', 'RESOURCES','$cookies'];

    function StudentService($http, RESOURCES, $cookies) {

        var profile = $cookies.getObject(sessionStorage.getItem('id'));

        var service = {

            getXSRE:getXSRE,
            getAllStudent:getAllStudent,
            deleteStudent:deleteStudent,
            getStudentSummary:getStudentSummary,
            addStudent:addStudent,
            getById:getById,
            updateStudent:updateStudent

        };

        return service;

        function getXSRE(id){
           return $http.get(RESOURCES.API_URL + profile.organization_id + '/students/'+id+'?xsre=1', {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                },
                timeout: 1100000
            })
        }

        function deleteStudent(id){
            return $http.delete(RESOURCES.API_URL + profile.organization_id + '/students/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }

        function getAllStudent(){
            return $http.get(RESOURCES.API_URL + profile.organization_id + '/students', {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }

        function getStudentSummary(){
            return $http.get(RESOURCES.API_URL + profile.organization_id + '/students?summary=1', {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }

            })
        }

        function addStudent(data){
            return $http.post(RESOURCES.API_URL + profile.organization_id + '/students', $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }

        function deleteStudent(id) {
           return $http.delete(RESOURCES.API_URL + profile.organization_id + '/students/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }

        function getById(id){
           return $http.get(RESOURCES.API_URL + profile.organization_id + '/students/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }

        function updateStudent(id,data){
            return $http.put(RESOURCES.API_URL + profile.organization_id + '/students/' + id, $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }
    }
})();