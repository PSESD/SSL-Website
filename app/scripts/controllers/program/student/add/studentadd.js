(function($) {
    'use strict';

    angular.module('sslv2App')
        .controller('ProgramStudentAddCtrl', ProgramStudentAddCtrl);

    ProgramStudentAddCtrl.$inject = ['$state','ProgramStudentService','$timeout','$stateParams','ProgramService'];

    function ProgramStudentAddCtrl($state,ProgramStudentService,$timeout,$stateParams,ProgramService) {

        var vm = this;
        var id = $stateParams.id;
        vm.placeholder = "Add cohort";
        vm.program = {
            name:''
        }
        jQuery('.datepicker').datepicker();
        vm.submit = submit;
        ProgramService.getById(id)
            .then(function(response){
                vm.program.name = response.data.name;

            },function(error){
                console.log(error);
            });
        ProgramStudentService.getAll()
            .then(function (response) {
                if(response.data.success === true){
                    vm.students = response.data.data;
                }
            },function (error) {
                console.log(error);
            });

        function submit(data){
            var student ={
                active:data.active,
                participation_start_date:data.participation_start_date,
                participation_end_date:data.participation_end_date,
                studentId:data.studentId,
                cohort:[]
            }
            if(_.get(data,"cohort","") === ""){
                student.cohort = [];
            }
            if(data.cohort.length > 0){
                var cohort = [];
                _.forEach(data.cohort,function(v,k){
                    cohort.push(v.text);
                });
                student.cohort = cohort;
            }
            ProgramStudentService.addStudent(id,student)
                .then(function(response){
                        if(response.data.success === true){
                            vm.message = response.data.message;
                            closeMessage(true);
                        }
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
                    $state.go('dashboard.program_student',{id:id},{reload:true});
                },2000);
            }else{
                $timeout(function () {
                    vm.message = "";
                },2000);
            }
        }

    }



})(jQuery);