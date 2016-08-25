(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('ProgramEditCtrl', ProgramEditCtrl);

    ProgramEditCtrl.$inject = ['$state', 'ProgramService','$timeout','$stateParams'];

    function ProgramEditCtrl($state, ProgramService,$timeout,$stateParams) {

        var vm = this;
        vm.message = "";
        vm.program = {
            name:'',
            created:'',
            last_updated:''
        }

        vm.submit = submit;

        ProgramService.getById($stateParams.id)
            .then(function (response) {
                vm.program.name = _.get(response,"data.name","");
                vm.program.created = _.get(response,"data.created","");
                vm.program.last_updated = _.get(response,"data.last_updated","");
            },function (error) {
                console.log(error);
            });

        function submit(data){
            if(data.name === ""){
                vm.message = "Program name is required";
                closeMessage(false);
            }else
            {
                ProgramService.updateProgram($stateParams.id,data)
                    .then(function(response){
                        if(response.data.success === true){
                            vm.message = response.data.message;
                            closeMessage(true);
                        }
                    },function(error){
                        console.log(error);
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