(function(){
    'use strict';
    var __env = {};
    if(window){
        Object.assign(__env,window.__env);
    }
     angular
    .module('sslv2App')
    .constant('RESOURCES',__env)
    .constant('PROTECTED_PATHS',[
        '/',
        '/user',
        '/user/edit/profile',
        '/user/group',
        '/user/invite',
        '/user/edit/permission',
        '/user/view'
    ]);
})();