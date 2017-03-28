(function () {
    'use strict'

    angular.module('sslv2App')
        .service('ProfileService', ProfileService)

    ProfileService.$inject = ['$cookies']

    function ProfileService ($cookies) {

        var profile = {
            id:'',
            organization_id:'',
            access_token:'',
            refresh_token:'',
            expire_time:''
        }

        var service = {
            getId:getId,
            getOrganizationId:getOrganizationId,
            getAccessToken:getAccessToken,
            getRefreshToken:getRefreshToken,
            getExpireTime:getExpireTime,
            clear:clear
        }

        return service;

        function getId()
        {
            profile.id = $cookies.get('id');
            return profile.id;
        }

        function getOrganizationId()
        {
            profile.organization_id = $cookies.get('organization_id');
            return profile.organization_id;
        }

        function getAccessToken()
        {
            profile.access_token = $cookies.get('access_token');
            return profile.access_token;
        }

        function getRefreshToken()
        {
            profile.refresh_token = $cookies.get('refresh_token');
            return profile.refresh_token;
        }

        function getExpireTime()
        {
            profile.expire_time = $cookies.get('expire_time');
            return profile.expire_time;
        }

        function clear(){
            sessionStorage.clear();
            localStorage.clear();
            var id = this.getId();
            $cookies.remove(id);
            $cookies.remove('id');
            $cookies.remove('organization_id');
            $cookies.remove('access_token');
            $cookies.remove('refresh_token');
            $cookies.remove('expire_time');
            profile.id = '';
            profile.organization_id='';
            profile.access_token='';
            profile.refresh_token='';
            profile.expire_time=''
        }


    }
})();
