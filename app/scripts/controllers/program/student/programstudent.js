(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('ProgramStudentCtrl', ProgramStudentCtrl);

    ProgramStudentCtrl.$inject = ['ProgramService','ProgramStudentService','$stateParams','$sce','$filter'];

    function ProgramStudentCtrl(ProgramService,ProgramStudentService,$stateParams,$sce,$filter) {

        var vm = this;
        vm.message = "";
        vm.program_students = [];
        vm.program={
            name:''
        }

        ProgramService.getById($stateParams.id)
            .then(function (response) {
                vm.program.name = response.data.name;
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
                }
            },function (error) {
                console.log(error);
            });
    }



})();