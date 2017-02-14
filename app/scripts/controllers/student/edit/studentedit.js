(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('StudentEditCtrl', StudentEditCtrl);

    StudentEditCtrl.$inject = ['$state','StudentService','$stateParams','$filter','RESOURCES','$timeout'];

    function StudentEditCtrl($state,StudentService,$stateParams,$filter,RESOURCES,$timeout) {

        var vm = this;
        var id = $stateParams.id;

        vm.student="";
        vm.submit = submit;
        vm.list_of_school_district = RESOURCES.DISTRICT;
        vm.list_of_relationships = RESOURCES.RELATIONSHIP;
        var profile = {
            first_name:'',
            last_name:'',
            addresses:[],
            college_bound:'',
            created:'',
            creator:'',
            district_student_id:'',
            emergency1_phone:'',
            emergency2_phone:'',
            last_updated:'',
            last_updated_by:'',
            organization:'',
            phone:'',
            programs:[],
            school_district:''
        }
        init();
        function init(){
            StudentService.getById(id)
                .then(function(response){
                    profile.first_name = response.data.first_name;
                    profile.last_name = response.data.last_name;
                    profile.addresses = response.data.addresses;
                    profile.college_bound = response.data.college_bound;
                    profile.created = $filter('date')(_.get(response,"data.created",""), "yyyy/MM/dd");
                    profile.creator = response.data.creator;
                    profile.email = response.data.email;
                    profile.address = response.data.address;
                    profile.emergency1_email = response.data.emergency1_email;
                    profile.emergency1_email = response.data.emergency1_email;
                    profile.emergency1_name = response.data.emergency1_name;
                    profile.emergency1_phone = response.data.emergency1_phone;
                    profile.emergency1_relationship = response.data.emergency1_relationship;
                    profile.emergency2_email = response.data.emergency2_email;
                    profile.emergency2_name = response.data.emergency2_name;
                    profile.emergency2_phone = response.data.emergency2_phone;
                    profile.emergency2_relationship = response.data.emergency2_relationship;
                    profile.last_updated = $filter('date')(_.get(response,"data.last_updated",""), "yyyy/MM/dd");
                    profile.last_updated_by = response.data.last_updated_by;
                    profile.organization = response.data.organization;
                    profile.phone = response.data.phone;
                    profile.programs = response.data.programs;
                    profile.school_district = response.data.school_district;
                    profile.district_student_id = response.data.district_student_id;
                    vm.student = profile;

                },function(error){

                })
        }

        function submit(data){
            StudentService.updateStudent(id,data)
                .then(function(response){
                    if(response.data.success === true){
                        vm.message = response.data.message;
                        closeMessage();
                    }
                },function(error){

                });
        }

        function closeMessage(){
            $timeout(function(){
                vm.message = "";
                $state.go('dashboard.student',{},{reload:true});
            },2000)
        }

    }
})();