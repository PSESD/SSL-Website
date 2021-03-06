(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('ReportCtrl', ReportCtrl);

    ReportCtrl.$inject = ['$state','$scope','ReportService','$timeout'];

    function ReportCtrl($state,$scope,ReportService,$timeout) {

        var vm = this;
        vm.changePrograms = changePrograms;
        vm.report = {
            total_student:0,
            total_district:0,
            total_school:0,
            total_student_word:0,
            total_district_word:0,
            total_school_word:0,
            total_program_info:0,
            total_district_info:0,
            total_cohort_info:0,
            program_data:[],
            district_data:[],
            cohort_data:[],
            select_program:[],
            select_district:[],
            select_cohort:[]
        }

        vm.programs = [{
            id:1,
            name:"Program 1"
        },{
            id:2,
            name:"Program 2"
        }];
        vm.selected_programs = [];
        vm.districts = [];
        vm.selected_districts = [];
        vm.listOfCohorts = [];
        vm.cohorts=[];
        vm.selected_cohorts=[];

        function changePrograms(){

        }

        ReportService.getStudentFilters()
            .then(function(response){

                if(response.data.success === true){

                }else{
                    vm.message = _.get(response,'data.error.code',"An error has occured");
                    closeMessage();
                }
            },function(error){

            });

        function closeMessage()
        {
            $timeout(function(){
              vm.message ="";
            },2000)
        }

    }

})();