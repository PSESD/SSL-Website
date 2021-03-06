(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('ProgramEditCtrl', ProgramEditCtrl);

    ProgramEditCtrl.$inject = ['$state', 'ProgramService','$timeout','$stateParams','$filter'];

    function ProgramEditCtrl($state, ProgramService,$timeout,$stateParams,$filter) {

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
                vm.program.created = $filter('date')(_.get(response,"data.created",""), "yyyy/MM/dd");
                vm.program.last_updated =  $filter('date')(_.get(response,"data.last_updated",""), "yyyy/MM/dd");
            },function (error) {
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