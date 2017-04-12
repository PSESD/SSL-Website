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
    
    //referenced in code but not defined anywhere I can find. 
    .constant('RESOURCES', {
        DISTRICT: [
            {
                id: "seattle",
                name: "Seattle"
            }
        ],
        LOCAL: "",
        RELATIONSHIP: [
            {
                id: 'parent',
                name: 'Parent'
            }, {
                id: 'grandparent',
                name: 'Grandparent'
            }, {
                id: 'aunt',
                name: 'Aunt'
            }, {
                id: 'uncle',
                name: 'Uncle'
            }, {
                id: 'brother',
                name: 'Brother'
            }, {
                id: 'sister',
                name: 'Sister'
            }, {
            id: 'guardian',
            name: 'Legal Guardian'
        }, {
            id: 'other',
            name: 'Other'
        }],
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

    .constant('UNPROTECTED_PATHS',[
        '/login',
        '/forgot',
        '/reset',
        '/reset?csrfToken&redirectTo&email',
        '/submission'
    ]);
})();

