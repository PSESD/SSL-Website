(function () {
    'use strict'

    angular.module('sslv2App')
        .service('ProfileService', ProfileService)

    ProfileService.$inject = []

    function ProfileService () {

        var profile = {
            id:'',
            organization_id:'',
            access_token:'',
            refresh_token:'',
            expire_time:''
        }

        var service = {
            set:set,
            getId:getId,
            getOrganizationId:getOrganizationId,
            getAccessToken:getAccessToken,
            getRefreshToken:getRefreshToken,
            getExpireTime:getExpireTime
        }

        return service;

        function set(id,organization_id,access_token,refresh_token,expire_time)
        {
            profile.id = id;

            profile.organization_id = organization_id;

            profile.access_token = access_token;

            profile.refresh_token = refresh_token;

            profile.expire_time = expire_time;
        }

        function getId()
        {
            return profile.id;
        }

        function getOrganizationId()
        {
            return profile.organization_id;
        }

        function getAccessToken()
        {
            return profile.access_token;
        }

        function getRefreshToken()
        {
            return profile.refresh_token;
        }

        function getExpireTime()
        {
            return profile.expire_time;
        }


    }
})();
