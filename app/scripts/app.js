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
      'easypiechart'
    ])
  .factory('headerInjector', headerInjector)
  .config(configFunction)
  .run(runFunction);

  headerInjector.$inject = ['RESOURCES','ENV'];

  function headerInjector(RESOURCES, ENV) {
      var headerInjector = {
          request: function(config) {
              config.headers['X-Cbo-Client-Url'] = ENV.LOCAL;
              return config;
          }
      };
      return headerInjector;
  }

  configFunction.$inject = ['$httpProvider','$urlRouterProvider','gravatarServiceProvider','KeepaliveProvider','IdleProvider','$locationProvider','$translateProvider','tmhDynamicLocaleProvider','RESOURCES','ENV'];

  function configFunction($httpProvider,$urlRouterProvider,gravatarServiceProvider,KeepaliveProvider,IdleProvider,$locationProvider,$translateProvider,tmhDynamicLocaleProvider,RESOURCES,ENV) {
      tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
      $translateProvider.useMissingTranslationHandlerLog();
      $translateProvider.useSanitizeValueStrategy('sanitize');
      $translateProvider.useStaticFilesLoader({
          prefix: 'resources/locale-',
          suffix: '.json'
      });
      $translateProvider.preferredLanguage('en_US');
      $translateProvider.useLocalStorage();
      $translateProvider.useMissingTranslationHandlerLog();
    $urlRouterProvider.otherwise("/login");
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.get = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.common.Accept = '*/*';
    if(ENV.LOCAL !== ""){
        $httpProvider.interceptors.push('headerInjector');
    }
    $httpProvider.defaults.timeout = 15000;
    gravatarServiceProvider.defaults = {
      size     : 50,
      "default": 'mm'
    };


    $httpProvider.interceptors.push(function ($q,ProfileService,$location, $window) {

      //Force https
      // if (RESOURCES.ENV !== 'local' && $location.protocol() !== 'https') {
      //   $window.location.href = $location.absUrl().replace('http', 'https');
      // }

      return {
        'response': function (response) {
          if (response.status === 401) {
            sessionStorage.clear();
            //localStorage.clear();
            ProfileService.clear();
            $location.path('/login');
          }
          return response || $q.when(response);
        },
        'responseError': function (rejection) {
          if (rejection.status === 401) {
            sessionStorage.clear();
            //localStorage.clear();
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

  runFunction.$inject = ['$rootScope', '$state', 'RESOURCES','$cookies','Idle','UNPROTECTED_PATHS'];

  function runFunction($rootScope, $state, RESOURCES,$cookies,Idle,UNPROTECTED_PATHS) {
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
        if (localStorage.getItem('id') === null) {
          profile = {
            is_authenticated: false
          }
        } else {
          profile = { is_authenticated: true };
        }
        if (!profile.is_authenticated && !pathIsUnprotected(toState.url)) {
          event.preventDefault();
          window.location.assign("/#!/login");
        }
        else if (profile.is_authenticated && toState.url === '/login') {
          event.preventDefault();
          window.location.assign("/#!/student");
        }

        if (toState.name !== 'login' && toState.name !== 'forgot' && toState.name !== 'reset' && toState.name !== 'submission') {
          localStorage.setItem('path', toState.name);
        }


        if (typeof toParams === 'object') {
          _.forEach(toParams, function(v, k) {
            localStorage.setItem(k, v);
          })
        }


        if (toState.name !== "dashboard" && toState.name !== "login" && toState.name !== "forgot") {
          $rootScope.currentURL = toState.name.replace('dashboard.', '') + '-page';
        } else {
          $rootScope.currentURL = toState.name.replace('/', '') + '-page';
        }

        //redirect dashboard to student page
        if(toState.name == "dashboard"){
          window.location.assign("/#!/student");
        }


      });

    function pathIsUnprotected(path) {
      return UNPROTECTED_PATHS.indexOf(path) !== -1;
    }

     //history back btn
     $rootScope.goBack = function() {
      window.history.back();
    };

    function storageChange(event) {
      if (event.key === 'logged_in') {
        location.reload();
      }
    }
    window.addEventListener('storage', storageChange, false);

  }




})();
