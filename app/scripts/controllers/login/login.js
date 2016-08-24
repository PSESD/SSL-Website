(function() {
    'use strict'

    angular.module('sslv2App')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$state', '$timeout', 'RESOURCES', '$location', '$http', 'GeneralService', 'LoginService', 'CookieService', '$sce'];

    function LoginCtrl($state, $timeout, RESOURCES, $location, $http, GeneralService, LoginService, CookieService, $sce) {
        var vm = this;
        var email = localStorage.getItem("email") || "";
        vm.message = '';

        vm.user = {
            email: '',
            password: '',
            remember: false
        }
        vm.login_greetings = localStorage.getItem("first_name") || "";
        vm.help = {
            templateUrl: 'templates/help.html'
        }

        if (email !== "") {
            vm.user.email = email = localStorage.getItem("email");
            vm.user.remember = true;
        }
        vm.auth = auth;

        function auth(user) {


            var host_name = $location.host()
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
                        profile.access_token = response.data.access_token;
                        profile.refresh_token = response.data.refresh_token;
                        LoginService.getOrganization(profile.access_token)
                            .then(function(response) {
                                if (response.data.success && response.data.total > 0) {
                                    for (var i = 0; i < response.data.total; i++) {
                                        if (RESOURCES.ENV || host_name === response.data.data[i].url) {
                                            profile.access = true;
                                            profile.organization_id = response.data.data[i]._id;
                                            profile.redirect_url = response.data.data[i].url;
                                            profile.organization_name = response.data.data[i].name;
                                        }
                                    }
                                    localStorage.setItem('organization_name', profile.organization_name);
                                    if (profile.access) {
                                        LoginService.getUsers(profile.organization_id, profile.access_token)
                                            .then(function(response) {
                                                if (response.data.success && response.data.total > 0) {
                                                    for (var i = 0; i < response.data.total; i++) {
                                                        if (response.data.data[i].email === credentials.username) {
                                                            profile.exists = true;
                                                            profile.id = response.data.data[i].id;
                                                            profile.role = response.data.data[i].role;
                                                            if (typeof response.data.data[i].first_name !== 'undefined' && response.data.data[i].first_name) {
                                                                profile.full_name += response.data.data[i].first_name + ' ';
                                                                profile.first_name = response.data.data[i].first_name;
                                                            }
                                                            if (typeof response.data.data[i].last_name !== 'undefined' && response.data.data[i].last_name) {
                                                                profile.full_name += response.data.data[i].last_name;
                                                                profile.last_name = response.data.data[i].last_name;
                                                            }

                                                        }
                                                    }
                                                    if (profile.exists) {
                                                        profile.is_authenticated = true;
                                                        localStorage.clear();
                                                        sessionStorage.setItem('id', profile.id);
                                                        localStorage.setItem('first_name', profile.first_name);

                                                        if (user.remember === true) {
                                                            localStorage.setItem('email', user.email);
                                                        }
                                                        CookieService.set(profile);
                                                        $state.go('dashboard');
                                                    } else {
                                                        vm.message = 'Your account is not active';
                                                    }
                                                } else {

                                                }
                                            }, function(error) {

                                            })
                                    } else {

                                    }
                                } else {

                                }
                            }, function(error) {

                            })
                    } else {
                        if ('error' in response.data) {
                            if (typeof response.data.error === 'object') {
                                vm.message = true;
                                closeMessage();
                            } else {
                                vm.message = true;
                                closeMessage();
                            }
                        }
                    }

                }, function(error) {

                })
        }

        function closeMessage() {
            $timeout(function() {
                vm.message = false;
            }, 3000);
        }
    }
})();