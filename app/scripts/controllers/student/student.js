(function($) {
    'use strict';



    angular.module('sslv2App')
        .controller('StudentCtrl', StudentCtrl);

    StudentCtrl.$inject = ['$timeout','StudentService','$filter','$confirm'];

    function StudentCtrl($timeout,StudentService,$filter,$confirm) {

        var vm = this;
        vm.show_user = false;
        var data ="";
        var success = "";
        var student ={};
        var list_of_students =[];
        var list_of_district_options = [];
        var list_of_school_options = [];
        var list_of_trend = [];
        vm.students = "";
        var temp_template_attendance ="";
        var attendance_template = "<dl><dt></dt><dd>Student has missed {latest_month} {latest_month_day} in the latest month of which we have data.</dd><dt></dt><dd>Student has missed {current_academic} {current_academic_day} in the current academic year.</dd><dt></dt><dd>Risk Level:{risk_level}</dd></dl>";
        var trend_template = "<div>{trend}</div>";
        var behavior_template = "<dl><dt></dt><dd>Student has {behavior_month} {incident_month} in the latest term of which we have data.</dd><dt></dt><dd>Student has {behavior_academic} {incident_academic} in the current academic year.</dd></dl>";
        vm.deleteStudent = deleteStudent;
        vm.school_selected = school_selected;
        vm.district_selected = district_selected;
        init();

        function init(){



            vm.selected_schools =[];
            vm.selected_districts =[];
            vm.schools_options = [];
            vm.districts_options = [];



            clearVariables();

            StudentService.getAllStudent()
                .then(function(response){
                    $timeout(getAll(response),500);
                },function(error){
                    console.log(error);
                });

            StudentService.getStudentSummary()
                .then(function(response){
                    $timeout(getSummary(response),500);
                },function(error){
                    console.log(error);
                });

        }
        function school_selected(){
            return function(val){
                if(vm.selected_schools.length > 0){
                    for(var i in vm.selected_schools){
                        if(val.xsre.school_name === vm.selected_schools[i].name){
                            return true;
                        }
                    }
                }else{
                    return true;
                }
           }
        }
        function district_selected(){
            return function(val){
                if(vm.selected_districts.length > 0){
                    for(var i in vm.selected_districts){
                        if(val.school_district === vm.selected_districts[i].name){
                            return true;
                        }
                    }
                }else{
                    return true;
                }
            }
        }
        function deleteStudent(id,index){
            $confirm({text:'Are you sure you want to delete this record?'})
                .then(function(){
                    StudentService.deleteStudent(id)
                        .then(function(response){
                            if(response.data.success === true){
                                vm.students.splice(index,1);
                            }
                        },function(error){
                            console.log(error);
                        })
                });
        }

        function clearVariables(){



            student = {
                id:0,
                address:'',
                addresses:[],
                college_bound:'',
                created:'',
                creator:'',
                district_student_id:'',
                email:'',
                emergency1_email:'',
                emergency1_name:'',
                emergency1_phone:'',
                emergency1_relationship:'',
                emergency2_email:'',
                emergency2_name:'',
                emergency2_phone:'',
                emergency2_relationship:'',
                first_name:'',
                last_name:'',
                last_updated:'',
                organization:'',
                phone:'',
                programs:[],
                school_district:'',
                xsre:{
                    attendance:{
                        month:{
                            count:'',
                            flag:'',
                            type:''
                        },
                        academic:{
                            count:'',
                            flag:'',
                            type:''
                        },
                        template:''
                    },
                    attendance_risk:{
                        day_absent:'',
                        risk_level:'',
                        trend:''
                    },
                    behavior:{
                        month:{
                            count:'',
                            flag:'',
                            type:''
                        },
                        academic:{
                            count:'',
                            flag:'',
                            type:''
                        }
                    },
                    grade_level:'',
                    latest_date:'',
                    latest_date_time:'',
                    on_track_to_graduate:'',
                    school_name:'',
                    school_year:''
                }
            }

        }
        function getAll(response){
            success = _.get(response,"data.success",false);
            data = _.get(response,"data.data","");
            if(success === true && data !== ""){
                var student_profiles = [];
                var single_profile = {};
                _.forEach(data,function(data){
                    clearVariables();
                    student.id = _.get(data,"_id","");
                    student.address = _.get(data,"address","");
                    student.addresses = _.get(data,"addresses","");
                    student.college_bound = _.get(data,"college_bound","");
                    student.created =  $filter('date')(_.get(data,"created",""), "yyyy/MM/dd");
                    student.creator = _.get(data,"creator","");
                    student.district_student_id = _.get(data,"district_student_id","");
                    student.email = _.get(data,"email","");
                    student.emergency1_email = _.get(data,"emergency1_email","");
                    student.emergency1_name = _.get(data,"emergency1_name","");
                    student.emergency1_phone = _.get(data,"emergency1_phone","");
                    student.emergency1_relationship = _.get(data,"emergency1_relationship","");
                    student.emergency2_email = _.get(data,"emergency2_email","");
                    student.emergency2_name = _.get(data,"emergency2_name","");
                    student.emergency2_phone = _.get(data,"emergency2_phone","");
                    student.emergency2_relationship = _.get(data,"emergency2_relationship","");
                    student.first_name = _.get(data,"first_name","");
                    student.last_name = _.get(data,"last_name","");
                    student.last_updated = $filter('date')(_.get(data,"last_updated",""), "yyyy/MM/dd");
                    student.organization = _.get(data,"organization","");
                    student.phone = _.get(data,"phone","");
                    student.programs = _.get(data,"programs",[]);
                    student.school_district = _.get(data,"school_district","");
                    student.xsre.grade_level = _.get(data,"xsre.gradeLevel","");
                    student.xsre.latest_date = $filter('date')(_.get(data,"latestDate",""), "yyyy/MM/dd");
                    student.xsre.latest_date_time = $filter('date')(_.get(data,"latestDateTime",""), "yyyy/MM/dd");
                    student.xsre.on_track_to_graduate = _.get(data,"xsre.onTrackToGraduate","");
                    student.xsre.school_name = _.get(data,"xsre.schoolName","");
                    student.xsre.school_year = _.get(data,"xsre.schoolYear","");
                    single_profile = {
                        id:student.id,
                        value:"#/student/"+student.id+"/detail",
                        on_track_graduate : _.get(data,"xsre.onTrackToGraduate","")
                    }
                    student_profiles.push(single_profile);
                    _.forEach(data.xsre.attendanceRiskFlag,function(value){
                        student.xsre.attendance_risk.day_absent = value.daysAbsent;
                        student.xsre.attendance_risk.risk_level = value.riskLevel;
                        student.xsre.attendance_risk.trend = value.trend;
                    });

                    _.forEach(_.get(data,"xsre.behaviorCount",[]),function(value){
                        if(value.type === "lastMonth"){
                            student.xsre.behavior.month.count = value.count;
                            student.xsre.behavior.month.flag = value.flag.toLowerCase();
                            student.xsre.behavior.month.type = value.type;

                        }else if(value.type === "currentAcademicYear"){
                            student.xsre.behavior.academic.count = value.count;
                            student.xsre.behavior.academic.flag = value.flag.toLowerCase();
                            student.xsre.behavior.academic.type = value.type;
                        }
                    });
                    _.forEach(_.get(data,"xsre.attendanceCount",[]),function(value,key){
                        if(key === 0){
                            temp_template_attendance = attendance_template;
                        }
                        if(value.type === "lastMonth"){
                            var day="";
                            student.xsre.attendance.month.count = value.count;
                            student.xsre.attendance.month.flag = value.flag.toLowerCase();
                            student.xsre.attendance.month.type = value.type;
                            if(value.count === 1){
                                day = "day";
                            }else{
                                day = "days";
                            }
                            temp_template_attendance = _.replace(temp_template_attendance,'{latest_month}',value.count);
                            temp_template_attendance = _.replace(temp_template_attendance,'{latest_month_day}',day);

                        }else if(value.type === "currentAcademicYear"){
                            var day="";
                            student.xsre.attendance.academic.count = value.count;
                            student.xsre.attendance.academic.flag = value.flag.toLowerCase();
                            student.xsre.attendance.academic.type = value.type;
                            if(value.count === 1){
                                day = "day";
                            }else{
                                day = "days";
                            }
                            temp_template_attendance = _.replace(temp_template_attendance,'{current_academic}',value.count);
                            temp_template_attendance = _.replace(temp_template_attendance,'{current_academic_day}',day);
                        }
                        if(key === 1){
                            student.xsre.attendance.template = temp_template_attendance;
                        }
                    });
                    list_of_district_options.push(student.school_district);
                    list_of_school_options.push(student.xsre.school_name);
                    list_of_students.push(student);
                });
                vm.students = list_of_students;
                list_of_district_options = _.uniqBy(list_of_district_options,function(value){
                    return value;
                });
                list_of_school_options = _.uniqBy(list_of_school_options,function(value){
                    return value;
                });
                _.forEach(list_of_district_options,function(value){
                    vm.districts_options.push({
                        id:value,
                        name:value
                    })
                });
                _.forEach(list_of_school_options,function(value){
                    if(value.length !== 0){
                        vm.schools_options.push({
                            id:value,
                            name:value
                        })
                    }
                });
                if(sessionStorage.getItem("student_profiles")!== null){
                    sessionStorage.removeItem("student_profiles");
                }
                sessionStorage.setItem("student_profiles",JSON.stringify(student_profiles));
                vm.show_user = true;

            }else{
                vm.show_user = false;
            }

        }
        function getSummary(response){

        }
    }
})(jQuery);