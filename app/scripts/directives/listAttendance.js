(function() {
    'use strict';

    angular.module('sslv2App')
        .directive('listAttendance', listAttendance);

    function listAttendance() {
        var directive={
            template:'<div class="value detail-item {{value}}" popover-placement="right" popover-trigger="mouseenter" uib-popover-template="url"></div>',
            scope:{
                url:'@',
                value:'@'
            },
            restrict:'E'
        }
        return directive;
    }
})();