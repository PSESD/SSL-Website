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
      'ui.codemirror'

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

  configFunction.$inject = ['$httpProvider','$urlRouterProvider','gravatarServiceProvider','KeepaliveProvider','IdleProvider'];

  function configFunction($httpProvider,$urlRouterProvider,gravatarServiceProvider,KeepaliveProvider,IdleProvider) {

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
    // IdleProvider.idle(5); // in seconds
    // IdleProvider.timeout(10); // in seconds
    // KeepaliveProvider.interval(5); // in seconds
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