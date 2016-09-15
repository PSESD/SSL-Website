(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('ProgramStudentCtrl', ProgramStudentCtrl);

    ProgramStudentCtrl.$inject = ['ProgramService','ProgramStudentService','$stateParams','$sce','$filter','$confirm'];

    function ProgramStudentCtrl(ProgramService,ProgramStudentService,$stateParams,$sce,$filter,$confirm) {

        var vm = this;
        vm.show_program_student = false;
        vm.id = $stateParams.id
        vm.message = "";
        vm.program_students = [];
        vm.program={
            name:''
        }
        vm.deleteStudent = deleteStudent;

        ProgramService.getById($stateParams.id)
            .then(function (response) {
                vm.program = response.data;
            },function(error){
                console.log(error);
            });

        ProgramStudentService.getById($stateParams.id)
            .then(function(response){
                var data = _.get(response,"data","");
                if(data.success === true){
                    angular.forEach(data.data,function(val,key){
                        var cohort = "";
                        angular.forEach(val.programs,function(v,k){
                            if(v.program === $stateParams.id){
                                cohort = _.map(v.cohort,function(c){
                                    return $sce.trustAsHtml('<span class="label label-primary">'+c+'</span>');
                                }).join(' ');
                                var student = {
                                    "id":val._id,
                                    "name":val.first_name+' '+val.last_name,
                                    "active":v.active,
                                    "start_date":v.participation_start_date,
                                    "end_date":v.participation_end_date,
                                    "cohort":cohort
                                }
                                vm.program_students.push(student);
                                vm.program_students = $filter('orderBy')(vm.program_students,"name");
                            }
                        });
                    });
                    vm.show_program_student = true;
                }else{
                    vm.show_program_student = false;
                }
            },function (error) {
                console.log(error);
            });
        function deleteStudent(id,index){
            $confirm({text:'Are you sure you want to delete this record?'})
                .then(function(){
                    ProgramStudentService.deleteStudent($stateParams.id,id)
                        .then(function(response){
                            if(response.data.success === true){
                                vm.program_students.splice(index,1);
                            }
                        },function(error){
                            console.log(error);
                        })
                });
        }
    }



})();