(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('ProgramCtrl', ProgramCtrl);

    ProgramCtrl.$inject = ['$state', 'ProgramService','$filter','$sce','$confirm', '$cookies'];

    function ProgramCtrl($state, ProgramService,$filter,$sce,$confirm,$cookies) {

        var vm = this;
        vm.show_program = false;
        vm.message = "";
        vm.deleteProgram = deleteProgram;
        vm.organization_name = $cookies.get('organization_name');
        ProgramService.getAll()
            .then(function(response){
                var data = _.get(response,"data","");
                if(data.success === true && data.total > 0){
                    var listProgram = "";
                    listProgram = _.map(data.data,function(value){
                        value.cohorts = _.map(value.cohorts,function(c){
                            return $sce.trustAsHtml('<span class="label label-primary">'+c+'</span>');
                        }).join(' ');
                        return value;
                    });
                    vm.programs = $filter('orderBy')(listProgram,'name');
                    vm.show_program = true;
                }else{
                    vm.show_program = false;
                }
            },function(error){

            });

        function deleteProgram(id,index){
            $confirm({
              title: 'Delete Program',
              text:'Are you sure you want to delete this record?'
            })
                .then(function(){
                    ProgramService.deleteProgram(id)
                        .then(function(response){
                            if(response.data.success === true){
                                vm.programs.splice(index,1);
                            }
                        },function(error){
                            console.log(error);
                        })
                });
        }
    }

})();
