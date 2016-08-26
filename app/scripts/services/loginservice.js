(function () {
  'use strict'

  angular.module('sslv2App')
    .service('LoginService', LoginService)

  LoginService.$inject = ['$http', 'RESOURCES','GeneralService','CookieService','$timeout','$state']

  function LoginService ($http, RESOURCES,GeneralService,CookieService,$timeout,$state) {
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
      var credentials = {
        grant_type: grant_type,
        username: user.email,
        password: user.password,
        scope: 'offline_access'
      }

      this.authenticate(credentials, key)
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
