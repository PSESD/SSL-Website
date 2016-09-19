(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('StudentAddCtrl', StudentAddCtrl);

    StudentAddCtrl.$inject = ['$state','RESOURCES','StudentService','$timeout'];

    function StudentAddCtrl($state,RESOURCES,StudentService,$timeout) {

        var vm = this;
        vm.message = "";
        vm.submit = submit;
        vm.list_of_school_district = RESOURCES.DISTRICT;
        vm.list_of_relationships = RESOURCES.RELATIONSHIP;

        function submit(student){
            StudentService.addStudent(student)
                .then(function(response){
                    if(response.data.success === true){
                        vm.message = response.data.message;
                        closeMessage();
                    }
                },function (error) {

                });
        }
        function closeMessage(){
            $timeout(function(){
                vm.message = "";
                $state.go('dashboard.student',{},{reload:true});
            },200)
        }
    }

})();