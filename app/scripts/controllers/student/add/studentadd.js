(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('StudentAddCtrl', StudentAddCtrl);

    StudentAddCtrl.$inject = ['$state','RESOURCES','StudentService','$timeout'];

    function StudentAddCtrl($state,RESOURCES,StudentService,$timeout) {

        var vm = this;
        vm.message = "";
        vm.submit = submit;
        vm.student = {
            first_name:'',
            last_name:'',
            school_district:'',
            district_student_id:'',
            college_bound:'No',
            phone:'',
            email:'',
            address:'',
            emergency1_name:'',
            emergency1_relationship:'',
            emergency1_email:'',
            emergency1_phone:'',
            emergency2_name:'',
            emergency2_relationship:'',
            emergency2_email:'',
            emergency2_phone:''

        }
        vm.list_of_school_district = RESOURCES.DISTRICT;
        vm.list_of_relationships = RESOURCES.RELATIONSHIP;
        function submit(student){
            StudentService.addStudent(student)

                .then(function(response){
                    if(response.data.success === true){
                        vm.message = response.data.message;
                        closeMessage();
                    }else{
                      vm.message = response.data.error;
                    }
                },function (error) {

                });
        }
        function closeMessage(){
            $timeout(function(){
                vm.message = "";
                $state.go('dashboard.student',{},{reload:true});
            },4000)
        }
    }

})();
