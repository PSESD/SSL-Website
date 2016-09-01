(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('StudentEditCtrl', StudentEditCtrl);

    StudentEditCtrl.$inject = ['$state','StudentService','$stateParams','$filter','RESOURCES','$timeout'];

    function StudentEditCtrl($state,StudentService,$stateParams,$filter,RESOURCES,$timeout) {

        var vm = this;
        var id = $stateParams.id;
        var profile="";
        vm.student="";
        vm.submit = submit;
        vm.list_of_school_district = RESOURCES.DISTRICT;
        vm.list_of_relationships = RESOURCES.RELATIONSHIP;
        profile = {
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
                    profile.district_student_id = response.data.district_student_id;
                    profile.emergency1_phone = response.data.emergency1_phone;
                    profile.emergency2_phone = response.data.emergency2_phone;
                    profile.last_updated = $filter('date')(_.get(response,"data.last_updated",""), "yyyy/MM/dd");
                    profile.last_updated_by = response.data.last_updated_by;
                    profile.organization = response.data.organization;
                    profile.phone = response.data.phone;
                    profile.programs = response.data.programs;
                    profile.school_district = response.data.school_district;
                    vm.student = profile;
                },function(error){
                    console.log(error);
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
                    console.log(error);
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