(function(){
    'use strict';
    var __env = {};
    if(window){
        Object.assign(__env,window.__env);
    }
     angular
    .module('sslv2App')
    .constant('RESOURCES',__env)
     .constant('LOCALES', {
         'locales': {
             'en_US': 'English'
         },
         'preferredLocale': 'en_US'
     })
    .constant('UNPROTECTED_PATHS',[
        '/login',
        '/forgot',
        '/reset',
        '/submission'
    ]);
})();
