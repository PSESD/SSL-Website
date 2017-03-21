(function() {
  'use strict';

  angular.module('sslv2App')
    .controller('ForgotCtrl', ForgotCtrl);

  ForgotCtrl.$inject = ['$state','ForgotService','ENV', '$cookies'];

  function ForgotCtrl($state,ForgotService,ENV, $cookies) {

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

      //override URL parsing for local development
      if (!url && ENV.HOSTNAME == "localhost") {
        url = [ENV.DEV_PROTOCOL_AND_SUBDOMAIN];
      }
      var tmp = url[0].split("//");
      var protocol = tmp[0];
      var subdomain = tmp[1];
      var redirect_url = "";
      var callback_url = "";
      if(subdomain !== "cbo"){
          callback_url = protocol+"//"+subdomain+'.'+ ENV.CALLBACK_URL;
          redirect_url = protocol+"//"+subdomain+'.'+ ENV.ENV;
      }else{
          callback_url = protocol+"//"+ ENV.CALLBACK_URL;
          redirect_url = protocol+"//"+subdomain+'.'+ENV.ENV
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
