(function() {
    'use strict'
    angular.module('sslv2App')
        .service('UserService', UserService);

    UserService.$inject = ['$http', 'ENV','ProfileService'];

    function UserService($http, ENV,ProfileService) {
        var service = {
            getAll: getAll,
            reInvite: reInvite,
            getById: getById,
            updatePermission: updatePermission,
            getAssignedStudent: getAssignedStudent,
            deleteUser: deleteUser,
            invite: invite,
            updateProfile: updateProfile,
            getListStudent: getListStudent,
            addNewStudent: addNewStudent,
            updateStudent: updateStudent,
            deleteStudent: deleteStudent,
        };

        return service;
        function getAll() {
            return $http.get(ENV.API_URL + ProfileService.getOrganizationId() + '/users?pending=true', {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            });
        }

        function reInvite(user) {
            var data = {
                email: user.email,
                redirect_url: ENV.REDIRECT_URL
            }
            return $http.put(ENV.AUTH_URL + 'user/invite', $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            });
        }

        function getById(id) {
            return $http.get(ENV.API_URL + ProfileService.getOrganizationId() + '/users/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            });
        }

        function updatePermission(id, data) {
            return $http.put(ENV.API_URL + ProfileService.getOrganizationId() + '/users/' + id, $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            });
        }

        function getAssignedStudent(id) {
            return $http.get(ENV.API_URL + ProfileService.getOrganizationId() + '/users/' + id + '/students', {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            });
        }

        function deleteUser(id) {
            return $http.delete(ENV.API_URL + ProfileService.getOrganizationId() + '/users/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            });
        }

        function invite(data) {
            return $http.post(ENV.AUTH_URL + 'user/invite', $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            });
        }

        function updateProfile(data) {
            return $http.put(ENV.API_URL + 'user/', $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            });
        }

        function getListStudent(id) {
            return $http.get(ENV.API_URL + ProfileService.getOrganizationId() + '/students?noxsre=1&noprogram=1&userId=' + id, {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            });
        }

        function addNewStudent(id, data) {
            return $http.post(ENV.API_URL + ProfileService.getOrganizationId() + '/users/' + id + '/students', $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            });
        }

        function updateStudent(id, student_id) {
            return $http.put(ENV.API_URL + ProfileService.getOrganizationId() + '/users/' + id + '/students/' + student_id, {}, {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            });
        }

        function deleteStudent(id, student_id) {
            return $http.delete(ENV.API_URL + ProfileService.getOrganizationId() + '/users/' + id + '/students/' + student_id, {
                headers: {
                    'Authorization': 'Bearer ' + ProfileService.getAccessToken()
                }
            })
        }


    }
})();