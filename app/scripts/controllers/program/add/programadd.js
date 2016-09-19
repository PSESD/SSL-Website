(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('ProgramAddCtrl', ProgramAddCtrl);

    ProgramAddCtrl.$inject = ['$state', 'ProgramService','$timeout'];

    function ProgramAddCtrl($state, ProgramService,$timeout) {

        var vm = this;
        vm.message = "";
        vm.program = {
            name:''
        }
        vm.submit = submit;

        function submit(data){
            if(data.name === ""){
                vm.message = "Program name is required";
                closeMessage(false);
            }else
                {
                ProgramService.addProgram(data)
                    .then(function(response){

                        if(response.data.success === true){
                            vm.message = response.data.message;
                            closeMessage(true);
                        }
                    },function(error){
                    });
            }

        }

        function closeMessage(status){
            $timeout(function(){
                vm.message = "";
                if(status === true){
                    $state.go('dashboard.program',{},{reload:true});
                }
            },2000);
        }
    }

})();