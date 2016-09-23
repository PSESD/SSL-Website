(function() {
    'use strict';

    angular
        .module('sslv2App')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {

        $stateProvider
            .state('dashboard.student', {
                url: "^/student",
                templateUrl: "views/student.html",
                controller:'StudentCtrl',
                controllerAs:'vm',
                resolve:{
                    listStudents:['$q','StudentService',function($q,StudentService){
                        var deferred = $q.defer();
                        StudentService.getAllStudent()
                            .then(function(response){
                                deferred.resolve(response);
                            },function(error){
                                deferred.reject(error);
                            })
                        return deferred.promise;
                    }],
                    listSummary:['$q','StudentService',function($q,StudentService){
                        var deferred = $q.defer();
                        StudentService.getStudentSummary()
                            .then(function(response){
                                deferred.resolve(response);
                            },function(error){
                                deferred.reject(error);
                            })
                        return deferred.promise;
                    }],
                }
            });

    }

})();