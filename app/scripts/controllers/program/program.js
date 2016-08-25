(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('ProgramCtrl', ProgramCtrl);

    ProgramCtrl.$inject = ['$state', 'ProgramService','$filter','$sce'];

    function ProgramCtrl($state, ProgramService,$filter,$sce) {

        var vm = this;
        vm.message = "";
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
                }
            },function(error){
            console.log(error);
            });
    }

})();