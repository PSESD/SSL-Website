(function(angular, undefined) {
'use strict';

angular.module('sslv2App')

.constant('ENV', {API_URL:'http://localhost:4000/',AUTH_URL:'http://localhost:3000/api/',BASE_URL:'/',CALLBACK_URL:'http://localhost:9000',CLIENT_ID:'client',CLIENT_SECRET:'bbb7881c92f2a1592757a4d53080ab392d78691c0c6a9b19f547965aa57a',ENABLE_DEBUG:true,ENV:'local',GRANT_TYPE:'password',REDIRECT_URL:'http://localhost:9000'})

;
})(angular);