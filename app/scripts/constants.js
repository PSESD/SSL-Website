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

    //referenced in code but not defined anywhere I can find. 
    .constant('RESOURCES', {
        DISTRICT: [
            {
                id: "seattle",
                name: "Seattle"
            }
        ],
        LOCAL: "",
        RELATIONSHIP: {

        },
        RACE: [
            {
                "id": "AmericanIndianOrAlaskaNative",
                "name": "American Indian Or Alaska Native"
            }, 
            {
                "id" : "BlackOrAfricanAmerican",
                "name" : "Black"
            },
            {
                "id": "Asian",
                "name": "Asian"
            },
            {
                "id": "NativeHawaiianOrOtherPacificIslander",
                "name": "Native Hawaiian Or Pacific Islander"
            },
            {
                "id": "White",
                "name": "White"
            },
            {
                "id" :"DemographicRaceTwoOrMoreRaces",
                "name":"Multiracial"
            }]
    })
})();