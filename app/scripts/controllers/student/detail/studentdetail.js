(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('StudentDetailCtrl', StudentDetailCtrl);

    StudentDetailCtrl.$inject = ['$state','StudentService','$stateParams'];

    function StudentDetailCtrl($state,StudentService,$stateParams) {

        var vm = this;
        var id = $stateParams.id;
        init();

        function init(){
            StudentService.getStudentById(id)
                .then(function(response){
                    console.log(response);
                },function (error) {
                    console.log(error);
                })
        }
    }

})();