(function() {
    'use strict'
    angular.module('sslv2App')
        .service('UserService', UserService);

    UserService.$inject = ['$http', 'RESOURCES','$cookies','LoginService','GeneralService','CookieService','$timeout','$state'];

    function UserService($http, RESOURCES, $cookies,LoginService,GeneralService,CookieService,$timeout,$state) {
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
            updateStudent: updateStudent,
            deleteStudent: deleteStudent,
            login:login
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

        function deleteStudent(id, student_id) {
            return $http.delete(RESOURCES.API_URL + profile.organization_id + '/users/' + id + '/students/' + student_id, {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
        }

        function login(user,vm){
            var profile = {
                is_authenticated: false,
                first_name: '',
                last_name: '',
                full_name: '',
                access: false,
                id: false,
                redirect_url: false,
                role: 'case-worker-restricted',
                organization_name: '',
                exists: false,
                access_token: '',
                refresh_token: '',
                organization_id: ''
            }
            var key = GeneralService.base64Encode(RESOURCES.CLIENT_ID + ':' + RESOURCES.CLIENT_SECRET);
            var grant_type = encodeURIComponent(RESOURCES.GRANT_TYPE);
            var uri = RESOURCES.AUTH_URL + 'oauth2/token';
            var credentials = {
                grant_type: grant_type,
                username: user.email,
                password: user.password,
                scope: 'offline_access'
            }

            LoginService.authenticate(credentials, key)
                .then(function(response) {
                    if ('access_token' in response.data) {
                        var embedded = {
                            organization:_.get(response.data.embeded,'organization',""),
                            users:_.get(response.data.embeded,'users',"")
                        }
                        profile.access_token = response.data.access_token;
                        profile.refresh_token = response.data.refresh_token;
                        if(embedded.organization !== "")
                        {
                            profile.access = true;
                            profile.organization_id = _.get(embedded.organization,"_id","");
                            profile.redirect_url = _.get(embedded.organization,"url","");
                            profile.organization_name = _.get(embedded.organization,"name","");
                            if(profile.organization_name !== ""){
                                localStorage.setItem('organization_name', profile.organization_name);
                            }
                            if(embedded.users.total>0){
                                for (var i = 0; i < embedded.users.total; i++) {
                                    if (_.get(embedded.users.data[i],"email","") === credentials.username) {
                                        profile.exists = true;
                                        profile.id = _.get(embedded.users.data[i],"id","");
                                        profile.role = _.get(embedded.users.data[i],"role","");
                                        if (_.get(embedded.users.data[i],"first_name","") !== "") {
                                            profile.full_name += _.get(embedded.users.data[i],"first_name","") + ' ';
                                            profile.first_name = _.get(embedded.users.data[i],"first_name","");
                                        }
                                        if (_.get(embedded.users.data[i],"last_name","")) {
                                            profile.full_name += embedded.users.data[i].last_name;
                                            profile.last_name = embedded.users.data[i].last_name;
                                        }

                                    }
                                }
                                profile.is_authenticated = true;
                                localStorage.clear();
                                sessionStorage.setItem('id', profile.id);
                                sessionStorage.setItem('full_name',profile.full_name);
                                localStorage.setItem('first_name', profile.first_name);
                                    if (user.remember === true) {
                                        localStorage.setItem('email', user.email);
                                    }else{
                                        localStorage.setItem('email', "");
                                    }
                                CookieService.set(profile);
                                $state.go('dashboard',{},{reload:true});
                            }else{

                            }
                        }
                    } else {
                        if ('error' in response.data) {
                            if (typeof response.data.error === 'object') {
                                vm.message = true;
                                closeMessage(vm);
                            } else {
                                vm.message = true;
                                closeMessage(vm);
                            }
                        }
                    }

                }, function(error) {

                })

        }
        function closeMessage(vm) {
            $timeout(function() {
                vm.message = false;
            }, 3000);
        }
    }
})();