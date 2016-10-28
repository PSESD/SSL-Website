(function() {
  'use strict';

  angular
    .module('sslv2App', [
      'ui.router',
      'ui.bootstrap',
      'ui.mask',
      'ngCookies',
      'ui.gravatar',
      'angular-confirm',
      'ngIdle',
      'ngSanitize',
      'ngTagsInput',
      'ui.multiselect',
      'fsm',
      'ui.codemirror',
      'angularMoment',
      'pascalprecht.translate',
      'tmh.dynamicLocale',

    ])
    .factory('headerInjector', [function() {
      var headerInjector = {
        request: function(config) {
          config.headers['X-Cbo-Client-Url'] = 'http://helpinghand.cbo.upward.st';
          return config;
        }
      };
      return headerInjector;
    }])
    .config(configFunction)
    .run(runFunction);

  configFunction.$inject = ['$httpProvider','$urlRouterProvider','gravatarServiceProvider','KeepaliveProvider','IdleProvider','$locationProvider','$translateProvider','tmhDynamicLocaleProvider'];

  function configFunction($httpProvider,$urlRouterProvider,gravatarServiceProvider,KeepaliveProvider,IdleProvider,$locationProvider,$translateProvider,tmhDynamicLocaleProvider) {
      tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
      $translateProvider.useMissingTranslationHandlerLog();
      $translateProvider.useStaticFilesLoader({
          prefix: 'resources/locale-',
          suffix: '.json'
      });
      $translateProvider.preferredLanguage('en_US');
      $translateProvider.useLocalStorage();
      $translateProvider.useMissingTranslationHandlerLog();
      $locationProvider.hashPrefix('!');
    $urlRouterProvider.otherwise("/login");
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.get = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.common.Accept = '*/*';
    $httpProvider.interceptors.push('headerInjector');
    $httpProvider.defaults.timeout = 15000;
    gravatarServiceProvider.defaults = {
      size     : 50,
      "default": 'mm'
    };
      $httpProvider.interceptors.push(function ($q,ProfileService,$location) {
          return {
              'response': function (response) {
                  if (response.status === 401) {
                      sessionStorage.clear();
                      ProfileService.clear();
                      $location.path('/login');
                  }
                  return response || $q.when(response);
              },
              'responseError': function (rejection) {
                  if (rejection.status === 401) {
                      sessionStorage.clear();
                      ProfileService.clear();
                      $location.path('/login');
                  }
                  return $q.reject(rejection);
              }
          };
      });
    // IdleProvider.idle(5); // in seconds
    // IdleProvider.timeout(10); // in seconds
    // KeepaliveProvider.interval(1); // in seconds
  }

  runFunction.$inject = ['$rootScope', '$state', 'RESOURCES','$cookies','Idle','PROTECTED_PATHS'];

  function runFunction($rootScope, $state, RESOURCES,$cookies,Idle,PROTECTED_PATHS) {
    // Idle.watch();
    $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error) {

        if (error === "AUTH_REQUIRED") {
          $state.go('login');
        }

      });
    // $rootScope.$on('IdleStart', function() {
    //     console.log("idle start");
    // });
    // $rootScope.$on('IdleEnd', function() {
    //     console.log("idleEnd");
    // });
    //  $rootScope.$on('Keepalive', function() {
    //     console.log("keepalive");
    // });

    //   $rootScope.$on('IdleTimeout', function() {
    //   console.log("timeout");
    //   });
    //   $rootScope.$on('IdleWarn', function(e, countdown) {
    //     console.log("idle warn");
    // });

      $rootScope.$on('$stateNotFound', 
        function(event, unfoundState, fromState, fromParams){ 
          console.log(unfoundState);
        })

    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams, options) {
      var profile;
          if(sessionStorage.getItem('id') === null){
            profile = {
              is_authenticated:false
            }
          }else{
            profile = $cookies.getObject(sessionStorage.getItem('id'));
          }

        if(toState.name !== "dashboard" && toState.name !== "login" && toState.name !== "forgot"){
            $rootScope.currentURL = toState.name.replace('dashboard.','') + '-page';
        }else{
            $rootScope.currentURL = toState.name.replace('/','') + '-page';
        }
        if (!profile.is_authenticated && pathIsProtected(toState.url)) {
          event.preventDefault();
          $state.go('login', {}, {reload: true});
        }

      });

    function pathIsProtected(path) {
      return PROTECTED_PATHS.indexOf(path) !== -1;
    }

  }



})();