(function(){
    'use strict';

     angular
    .module('sslv2App')

     .constant('LOCALES', {
         'locales': {
             'en_US': 'English'
         },
         'preferredLocale': 'en_US'
     })

    .constant('PROTECTED_PATHS',[
        '/',
        '/manage',
        '/user/edit/profile',
        '/user/group/',
        '/user/invite',
        '/user/edit/permission',
        '/user/add/student',
        '/user/view'
    ])
})();