(function() {
  'use strict';

  angular.module('sslv2App')
    .controller('ForgotCtrl', ForgotCtrl);

  ForgotCtrl.$inject = ['$state','ForgotService','RESOURCES', '$cookies'];

  function ForgotCtrl($state,ForgotService,RESOURCES, $cookies) {

    var vm = this;
    vm.login_greetings = localStorage.getItem("first_name") || "";
    vm.help = {
      templateUrl: 'templates/help.html'
    };

    vm.user = {
      email:"",
      redirect_url:""
    }
    vm.organization_name = $cookies.get('organization_name');
    vm.reset = reset;

    function reset(user) {
      var urlTemp = window.location.origin;
      if(urlTemp.indexOf('.')!== -1){
          var url = urlTemp.split(".");
      }
      var tmp = url[0].split("//");
      var protocol = tmp[0];
      var subdomain = tmp[1];
      var redirect_url = "";
      var callback_url = "";
      if(subdomain !== "cbo"){
          callback_url = protocol+"//"+subdomain+'.'+RESOURCES.CALLBACK_URL;
          redirect_url = protocol+"//"+subdomain+'.'+RESOURCES.ENV;
      }else{
          callback_url = protocol+"//"+RESOURCES.CALLBACK_URL;
          redirect_url = protocol+"//"+subdomain+'.'+RESOURCES.ENV
      }

      user.redirect_url = redirect_url;
      user.callback_url = callback_url;
      ForgotService.resetPassword(user)
      .then(function(response){
        $state.go('submission');
      },function(error){

      });
    }

  }

})();
