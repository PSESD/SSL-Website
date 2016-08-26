(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('ProgramStudentAddCtrl', ProgramStudentAddCtrl);

    ProgramStudentAddCtrl.$inject = ['$state','ProgramStudentService','$timeout','$stateParams'];

    function ProgramStudentAddCtrl($state,ProgramStudentService,$timeout,$stateParams) {

        var vm = this;
        var id = $stateParams.id;

        vm.submit = submit;

        function submit(data){

            ProgramStudentService.addStudent(id,data)
                .then(function(response){

                    if(response.data.success === true){
                        closeMessage(true);
                    }

                },function(error){
                    console.log(error);
                });

        }

        function closeMessage(status){
            if(status === true){
                $timeout(function () {
                    vm.message = "";
                    $state.go('',{},{reload:true});
                },2000);
            }else{
                $timeout(function () {
                    vm.message = "";
                },2000);
            }
        }

    }



})();