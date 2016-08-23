(function () {
  'use strict'
  angular.module('sslv2App')
    .service('UserService', UserService);

  UserService.$inject = ['$http','RESOURCES','$cookies'];

  function UserService ($http,RESOURCES,$cookies) {
    var profile = $cookies.getObject(sessionStorage.getItem('id'));
    var service = {
      getAll:getAll,
      reInvite:reInvite,
      getById:getById,
      updatePermission:updatePermission,
      getAssignedStudent:getAssignedStudent,
      deleteUser:deleteUser
    };

    return service;

    function getAll(){
        return  $http.get(RESOURCES.API_URL + profile.organization_id + '/users?pending=true', {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            })
    }
    function reInvite(user){
      var data ={
        email:user.email,
        redirect_url:RESOURCES.REDIRECT_URL
      }
      return $http.put(RESOURCES.AUTH_URL  + 'user/invite',$.param(data), {
            headers: {
                'Authorization': 'Bearer ' + profile.access_token
            }
        });
    }
    function getById(id){
     
      return   $http.get(RESOURCES.API_URL + profile.organization_id + '/users/' + id, {
            headers: {
                'Authorization': 'Bearer ' + profile.access_token
            }
        });
    }
    function updatePermission(id,data){
     return $http.put(RESOURCES.API_URL + profile.organization_id + '/users/' + id, $.param(data), {
                    headers: {
                        'Authorization': 'Bearer ' + profile.access_token
                    }
                });
    }
    function getAssignedStudent(id){
      return $http.get(RESOURCES.API_URL + profile.organization_id + '/users/' + id + '/students', {
            headers: {
                'Authorization': 'Bearer ' + profile.access_token
            }
        });
    }
    function deleteUser(id){
        return $http.delete(RESOURCES.API_URL + profile.organization_id + '/users/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + profile.access_token
                }
            });
    }
  }
})();
