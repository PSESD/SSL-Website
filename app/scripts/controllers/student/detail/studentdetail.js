(function($) {
    'use strict';

    angular.module('sslv2App')
        .controller('StudentDetailCtrl', StudentDetailCtrl);

    StudentDetailCtrl.$inject = ['$state','$scope','StudentService','$stateParams','$interval','$timeout','RESOURCES'];

    function StudentDetailCtrl($state,$scope,StudentService,$stateParams,$interval,$timeout,RESOURCES) {

        var vm = this;
        vm.show_loading = true;
        var list_attendances = {};
        var selectedObj;
        vm.data = "";
        var listSelectedObj = [];
        var enrollment = "";
        vm.attandance_show = false;
        vm.show_update = true;
        vm.show_general = false;
        vm.show_attendance = false;
        vm.show_transcript = false;
        vm.show_assessment = false;
        vm.program_participation = false;
        vm.show_enrollment = false;
        vm.show_xsre = false;
        vm.listOfCalendar = [];
        vm.listClasses = [];
        var isFirstTime = true;
        var momentjs = moment();
        var id = $stateParams.id;
        var student = "";
        var data ="";
        var template = "<div class='attendance-modal'><dl><dt>{date}</dt><dd></dd><dt>Reason:</dt><dd>{reason}</dd><dt>Description:</dt><dd>{description}</dd></dl></div>";
        vm.changeStatus = changeStatus;
        vm.student_id = $stateParams.id;
        vm.list_of_details = "";
        vm.selectedMonth ="";
        vm.expand = expand;
        vm.show_detail = false;
        vm.list_programs = [];
        var listOfYears = [];
        vm.xsre = xsre;
        vm.updateData = updateData;
        vm.options = {
            //lineWrapping : true,
            height: '500px',
            tabSize: 6,
            lineNumbers: true,
            //readOnly: 'nocursor',
            theme: 'monokai',
            mode: 'xml',
            extraKeys: {"Alt-F": "findPersistent"}

        }
        student = {
            embedded:{
                programs:[],
                users:[]
            },
            last_update:'',
            report_date:'',
            personal:{
                address:'',
                college_bound:'',
                days_absent:'',
                days_in_attendance:'',
                eligibility_status:'',
                email:'',
                emergency1:{
                    email:'',
                    mentor:'',
                    name:'',
                    phone:'',
                    relationship:''
                },
                emergency2:{
                    email:'',
                    mentor:'',
                    name:'',
                    phone:'',
                    relationship:''
                },
                enrollment_status:'',
                first_name:'',
                ideal_indicator:'',
                last_name:'',
                middle_name:'',
                phone:'',
                school_district:'',
                school_year:'',
                section_504_status:'',
                summary:{
                    attendance_count:[],
                    behavior_count:[],
                    date:{
                        latest:'',
                        max:'',
                        min:''
                    },
                    risk_flag:[]
                },
                xsre:{
                    address:'',
                    demographics:{
                        birth_date:'',
                        hispanic_latino_ethnicity:'',
                        races:[],
                        sex:''
                    },
                    email:{},
                    enrollment:{
                        enrollment_status:'',
                        enrollment_status_description:'',
                        entry_date:'',
                        exit_date:'',
                        grade_level:'',
                        lea_ref_id:'',
                        membership_type:'',
                        projected_graduation_year:'',
                        school_name:'',
                        school_ref_id:'',
                        school_year:''
                    },
                    languages:{},
                    local_id:'',
                    other_emails:[],
                    other_enrollments:[],
                    other_phone_numbers:[],
                    phone_number:{}
                }
            },
            transcript:{
                data:[],
                source:{
                    academic_summary:{
                        class_rank:'',
                        cumulative_gpa:'',
                        gpa_scale:'',
                        term_credits_attempted:'',
                        term_credits_earned:'',
                        term_weighted_gpa:'',
                        total_credits_attempted:'',
                        total_credits_earned:''
                    },
                    credits:'',
                    grade_level:'',
                    info:{
                        grade_level:'',
                        total_attempted:'',
                        total_earned:''
                    },
                    subject:[],
                    subject_values:[],
                    total_credits_attempted:'',
                    total_credits_earned:'',
                    total_cumulative_gpa:'',
                    transcript_term:{
                        courses:[],
                        school:{
                            lea_ref_id:'',
                            local_id:'',
                            school_name:''
                        },
                        school_year:''
                    }
                }
            }
        }
        vm.changeYear = changeYear;
        vm.checkDate = checkDate;
        vm.display = display;
        vm.closeMonthDetail = closeMonthDetail;
        vm.expandWeek = expandWeek;

        function expandWeek(filter,idx) {
            document.querySelector('#attendance').scrollIntoView({
              behavior: 'smooth'
            });
            var selected_month = _.filter(list_attendances.list_weeks,function (v) {
                return v.month === filter;
            });
            var header = ".header"+idx;
            var detail = "#tabs-"+idx;
            vm.selectedMonth = selected_month[0];
            vm.month_name = selected_month[0].name;
            vm.show_detail = true;
            $timeout(function () {
                if(jQuery(header).hasClass('collapsed') === true){
                    jQuery(header).removeClass('collapsed');
                    jQuery(detail).addClass('in');
                }
            },100);


        }

        function closeMonthDetail() {
            vm.show_detail = false;
        }
        function display(item) {
            return !item;
        }
        function updateData(){
            vm.show_update = false;
            var year = _.get(vm.student.selected_years,'id',listOfYears[0].id);
            StudentService.deleteXsre(id)
                .then(function(){
                    loadGeneral(id);
                    StudentService.deleteAttendance(id)
                        .then(function(){
                            StudentService.getAttendanceByYear(id,year)
                                .then(function(response){
                                    var data = _.get(response,'data.info.data',[]);
                                    //loadAttendance(data);
                                    vm.show_update = true;
                                },function(error){
                                })
                        },function(){

                        });
                },function(error){


                });
        }
        function expand(filter) {

            document.querySelector('#attendance').scrollIntoView({
              behavior: 'smooth'
            });
            var selected_month = _.filter(list_attendances.list_weeks,function (v) {
                return v.month === filter;
            });
            vm.selectedMonth = selected_month[0];
            vm.month_name = selected_month[0].name;
            vm.show_detail = true;
        }
        function renderCalendar(data){
            _.forEach(data,function(month){
                _.forEach(month.list_months.reverse(),function(v){
                    var month = parseInt(v.month)-1;
                    var clonedMoment = momentjs.clone();
                    var moment = _removeTime(clonedMoment.set({'year':v.year,'month':month}));
                    var month = moment.clone();
                    var start = moment.clone();
                    start.date(1);
                    _removeTime(start.day(0));
                    if(isFirstTime === true){
                        vm.listOfCalendar.push(
                            {
                                'data':_buildMonth(start,month),
                                'name':moment,
                                'show':true,
                                'listClassName':'',
                                'isActive':false
                            });
                    }
                });
                $timeout(function(){
                    var object = null;
                    _.forEach(month.list_events,function(v){

                        object = jQuery('.missed-late-class-container .late-class').html();
                        if(object != undefined){
                            _.forEach(v.event,function(value){
                                var set_date = new Date(v.date);
                                //console.log(value,v.date,jQuery("#"+moment(v.date).month(set_date.getMonth()).format("YYYY-M-DD")+" .missed-day"));
                                if(value == 'missed_day'){
                                    jQuery("#"+moment(v.date).month(set_date.getMonth()).format("YYYY-M-DD")+" .missed-day").removeClass('hide');
                                }else{
                                    if(value == 'late_to_class'){
                                        jQuery("#"+moment(v.date).month(set_date.getMonth()).format("YYYY-M-DD")+" .late-class").removeClass('hide');
                                    }
                                    if(value == 'missed_class'){
                                        jQuery("#"+moment(v.date).month(set_date.getMonth()).format("YYYY-M-DD")+" .missed-class").removeClass('hide');
                                    }
                                }
                            });
                        }
                    });
                },2000);
            });

        }
        function changeYear(){


            var current_months = _.filter(list_attendances.calendars,function (v) {
                return v.years === vm.selected_years;
            });
            while(vm.listOfCalendar.length>0){
                vm.listOfCalendar.pop();
            }

            renderCalendar(current_months);

            vm.show_detail = false;

            jQuery('.month-detail > .panel-group > .panel-default > div.panel-heading').each(function(i, item) { jQuery(item).hasClass('collapsed') == false ? jQuery(item).addClass('collapsed') : null; });
            jQuery('.month-detail > .panel-group > .panel-default > div.panel-collapse.collapse.in').removeClass('in');

        }

        if($stateParams.debug === "true"){
            vm.show_xsre = true;
        }else if($stateParams.debug === undefined){
            vm.show_xsre = false;
        }

        init();
        loadGeneral(id);

        function loadGeneral(id){
            StudentService.getStudentById(id)
                .then(function(response){
                    if(response.data.success === true){
                            vm.show_loading = false;
                            var list_program_years =[];
                            var list_program_participation = [];
                            var data = _.get(response,'data.info',"");
                            student.embedded.programs = _.get(data,'_embedded.programs',"");
                            student.embedded.users = _.get(data,'_embedded.users',"");
                            student.last_update = _.get(data,'lastUpdated',"");
                            student.report_date = _.get(data,'reportDate',"");
                            student.local_id = _.get(data,'localId',"");
                            student.personal.address = _.get(data,'personal.address',"");
                            student.personal.college_bound = _.get(data,'personal.collegeBound',"");
                            student.personal.days_absent = _.get(data,'personal.daysAbsent',"");
                            student.personal.days_in_attendance = _.get(data,'personal.daysInAttendance',"");
                            student.personal.eligibility_status = _.get(data,'personal.eligibilityStatus',"");
                            student.personal.email = _.get(data,'personal.email',"");
                            student.personal.emergency1.email = _.get(data,'personal.emergency1.email',"");
                            student.personal.emergency1.mentor = _.get(data,'personal.emergency1.mentor',"");
                            student.personal.emergency1.name = _.get(data,'personal.emergency1.name',"");
                            student.personal.emergency1.phone = _.get(data,'personal.emergency1.phone',"");
                            student.personal.emergency1.relationship = _.get(data,'personal.emergency1.relationship',"");
                            student.personal.emergency2.email = _.get(data,'personal.emergency2.email',"");
                            student.personal.emergency2.mentor = _.get(data,'personal.emergency2.mentor',"");
                            student.personal.emergency2.name = _.get(data,'personal.emergency2.name',"");
                            student.personal.emergency2.phone = _.get(data,'personal.emergency2.phone',"");
                            student.personal.emergency2.relationship = _.get(data,'personal.emergency2.relationship',"");
                            student.personal.enrollment_status = _.get(data,'personal.enrollmentStatus',"");
                            student.personal.first_name = _.get(data,'personal.firstName',"");
                            student.personal.last_name = _.get(data,'personal.lastName',"");
                            student.personal.idea_indicator = _.get(data,'personal.ideaIndicator',"");
                            student.personal.middle_name = _.get(data,'personal.middleName',"");
                            student.personal.phone = _.get(data,'personal.phone',"");
                            student.personal.school_district = _.get(data,'personal.schoolDistrict',"");
                            student.personal.school_year = _.get(data,'personal.schoolYear',"");
                            student.personal.section_504_status = _.get(data,'personal.section504Status',"");
                            student.personal.summary.attendance_count = _.get(data,'personal.summary.attendanceCount',"");
                            student.personal.summary.behavior_count = _.get(data,'personal.summary.behaviorCount',"");
                            student.personal.summary.date = _.get(data,'personal.summary.date',"");
                            student.personal.summary.risk_flag = _.get(data,'personal.summary.riskFlag',"");
                            student.personal.xsre.address = _.get(data,'personal.xSre.address',"");
                            student.personal.xsre.demographics.birth_date = _.get(data,'personal.xSre.demographics.birthDate',"");
                            student.personal.xsre.demographics.hispanic_latino_ethnicity = _.get(data,'personal.xSre.demographics.hispanicLatinoEthnicity',"");
                            if(data.personal.xSre.demographics.races.length > 0){
                                student.personal.xsre.demographics.races = data.personal.xSre.demographics.races.join();
                            }else{
                                if(data.personal.xSre.demographics.races.length === 0){
                                    student.personal.xsre.demographics.races = '';
                                }else{
                                    student.personal.xsre.demographics.races = _.get(data,'personal.xSre.demographics.races',"");
                                }
                            }
                            student.personal.xsre.demographics.sex = _.get(data,'personal.xSre.demographics.sex',"");
                            student.personal.xsre.email = _.get(data,'personal.xSre.email',"");
                            student.personal.xsre.enrollment.enrollment_status = _.get(data,'personal.xSre.enrollment.enrollmentStatus',"");
                            student.personal.xsre.enrollment.enrollment_status_description = _.get(data,'personal.xSre.enrollment.enrollmentStatusDescription',"");
                            student.personal.xsre.enrollment.entry_date = _.get(data,'personal.xSre.enrollment.entryDate',"");
                            student.personal.xsre.enrollment.exit_date = _.get(data,'personal.xSre.enrollment.exitDate',"");
                            student.personal.xsre.enrollment.grade_level = _.get(data,'personal.xSre.enrollment.gradeLevel',"");
                            student.personal.xsre.enrollment.lea_ref_id = _.get(data,'personal.xSre.enrollment.leaRefId',"");
                            student.personal.xsre.enrollment.membership_type = _.get(data,'personal.xSre.enrollment.membershipType',"");
                            student.personal.xsre.enrollment.projected_graduation_year = _.get(data,'personal.xSre.enrollment.projectedGraduationYear',"");
                            student.personal.xsre.enrollment.school_name = _.get(data,'personal.xSre.enrollment.schoolName',"");
                            student.personal.xsre.enrollment.school_ref_id = _.get(data,'personal.xSre.enrollment.schoolRefId',"");
                            student.personal.xsre.enrollment.school_year = _.get(data,'personal.xSre.enrollment.schoolYear',"");
                            student.personal.xsre.languages = _.get(data,'personal.xSre.languages',"");
                            student.personal.xsre.local_id = _.get(data,'personal.xSre.localId',"");
                            student.personal.xsre.other_emails = _.get(data,'personal.xSre.otherEmails',"");
                            student.personal.xsre.other_enrollments = _.get(data,'personal.xSre.otherEnrollments',"");
                            enrollment = _.get(data,'personal.xSre.otherEnrollments',"");
                            student.personal.xsre.other_phone_numbers = _.get(data,'personal.xSre.otherPhoneNumbers',"");
                            student.personal.xsre.phone_number = _.get(data,'personal.xSre.phoneNumber',"");


                            var race = _.find(RESOURCES.RACE,function(v){
                                return v.id === student.personal.xsre.demographics.races;
                            });

                            student.personal.xsre.demographics.races = _.size(race) !==0 ? race.name : student.personal.xsre.demographics.races;

                            _.forEach(student.embedded.programs,function(value){
                                var program = {
                                    "name":value.program_name,
                                    "start_date":_.get(value,"participation_start_date",""),
                                    "end_date": new Date(value.participation_end_date) >= Date.now() ? 'Present' : _.get(value,"participation_end_date",""),
                                    "active": value.active ? "Active" : "Inactive",
                                    "cohorts": value.cohort
                                }

                                list_program_participation.push(program);

                            });

                            if(student.personal.xsre.other_enrollments.length !== 0){
                                vm.show_enrollment = true;
                            }else{
                                vm.show_enrollment = false;
                            }
                            if(list_program_participation.length !== 0){
                                vm.list_program_participations = list_program_participation;
                                vm.show_program_participation = true;

                                $scope.sortType = 'start_date';
                                $scope.sortReverse = 'true';
                            }else{
                                vm.show_program_participation = false;
                            }
                            if((student.personal.idea_indicator === 'No' || student.personal.idea_indicator === '')&&(student.personal.section_504_status === 'No' || student.personal.section_504_status === '') &&(student.personal.eligibility_status === 'No' || student.personal.eligibility_status ==='')){
                                student.personal.status = false;
                            }else{
                                student.personal.status = true;
                            }
                            if(student.personal.emergency2.name === "" || student.personal.emergency2.relationship === "" || student.personal.emergency2.phone === "" || student.personal.emergency2.email === "")
                            {
                                student.personal.additional_status = false;
                            }else{
                                student.personal.additional_status = true;
                            }
                            vm.student = student;
                            vm.show_general = true;
                    }else{
                        vm.show_loading = false;
                        vm.message = response.data.error;
                        $timeout(function() {
                            vm.message = false;
                        }, 3000);
                    }
                },function (error) {

                });
        }

        function _removeTime(date) {
            return date.day(0).hour(0).minute(0).second(0).millisecond(0);
        }
        function _buildMonth(start, month) {
            var weeks = [];
            var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
            while (!done) {
                weeks.push(
                    {
                        days: _buildWeek(date.clone(), month)

                    });
                date.add(1, "w");
                done = count++ > 2 && monthIndex !== date.month();
                monthIndex = date.month();
            }
            return weeks;
        }
        function _buildWeek(date, month) {
            var days = [];
            for (var i = 0; i < 7; i++) {
                days.push({
                    name: date.format("dd").substring(0, 1),
                    number: date.date(),
                    day:date.date().toString().length === 1 ?'0'+date.date().toString():date.date().toString(),
                    isCurrentMonth: date.month() === month.month(),
                    isToday: date.isSame(new Date(), "day"),
                    date: date,
                    month:date.month(),
                    year:month.year(),
                    value:date.year()+'-'+date.month()+'-'+date.date()
                });
                date = date.clone();
                date.add(1, "d");
            }
            return days;
        }
        function init(){
            var current_months = "";
            StudentService.getAttendance(id)
                .then(function (response) {
                    vm.show_attendance = true;
                    vm.listOfYears = [];
                    list_attendances = _.get(response.data,'info.source',{});
                    current_months = _.filter(list_attendances.calendars,function (v) {
                        return v.years === list_attendances.list_years[0].value;
                    });
                    renderCalendar(current_months);
                    vm.listOfYears = list_attendances.list_years;
                    if(vm.listOfYears !== undefined && _.size(vm.listOfYears)!==0){
                        vm.selected_years = vm.listOfYears[0].value;
                    }
                },function(error){
                    console.log(error);
                });

            var student_profile = JSON.parse(sessionStorage.getItem("student_profiles"));
            var current_index = _.findIndex(student_profile,{'id':id});
            vm.prev_link = _.get(student_profile[current_index - 1],'value',"");
            vm.next_link = _.get(student_profile[current_index + 1],'value',"");
            var student = student_profile[current_index];
            vm.on_track_to_graduate = _.get(student,'on_track_graduate',"");
            StudentService.getTranscriptById(id)
                .then(function(response){
                    if(response.data.success === true){
                        var cumulativeGPA = [];
                        var data = response.data.info.data;
                        var source = response.data.info.source;
                        vm.trans = response.data.info.source.transcriptTerm.courses;
                        var listCourses;
                        var listTranscript = [];
                        var semester = {};
                        var listSemester = [];
                        var listSchoolYear =[];
                        var firstTime = true;
                        _.forEach(data,function(v){
                            var creditEarned = 0;

                            _.forEach(v.transcripts,function(val){

                                if(val !== null){
                                    _.forEach(val,function(value){
                                        creditEarned += value.creditsEarned;
                                    });
                                }
                            });
                            var list = {
                                years:v.schoolYear,
                                creditEarned : creditEarned
                            }
                            cumulativeGPA.push(list);

                        });
                        var resultGPA = _.chain(cumulativeGPA)
                            .flatten()
                            .groupBy(function (value) {
                                return value.years;
                            })
                            .map(function(value,key){
                                var sum = _.reduce(value,function(memo,val){
                                    return memo + val.creditEarned
                                },0);
                                return {years:key,creditEarned:sum};
                            })
                            .value();

                        _.forEach(data,function (v,k) {
                            var courses = {};
                            listCourses = [];
                            _.forEach(v.transcripts,function (val,key) {
                                _.forEach(val,function (v) {
                                    var teacherNames =_.replace(_.flatten(_.get(v,'teacherNames',"")),'"','');
                                    courses = {
                                        period:_.get(v,'timeTablePeriod',""),
                                        course_name:_.get(v,'courseTitle',""),
                                        teacher:teacherNames,
                                        course_code:_.get(v,'leaCourseId',""),
                                        grade:_.get(v,'mark',"-"),
                                        credits:_.get(v,'creditsEarned',"-")

                                    }
                                    listCourses.push({
                                        course_category:key,
                                        courses:courses
                                    })
                                })
                            })
                            listCourses = _.sortBy(listCourses,function (v) {
                                return v.courses.period;
                            })

                            var header = {
                                semester:v.session,
                                listCourses:listCourses,
                                years:v.schoolYear,
                                grade:v.gradeLevel
                            }
                            listSemester.push(header);
                        });
                        _.forEach(listSemester,function (v,k) {
                            var GPA = _.find(resultGPA,['years',v.years]);

                            if(_.findIndex(listSchoolYear,['years',v.years]) == -1){
                                listSchoolYear.push({
                                    years:v.years,
                                    grade:v.grade,
                                    listSemester:[{
                                        semester:v.semester,
                                        courses:v.listCourses
                                    }],
                                    creditEarned : GPA.creditEarned
                                });
                            }else{
                                listSchoolYear[_.findIndex(listSchoolYear,['years',v.years])].listSemester.push({
                                    semester:v.semester,
                                    courses:v.listCourses,
                                    grade:v.grade
                                });
                            }



                        })

                        var currentGpa = _.get(source,"totalCreditsEarned","");
                        var subjects = _.get(source,"subjectValues","");
                        vm.transcripts = {
                            currentGpa:currentGpa,
                            subjects:subjects
                        }
                        vm.listTranscript = listSchoolYear;
                        vm.show_transcript = true;
                    }else{
                        vm.show_transcript = false;
                    }
                },function(error){
                });


            StudentService.getAssessmentById(id)
                .then(function(response){
                    if(response.data.success === true){
                        if(response.data.info.total > 0){
                            var assessment = _.get(response,'data.info.data',"");
                            vm.assessment = assessment;
                            vm.show_assessment = true;
                            vm.assessment.forEach(function (v,k) {
                                v.states.forEach(function (val,k) {
                                    if(val.attemptCode !== "TS"){
                                        val.attemptCodeDescription = val.attemptCodeDescription;
                                    }
                                })
                            });

                            var en = $interval(function () {
                                if(enrollment!==""){
                                    $interval.cancel(en);
                                    _.forEach(assessment,function (v,k) {
                                            _.forEach(enrollment,function(val,key){
                                                if(v.studentGradeLevel === val.gradeLevel){
                                                    vm.assessment[k].year = moment(val.entryDate).year();
                                                }
                                            });
                                    });
                                }
                            },100);

                        }else{
                            vm.show_assessment = false;
                        }
                    }else{
                        vm.show_assessment = false;

                    }
                },function(error){

                });
        }
        function changeStatus(student){
            student.status = !student.status;
        }
        function xsre(){
            StudentService.getXsre(id)
                .then(function(response){
                    vm.data = response.data;
                    vm.refresh = true;
                    jQuery('#debug_modal').modal("show");
                },function(error){

                })
        }
        function checkDate(date) {
            if(date < 10)
            {
                return true;
            }
            return false;
        }

        function buildChart(response){
            $scope.percent = '';
            $scope.options = {
                animate:{
                    duration:1000,
                    enabled:true
                },
                easing: 'jswingv',
                trackColor:'#d0d6d9',
                //barColor:'#fd963d',
                scaleColor:false,
                lineWidth:6,
                trackWidth: 2,
                lineCap:'round',
                size: 100,
                onStep: function(from,to,currentValue) {
                  this.el.getElementsByTagName("span")[0].innerHTML = parseInt(currentValue, 10) + "%";
                },
                barColor: function(percent) {
                    var ctx = this.renderer.getCtx();
                    var canvas = this.renderer.getCanvas();
                    var gradient = ctx.createLinearGradient(0,0,canvas.width,60);
                    gradient.addColorStop(0, "#fa6268");
                    gradient.addColorStop(0.5, "#fe9e37");
                    gradient.addColorStop(1, "#fc834d");
                    return gradient;
                }
            };
        }
        buildChart();
    }



})(jQuery);
