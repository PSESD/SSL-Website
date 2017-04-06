(function($) {
    'use strict';

    angular.module('sslv2App')
        .controller('StudentDetailCtrl', StudentDetailCtrl);

    StudentDetailCtrl.$inject = ['$state','$scope','StudentService','$stateParams','$interval','$timeout','RESOURCES'];

    function StudentDetailCtrl($state,$scope,StudentService,$stateParams,$interval,$timeout,RESOURCES) {

        var vm = this;
        vm.show_loading = true;
        var list_attendances = {};
        var list_incidents = []; /* TODO: Need to be populated in init */
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
        vm.getAssessmentYear = getAssessmentYear;
        var isFirstTime = true;
        var momentjs = moment();
        var id = $stateParams.id;
        var data ="";
        var template = "<div class='attendance-modal'><dl><dt>{date}</dt><dd></dd><dt>Reason:</dt><dd>{reason}</dd><dt>Description:</dt><dd>{description}</dd></dl></div>";
        var sorted_months = [];
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
            tabSize: 6,
            lineNumbers: true,
            //readOnly: 'nocursor',
            theme: 'monokai',
            mode: 'xml',
            extraKeys: {"Alt-F": "findPersistent"}

        }
        vm.student = {
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
                    lateToClass: '',
                    missedDay: '',
                    missedClass: '',
                    behaviorIncident: '',
                    attendanceRate: '',
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
            var selected_month = _.filter(list_attendances.list_weeks,function (v) {
                return v.month === filter;
            });
            var header = ".header"+idx;
            var detail = "#tabs-"+idx;

            document.querySelector('#attendance').scrollIntoView({
              behavior: 'smooth'
            });

            vm.selectedMonth = selected_month[0];
            vm.month_name = selected_month[0].name;
            vm.show_detail = true;

            $timeout(function () {
                if(jQuery(header).hasClass('collapsed') === true){
                    jQuery(header).removeClass('collapsed');
                    jQuery(detail).collapse('show');
                }
            },0);

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
                    refreshGeneral(id);
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

        //Render Calendar
        function renderCalendar(data){

            setAttendanceSummary(data[0].summary);

            var today = momentjs.utc();
            var todayMonth = today.month()+1;
            var todayYear = today.year();
             
            _.forEach(data,function(month){

                var months = month.list_months;

                if ( sorted_months.indexOf(month.years) === -1 ) {
                     months = month.list_months.reverse();
                    sorted_months.push(month.years);
                }

                _.forEach(month.list_months,function(v){
                    if (new Date(v.year, v.month) > new Date(todayYear, todayMonth)){
                      var showMonth = false;
                    }else{
                      var showMonth = true;
                      var start = moment(v.year + "-" + v.month).utc();
                      var m2 = start.clone();
                      start = start.date(1).day(0);

                      vm.listOfCalendar.push(
                        {
                            'data':_buildMonth(start,m2),
                            'name':m2,
                            'show':showMonth,
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
                        if(value == 'behavior_incident'){
                          _.forEach(list_incidents,function(incidentVal){
                            if(v.date === incidentVal.incident_date){
                              var behaviorPath = jQuery("."+moment(v.date).month(set_date.getMonth()).format("YYYY-M-DD"));
                              behaviorPath.addClass('incident');
                              behaviorPath.popover({content: "<span>" + incidentVal.incident_desciption + "</span>", trigger:"hover", html: true, placement: "top"});
                            }
                          });
                        }

                        if(value == 'missed_day'){
                          jQuery("."+moment(v.date).month(set_date.getMonth()).format("YYYY-M-DD")+" .missed-day").removeClass('hide');
                        }else{
                          if(value == 'late_to_class'){
                            jQuery("."+moment(v.date).month(set_date.getMonth()).format("YYYY-M-DD")+" .late-class").removeClass('hide');
                          }
                          if(value == 'missed_class'){
                            jQuery("."+moment(v.date).month(set_date.getMonth()).format("YYYY-M-DD")+" .missed-class").removeClass('hide');
                          }
                        }
                      });
                    }
                  });
                },2000);
            });

        }

        function setAttendanceSummary(summary) {
              vm.student.personal.summary.lateToClass = summary.lateToClass;
              vm.student.personal.summary.missedDay = summary.missedDay;
              vm.student.personal.summary.missedClass = summary.missedClass;
              vm.student.personal.summary.behaviorIncident = summary.behaviorIncident;
              vm.student.personal.summary.attendanceRate = summary.attendanceRate;
        }

        function changeYear(){
            var current_months = _.filter(list_attendances.calendars,function (v) {
                return v.years === vm.selected_years;
            });

            vm.listOfCalendar = [];

            renderCalendar(current_months);

            vm.show_detail = false;

            jQuery('.month-detail > .panel-group > .panel-default > div.panel-heading').each(function(i, item) { jQuery(item).hasClass('collapsed') == false ? jQuery(item).addClass('collapsed') : null; });
            jQuery('.month-detail > .panel-group > .panel-default > div.panel-collapse.collapse.in').removeClass('in');

        }

        function formatPhoneNumber(s) {
          var s2 = (""+s).replace(/\D/g, '');
          var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
          return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
        }

        if($stateParams.debug === "true"){
            vm.show_xsre = true;
        }else if($stateParams.debug === undefined){
            vm.show_xsre = false;
        }

        init();

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
            var startTime = new Date();
            StudentService.getAllStudentDetails(id)
            .then(function(response){
                console.log("response: ", response);
                if (response.data.success) {
                    loadAttendanceData(response.data);
                    
                    var student = getStudentProfile(id);
                    vm.on_track_to_graduate = _.get(student,'on_track_graduate',"");

                    loadTranscriptData(response.data.info.transcript);
                    loadAssessmentData(response.data.info.assessment);
                    loadGeneral(response.data.info, student);
                }
                vm.show_loading = false;
                var endTime = new Date();
            });
        }

        function loadAttendanceData(attendanceData) {
            vm.listOfYears = [];
            var current_months = "";
            list_attendances = _.get(attendanceData,'info.attendance',{});
            current_months = _.filter(list_attendances.calendars,function (v) {
                return v.years === list_attendances.list_years[0].value;
            });
                renderCalendar(current_months);
                vm.listOfYears = list_attendances.list_years;
                if(vm.listOfYears !== undefined && _.size(vm.listOfYears)!==0){
                vm.selected_years = vm.listOfYears[0].value;
            }
            vm.show_attendance = true;
        }

        function loadTranscriptData(transcriptData) {
            var cumulativeGPA = [];
            var transcript = transcriptData;
            vm.trans = transcript.transcriptTerm.courses;
            var courses = {};
            var listCourses = [];
            var listTranscript = [];
            var semester = {};
            var listSemester = [];
            var listSchoolYear =[];
            var firstTime = true;

            _.forEach(transcript.details,function(v, k){
                var creditEarned = 0;

                _.forEach(v.transcripts,function(val, key){
                    if(val !== null){
                        _.forEach(val,function(value){
                            creditEarned += value.creditsEarned;
                            var teacherNames =_.replace(_.flatten(_.get(value,'teacherNames',"")),'"','');
                            courses = {
                                period:_.get(value,'timeTablePeriod',""),
                                course_name:_.get(value,'courseTitle',""),
                                teacher:teacherNames,
                                course_code:_.get(value,'leaCourseId',""),
                                grade:_.get(value,'mark',"-"),
                                credits:_.get(value,'creditsEarned',"-")
                            }

                            listCourses.push({
                                course_category:key,
                                courses:courses
                            })
                        });
                    }
                });

                var list = {
                    years:v.schoolYear,
                    creditEarned : creditEarned
                }

                cumulativeGPA.push(list);
                vm.creditEarned = creditEarned;

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
            });

            var currentGpa = _.get(transcript,"totalCreditsEarned","");
            var subjects = _.get(transcript,"subjectValues","");
            vm.transcripts = {
                currentGpa:currentGpa,
                subjects:subjects
            }
            vm.listTranscript = listSchoolYear;

            vm.show_transcript = true;  
        }

        function loadAssessmentData(assessmentData) {
            if(assessmentData.length > 0){
                vm.assessment = assessmentData;
                vm.show_assessment = true;
                vm.assessment.forEach(function (v,k) {
                    v.year = v.schoolYear;
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
            }
        }

        function loadAttendanceData(attendanceData) {
            vm.listOfYears = [];
            var current_months = "";
            list_attendances = _.get(attendanceData, 'info.attendance', {});

            current_months = _.filter(list_attendances.calendars, function(v) {
                return v.years === list_attendances.list_years[0].value;
            });
            renderCalendar(current_months);
            vm.listOfYears = list_attendances.list_years;
            if (vm.listOfYears !== undefined && _.size(vm.listOfYears) !== 0) {
                vm.selected_years = vm.listOfYears[0].value;
            }
            vm.show_attendance = true;

            _.forEach(list_attendances.list_weeks, function(v, k) {
                _.forEach(v.detail, function(val, key) {
                    if (val !== null) {
                        _.forEach(val.days, function(value) {
                            var date = v.month + '-' + value.date;
                            if (value.incident_detail[0] !== undefined) {
                                list_incidents.push({
                                    incident_date: date,
                                    incident_desciption: value.incident_detail[0].description
                                })
                            }
                        });
                    }
                });
            });
        }

        function loadTranscriptData(transcriptData) {
            var cumulativeGPA = [];
            var transcript = transcriptData;
            vm.trans = transcript.transcriptTerm.courses;
            var courses = {};
            var listCourses = [];
            var listTranscript = [];
            var semester = {};
            var listSemester = [];
            var listSchoolYear =[];
            var firstTime = true;

            _.forEach(transcript.details,function(v, k){
                var creditEarned = 0;

                _.forEach(v.transcripts,function(val, key){
                    if(val !== null){
                        _.forEach(val,function(value){

                            creditEarned += value.creditsEarned;
                            var teacherNames =_.replace(_.flatten(_.get(value,'teacherNames',"")),'"','');
                            courses = {
                                period:_.get(value,'timeTablePeriod',""),
                                course_name:_.get(value,'courseTitle',""),
                                teacher:teacherNames,
                                course_code:_.get(value,'leaCourseId',""),
                                grade:_.get(value,'mark',"-"),
                                credits:_.get(value,'creditsEarned',"-")
                            }

                            listCourses.push({
                                course_category:key,
                                courses:courses
                            })
                        });
                    }
                });

                var list = {
                    years:v.schoolYear,
                    creditEarned : creditEarned
                }

                cumulativeGPA.push(list);
                vm.creditEarned = creditEarned;

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
            });

            var currentGpa = _.get(transcript,"totalCreditsEarned","");
            var subjects = _.get(transcript,"subjectValues","");
            vm.transcripts = {
                currentGpa:currentGpa,
                subjects:subjects
            }
            vm.listTranscript = listSchoolYear;

            vm.show_transcript = true;
        }

        function loadAssessmentData(assessmentData) {
            if(assessmentData.length > 0){
                vm.assessment = assessmentData;
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
            }
        }

        function loadGeneral(data, student){
            var list_program_years =[];
            var list_program_participation = [];
            vm.student.embedded.programs = _.get(data,'_embedded.programs',"");
            vm.student.embedded.users = _.get(data,'_embedded.users',"");
            vm.student.last_update = _.get(data,'student.last_updated',"");
            vm.student.report_date = _.get(data,'json.reportDate',"");
            vm.student.local_id = _.get(data,'json.localId',"");
            vm.student.personal.address = _.get(data,'personal.address',"");
            vm.student.personal.days_absent = _.get(data,'personal.daysAbsent',"");
            vm.student.personal.days_in_attendance = _.get(data,'personal.daysInAttendance',"");
            vm.student.personal.eligibility_status = _.get(data,'personal.eligibilityStatus',"");
            vm.student.personal.email = _.get(data,'personal.email',"");
            vm.student.personal.emergency1.email = _.get(data,'personal.emergency1.email',"");
            vm.student.personal.emergency1.mentor = _.get(data,'personal.emergency1.mentor',"");
            vm.student.personal.emergency1.name = _.get(data,'personal.emergency1.name',"");
            vm.student.personal.emergency1.phone = formatPhoneNumber(_.get(data,'personal.emergency1.phone',""));
            vm.student.personal.emergency1.relationship = _.get(data,'personal.emergency1.relationship',"");
            vm.student.personal.emergency2.email = _.get(data,'personal.emergency2.email',"");
            vm.student.personal.emergency2.mentor = _.get(data,'personal.emergency2.mentor',"");
            vm.student.personal.emergency2.name = _.get(data,'personal.emergency2.name',"");
            vm.student.personal.emergency2.phone = formatPhoneNumber(_.get(data,'personal.emergency2.phone',""));
            vm.student.personal.emergency2.relationship = _.get(data,'personal.emergency2.relationship',"");
            vm.student.personal.enrollment_status = _.get(data,'personal.enrollmentStatus',"");
            vm.student.personal.first_name = data && data.personal ? data.personal.firstName || data.personal.xSre && data.personal.xSre.name ? data.personal.xSre.name.givenName : "" : "";
            vm.student.personal.last_name = data && data.personal ? data.personal.firstName || data.personal.xSre && data.personal.xSre.name ? data.personal.xSre.name.familyName : "" : "";
            vm.student.personal.idea_indicator = _.get(data,'personal.ideaIndicator',"");
            vm.student.personal.middle_name = _.get(data,'personal.middleName',"");
            vm.student.personal.phone = formatPhoneNumber(_.get(data,'personal.phone',""));
            vm.student.personal.school_district = _.get(data,'personal.schoolDistrict',"");
            vm.student.personal.school_year = _.get(data,'personal.schoolYear',"");
            vm.student.personal.section_504_status = _.get(data,'personal.section504Status',"");
            vm.student.personal.summary.attendance_count = _.get(data,'personal.summary.attendanceCount',"");
            vm.student.personal.summary.behavior_count = _.get(data,'personal.summary.behaviorCount',"");
            vm.student.personal.summary.date = _.get(data,'personal.summary.date',"");
            vm.student.personal.summary.risk_flag = _.get(data,'personal.summary.riskFlag',"");
            vm.student.personal.xsre.address = _.get(data,'personal.xSre.address',"");
            vm.student.personal.xsre.demographics.birth_date = _.get(data,'personal.xSre.demographics.birthDate',"");
            vm.student.personal.xsre.demographics.hispanic_latino_ethnicity = _.get(data,'personal.xSre.demographics.hispanicLatinoEthnicity',"");
            if(data.personal.xSre.demographics.races.length > 0){
                vm.student.personal.xsre.demographics.races = data.personal.xSre.demographics.races.join();
            }else{
                if(data.personal.xSre.demographics.races.length === 0){
                    vm.student.personal.xsre.demographics.races = '';
                }else{
                    vm.student.personal.xsre.demographics.races = _.get(data,'personal.xSre.demographics.races',"");
                }
            }
            vm.student.personal.xsre.demographics.sex = _.get(data,'personal.xSre.demographics.sex',"");
            vm.student.personal.xsre.email = _.get(data,'personal.xSre.email',"");
            vm.student.personal.xsre.enrollment.enrollment_status = _.get(data,'personal.xSre.enrollment.enrollmentStatus',"");
            vm.student.personal.xsre.enrollment.enrollment_status_description = _.get(data,'personal.xSre.enrollment.enrollmentStatusDescription',"");
            vm.student.personal.xsre.enrollment.entry_date = _.get(data,'personal.xSre.enrollment.entryDate',"");
            vm.student.personal.xsre.enrollment.exit_date = _.get(data,'personal.xSre.enrollment.exitDate',"");
            vm.student.personal.xsre.enrollment.grade_level = _.get(data,'personal.xSre.enrollment.gradeLevel',"");
            vm.student.personal.xsre.enrollment.lea_ref_id = _.get(data,'personal.xSre.enrollment.leaRefId',"");
            vm.student.personal.xsre.enrollment.membership_type = _.get(data,'personal.xSre.enrollment.membershipType',"");
            vm.student.personal.xsre.enrollment.projected_graduation_year = _.get(data,'personal.xSre.enrollment.projectedGraduationYear',"");
            vm.student.personal.xsre.enrollment.school_name = _.get(data,'personal.xSre.enrollment.schoolName',"");
            vm.student.personal.xsre.enrollment.school_ref_id = _.get(data,'personal.xSre.enrollment.schoolRefId',"");
            vm.student.personal.xsre.enrollment.school_year = _.get(data,'personal.xSre.enrollment.schoolYear',"");
            vm.student.personal.xsre.languages = _.get(data,'personal.xSre.languages',"");
            vm.student.personal.xsre.local_id = _.get(data,'personal.xSre.localId',"");
            vm.student.personal.xsre.other_emails = _.get(data,'personal.xSre.otherEmails',"");
            vm.student.personal.xsre.other_enrollments = _.get(data,'personal.xSre.otherEnrollments',"");
            enrollment = _.get(data,'personal.xSre.otherEnrollments',"");
            vm.student.personal.xsre.other_phone_numbers = _.get(data,'personal.xSre.otherPhoneNumbers',"");
            vm.student.personal.xsre.phone_number = _.get(data,'personal.xSre.phoneNumber',"");

            if (vm.student.personal.xsre.demographics.hispanic_latino_ethnicity == "true") {
                vm.student.personal.xsre.demographics.races = "Hispanic";
            } else {

                var race = _.find(RESOURCES.RACE,function(v){
                    return v.id === vm.student.personal.xsre.demographics.races;
                });

                vm.student.personal.xsre.demographics.races = _.size(race) !==0 ? race.name : vm.student.personal.xsre.demographics.races;
            }

            _.forEach(vm.student.embedded.programs,function(value){
                var program = {
                    "name":value.program_name,
                    "start_date":_.get(value,"participation_start_date",""),
                    "end_date": new Date(value.participation_end_date) >= Date.now() ? 'Present' : _.get(value,"participation_end_date",""),
                    "active": value.active ? "Active" : "Inactive",
                    "cohorts": value.cohort
                }

                list_program_participation.push(program);

            });

            vm.show_enrollment = true;

            if(list_program_participation.length !== 0){
                vm.list_program_participations = list_program_participation;
                $scope.sortType = 'start_date';
                $scope.sortReverse = 'true';
            }
            vm.show_program_participation = true;

            if((vm.student.personal.idea_indicator === 'No' || vm.student.personal.idea_indicator === '')&&(vm.student.personal.section_504_status === 'No' || vm.student.personal.section_504_status === '') &&(vm.student.personal.eligibility_status === 'No' || vm.student.personal.eligibility_status ==='')){
                vm.student.personal.status = false;
            }else{
                vm.student.personal.status = true;
            }
            if(vm.student.personal.emergency1.name === "" || vm.student.personal.emergency1.relationship === "" || vm.student.personal.emergency1.phone === "" || vm.student.personal.emergency1.email === "")
            {
                vm.student.personal.additional_status1 = false;
            }else{
                vm.student.personal.additional_status1 = true;
            }
            if(vm.student.personal.emergency2.name === "" || vm.student.personal.emergency2.relationship === "" || vm.student.personal.emergency2.phone === "" || vm.student.personal.emergency2.email === "")
            {
                vm.student.personal.additional_status2 = false;
            }else{
                vm.student.personal.additional_status2 = true;
            }
            vm.show_general = true;
        }

        function refreshGeneral(id) {
            StudentService.getStudentById(id)
                .then(function(response){
                    if(response.data.success === true){
                        var student = getStudentProfile(id);
                        vm.on_track_to_graduate = _.get(student,'on_track_graduate',"");
                        loadGeneral(response.data.info, student);
                    }
                });
        }

        function getStudentProfile(id) {
            var student_profile = JSON.parse(localStorage.getItem("student_profiles"));
            var current_index = _.findIndex(student_profile,{'id':id});
            vm.prev_link = _.get(student_profile[current_index - 1],'value',"");
            vm.next_link = _.get(student_profile[current_index + 1],'value',"");
            return student_profile[current_index];
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

        function getAssessmentYear(assessment) {
            return assessment.year ? "ACADEMIC YEAR: " + (assessment.year - 1) + "/" + assessment.year + " | " : "";
        }
    }



})(jQuery);
