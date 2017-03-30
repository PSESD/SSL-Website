(function() {
    'use strict'
    angular.module('sslv2App')
        .service('StudentService', StudentService);

    StudentService.$inject = ['$http', 'RESOURCES','ProfileService'];

    function StudentService($http, RESOURCES, ProfileService) {

        var service = {

            getXSRE:getXSRE,
            getAllStudent:getAllStudent,
            getAllStudentDetails: getAllStudentDetails,
            deleteStudent:deleteStudent,
            getStudentSummary:getStudentSummary,
            addStudent:addStudent,
            getById:getById,
            updateStudent:updateStudent,
            getStudentById:getStudentById,
            getTranscript:getTranscript,
            getAttendance:getAttendance,
            getTranscriptById:getTranscriptById,
            getAssessmentById:getAssessmentById,
            getXsre:getXsre,
            getAttendanceByYear:getAttendanceByYear,
            deleteXsre:deleteXsre,
            deleteAttendance:deleteAttendance

        };

        return service;

        function getXSRE(id){
           return $http.get(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/students/'+id+'?xsre=1', {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                },
                timeout: 1100000
            })
        }

        function deleteStudent(id){
            return $http.delete(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/students/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function getAllStudent(){
            return $http.get(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/students', {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function getAllStudentDetails(id) {
          return $http.get(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/students/' + id + '/details', {
            headers: {
              'Authorization': 'Bearer ' + ProfileService.getAccessToken()
            }
          })
        }


        function getStudentSummary(){
            return $http.get(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/students?summary=1', {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }

            })
        }

        function addStudent(data){
            return $http.post(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/students', $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function deleteStudent(id) {
           return $http.delete(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/students/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function getById(id){
           return $http.get(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/students/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function updateStudent(id,data){
            return $http.put(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/students/' + id, $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function getStudentById(id){
            return $http.get(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/students/' + id+'/general', {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }
        function getTranscript(id){
            return  $http.get(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/students/' + id + '/transcript?pageSize=all', {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function getAttendance(id){
            return $http.get(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/students/' + id + '/attendance', {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function getTranscriptById(id){
            return $http.get(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/students/' + id + '/transcript?pageSize=all', {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function getAssessmentById(id){
            return $http.get(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/students/' + id + '/assessment', {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }
        function getXsre(id)
        {
            return $http.get(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/students/'+id+'/xsre.xml?raw=1', {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                },
                timeout: 15000
            })
        }

        function getAttendanceByYear(id,year)
        {
            return $http.get(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/students/' + id + '/attendance?pageSize=all&year='+year, {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function deleteXsre(id)
        {
            return $http.delete(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/students/' + id + '/xsre', {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }

        function deleteAttendance(id)
        {
            return $http.delete(RESOURCES.API_URL + ProfileService.getOrganizationId() + '/students/' + id + '/xsre?separate=attendance', {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }
    }
})();
