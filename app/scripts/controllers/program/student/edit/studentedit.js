(function($) {
    'use strict';

    angular.module('sslv2App')
        .controller('ProgramStudentEditCtrl', ProgramStudentEditCtrl);

    ProgramStudentEditCtrl.$inject = ['$state','ProgramStudentService','$timeout','$stateParams','ProgramService','$filter'];

    function ProgramStudentEditCtrl($state,ProgramStudentService,$timeout,$stateParams,ProgramService,$filter) {

        var vm = this;
        var id = $stateParams.id;
        var student_id = $stateParams.student_id;
        var listCohorts = [];
        vm.placeholder = "Add cohort";
        vm.program = {
            name:''
        }
        vm.student={
            name:'',
            active:'',
            participation_start_date:'',
            participation_end_date:'',
            cohort:''
        }
        jQuery('.datepicker').datepicker();
        vm.submit = submit;
        ProgramService.getById(id)
            .then(function(response){
                vm.program.name = response.data.name;
            },function(error){
                console.log(error);
            });

        ProgramStudentService.getProgramStudent(id,student_id)
            .then(function(response){
                vm.student.name = response.data.first_name+' '+response.data.last_name;
                var student ={

                }
                _.forEach(response.data.programs,function(v,k){
                    if(id === v.program){
                        vm.student.active = v.active;
                        vm.student.participation_start_date =  $filter('date')(v.participation_start_date, "yyyy/MM/dd");
                        vm.student.participation_end_date = $filter('date')(v.participation_end_date, "yyyy/MM/dd");
                        _.each(v.cohort,function(v){
                            var item = {
                                text:v
                            }
                            listCohorts.push(item);
                        });
                        vm.student.cohort = listCohorts;
                    }
                });
            },function(error){

            })

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
            ProgramStudentService.updateProgramStudent(id,student_id,student)
                .then(function(response){

                    if(response.data.success === true){
                        vm.message = response.data.message;
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