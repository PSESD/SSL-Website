(function() {
    'use strict';

    angular.module('sslv2App')
        .directive('attendance', attendance);

    function attendance() {
        var directive={
            link:link,
            template:"<div uib-popover-template='{{url}}' popover-triger='{{trigger}}' popover-placement='left'><span class='label label-{{label}}'>{{info}}</span></div>",
            restrict:'E',
            scope:{
                url:'@',
                label:'@',
                info:'@',
                academic:'@',
                month:'@',
                trigger:'@'
            }
        }
        return directive;

        function link(scope,element,attrs){
            if(attrs.academic === 1){

            }else if(attrs.academic >= 0){

            }
            if(attrs.month === 1){

            }else if(attrs.month >= 0){

            }
        }
    }

})();