(function () {
  'use strict'

  angular.module('sslv2App')
    .service('LoginService', LoginService)

  LoginService.$inject = ['$http', 'RESOURCES','GeneralService','CookieService','$timeout','$state','$cookies']

  function LoginService ($http, RESOURCES,GeneralService,CookieService,$timeout,$state,$cookies) {
    var service = {
      authenticate: authenticate,
      validate:validate
    }

    return service

    function authenticate (credentials, key) {
      return $http.post(RESOURCES.AUTH_URL + 'oauth2/token', $.param(credentials), {
        headers: {
          'Authorization': 'Basic ' + key
        }
      });

    }



    function validate(user,vm){
      vm.show_login_loading = true;
      var profile = {
        expire_time:'',
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
        organization_id: '',
        status:''
      }
      var key = GeneralService.base64Encode(RESOURCES.CLIENT_ID + ':' + RESOURCES.CLIENT_SECRET);

      var grant_type = encodeURIComponent(RESOURCES.GRANT_TYPE);
      var credentials = {
        grant_type: grant_type,
        username: user.email,
        password: user.password,
        scope: 'offline_access'
      }

      this.authenticate(credentials, key)
          .then(function(response) {
            vm.show_login_loading = false;
            if ('access_token' in response.data) {
              var embedded = {
                organization:_.get(response.data.embeded,'organization',""),
                users:_.get(response.data.embeded,'users',"")
              }
              profile.access_token = response.data.access_token;
              profile.refresh_token = response.data.refresh_token;
              profile.expire_time = response.data.expires_in;
              if(embedded.organization !== "")
              {
                profile.access = true;
                profile.organization_id = _.get(embedded.organization,"id","");
                profile.redirect_url = _.get(embedded.organization,"url","");
                profile.organization_name = _.get(embedded.organization,"name","");

                if(profile.organization_name !== ""){
                  $cookies.put('organization_name', profile.organization_name);
                }

                  profile.exists = true;
                  profile.id = _.get(embedded.users,"id","");
                  profile.role = _.get(embedded.users,"role","");
                  if (_.get(embedded.users.data,"first_name","") !== "") {
                      profile.full_name += _.get(embedded.users,"first_name","") + ' ';
                      profile.first_name = _.get(embedded.users,"first_name","");
                  }
                  if (_.get(embedded.users,"last_name","")) {
                      profile.full_name += _.get(embedded.users,'last_name','');
                      profile.last_name = _.get(embedded.users,'last_name','');
                  }
                  if(profile.role === "admin"){
                      profile.status = "";
                  }else{
                      profile.status = "?assign=true";
                  }

                  profile.is_authenticated = true;
                  //localStorage.clear();
                  localStorage.setItem('id', profile.id);
                  if(profile.full_name.length > 10){
                      profile.full_name = profile.full_name.substr(0,7) + '...';
                  }
                  localStorage.setItem('full_name',profile.full_name);
                  localStorage.setItem('first_name', profile.first_name);
                  if (user.remember === true) {
                      localStorage.setItem('email', user.email);
                  }else{
                      localStorage.setItem('email', "");
                  }
                  $cookies.put('id',profile.id);
                  $cookies.put('organization_id',profile.organization_id);
                  $cookies.put('access_token',profile.access_token);
                  $cookies.put('refresh_token',profile.refresh_token);
                  $cookies.put('expire_time',profile.expire_time);
                  CookieService.set(profile);
                  $state.go('dashboard.student',{},{reload:true});

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
      }, 4000);
    }

  }
})();
