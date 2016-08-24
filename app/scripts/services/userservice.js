(function() {
    'use strict'
    angular.module('sslv2App')
        .service('UserService', UserService);

    UserService.$inject = ['$http', 'RESOURCES', '$cookies'];

    function UserService($http, RESOURCES, $cookies) {
        var profile = $cookies.getObject(sessionStorage.getItem('id'));
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
            updateStudent: updateStudent
        };

        return service;

        function getAll() {
            return $http.get(RESOURCES.API_URL + profile.organization_id + '/users?pending=true', {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            });
        }

        function reInvite(user) {
            var data = {
                email: user.email,
                redirect_url: RESOURCES.REDIRECT_URL
            }
            return $http.put(RESOURCES.AUTH_URL + 'user/invite', $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            });
        }

        function getById(id) {

            return $http.get(RESOURCES.API_URL + profile.organization_id + '/users/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            });
        }

        function updatePermission(id, data) {
            return $http.put(RESOURCES.API_URL + profile.organization_id + '/users/' + id, $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            });
        }

        function getAssignedStudent(id) {
            return $http.get(RESOURCES.API_URL + profile.organization_id + '/users/' + id + '/students', {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            });
        }

        function deleteUser(id) {
            return $http.delete(RESOURCES.API_URL + profile.organization_id + '/users/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            });
        }

        function invite(data) {
            return $http.post(RESOURCES.AUTH_URL + '/user/invite', $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            });
        }

        function updateProfile(data) {
            return $http.put(RESOURCES.API_URL + 'user/', $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            });
        }

        function getListStudent(id) {
            return $http.get(RESOURCES.API_URL + profile.organization_id + '/students?noxsre=1&noprogram=1&userId=' + id, {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            });
        }

        function addNewStudent(id, data) {
            return $http.post(RESOURCES.API_URL + profile.organization_id + '/users/' + id + '/students', $.param(data), {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            });
        }

        function updateStudent(id, student_id) {
            return $http.put(RESOURCES.API_URL + profile.organization_id + '/users/' + id + '/students/' + student_id, {}, {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            });
        }
    }
})();