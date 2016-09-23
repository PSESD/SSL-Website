(function($) {
    'use strict';

    angular.module('sslv2App')
        .controller('StudentDetailCtrl', StudentDetailCtrl);

    StudentDetailCtrl.$inject = ['$state','StudentService','$stateParams','$q','$timeout'];

    function StudentDetailCtrl($state,StudentService,$stateParams) {

        var vm = this;
        vm.show_general = false;
        vm.show_attendance = false;
        vm.show_transcript = false;
        vm.show_assessment = false;
        vm.program_participation = false;
        vm.show_enrollment = false;
        vm.show_xsre = false;
        var id = $stateParams.id;
        var student = "";
        var list_of_student_data = [];
        var periods = [];
        var template = "<div class='attendance-modal'><dl><dt>{date}</dt><dd></dd><dt>Reason:</dt><dd>{reason}</dd><dt>Description:</dt><dd>{description}</dd></dl></div>";
        vm.changeStatus = changeStatus;
        vm.student_id = $stateParams.id;
        vm.list_of_details = "";
        vm.list_programs = [];
        vm.xsre = xsre;
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

        if($stateParams.debug === "true"){
            vm.show_xsre = true;
        }else if($stateParams.debug === undefined){
            vm.show_xsre = false;
        }
        StudentService.getAttendance(id)
             .then(function(response){
                 var data = _.get(response,'data.info.data',[]);
                 var legend = [];
                 _.forEach(data,function(values){
        
                     for(var v in values){
                         var data = values[v];
                         for( var l in data.legend){
                             legend.push(l)
                         }
                         var header = {
                             date: data.weekDate,
                             monday:data.summary.M,
                             tuesday:data.summary.T,
                             wednesday:data.summary.W,
                             thursday:data.summary.TH,
                             friday:data.summary.F,
                             saturday:data.summary.SA,
                             sunday:data.summary.S,
                             weekly_change:data.weeklyChange
                         }
        
                         var header_detail ={
                             date:data.details[0].title,
                             day:{
                                 monday:{
                                     date:data.details[0].M,
                                     value:data.summary.M
                                 },
                                 tuesday:{
                                     date:data.details[0].T,
                                     value:data.summary.T
                                 },
                                 wednesday: {
                                     date: data.details[0].W,
                                     value: data.summary.W
                                 },
                                 thursday:{
                                     date: data.details[0].TH,
                                     value: data.summary.TH
                                 },
                                 friday:{
                                     date: data.details[0].F,
                                     value: data.summary.F
                                 },
                                 saturday:{
                                     date: data.details[0].SA,
                                     value: data.summary.SA
                                 },
                                 sunday:{
                                     date: data.details[0].S,
                                     value: data.summary.S
                                 }
                             }
                         }
                         var detail_columns = {
                             monday: _.remove(data.detailColumns.M,function(val,index){return index!==0}),
                             tuesday:_.remove(data.detailColumns.T,function(val,index){return index!==0}),
                             wednesday:_.remove(data.detailColumns.W,function(val,index){return index!==0}),
                             thursday:_.remove(data.detailColumns.TH,function(val,index){return index!==0}),
                             friday:_.remove(data.detailColumns.F,function(val,index){return index!==0}),
                             saturday:_.remove(data.detailColumns.SA,function(val,index){return index!==0}),
                             sunday:_.remove(data.detailColumns.S,function(val,index){return index!==0}),
                         }
                         _.forEach(detail_columns.monday,function(value,key){
                             var event = _.get(value,'event',"");
                             if(event !== ""){
                                 var date = _.get(value,'event.calendarEventDate',"");
                                 var reason = _.get(value,'event.absentReasonDescription',"");
                                 var description = _.get(value,'event.attendanceStatusTitle',"");
                                 if(date!=="" && reason !== "" && description !== ""){
                                     var temp_template = template;
                                     temp_template = _.replace(temp_template,'{date}',date);
                                     temp_template = _.replace(temp_template,'{reason}',reason);
                                     temp_template = _.replace(temp_template,'{description}',description);
                                     detail_columns.monday[key].template = temp_template;
                                 }else{
                                     detail_columns.monday[key].template = "";
                                 }
                             }
                         });
                         _.forEach(detail_columns.tuesday,function(value,key){
                            var event = _.get(value,'event',"");
                            if(event !== ""){
                                var date = _.get(value,'event.calendarEventDate',"");
                                var reason = _.get(value,'event.absentReasonDescription',"");
                                var description = _.get(value,'event.attendanceStatusTitle',"");
                                if(date!=="" && reason !== "" && description !== ""){
                                    var temp_template = template;
                                    temp_template = _.replace(temp_template,'{date}',date);
                                    temp_template = _.replace(temp_template,'{reason}',reason);
                                    temp_template = _.replace(temp_template,'{description}',description);
                                    detail_columns.tuesday[key].template = temp_template;
                                }else{
                                    detail_columns.tuesday[key].template = "";
                                }
                            }
                         });
                         _.forEach(detail_columns.wednesday,function(value,key){
                             var event = _.get(value,'event',"");
                             if(event !== ""){
                                 var date = _.get(value,'event.calendarEventDate',"");
                                 var reason = _.get(value,'event.absentReasonDescription',"");
                                 var description = _.get(value,'event.attendanceStatusTitle',"");
                                 if(date!=="" && reason !== "" && description !== ""){
                                     var temp_template = template;
                                     temp_template = _.replace(temp_template,'{date}',date);
                                     temp_template = _.replace(temp_template,'{reason}',reason);
                                     temp_template = _.replace(temp_template,'{description}',description);
                                     detail_columns.wednesday[key].template = temp_template;
                                 }else{
                                     detail_columns.wednesday[key].template = "";
                                 }
                             }
                         });
                         _.forEach(detail_columns.thursday,function(value,key){
                             var event = _.get(value,'event',"");
                             if(event !== ""){
                                 var date = _.get(value,'event.calendarEventDate',"");
                                 var reason = _.get(value,'event.absentReasonDescription',"");
                                 var description = _.get(value,'event.attendanceStatusTitle',"");
                                 if(date!=="" && reason !== "" && description !== ""){
                                     var temp_template = template;
                                     temp_template = _.replace(temp_template,'{date}',date);
                                     temp_template = _.replace(temp_template,'{reason}',reason);
                                     temp_template = _.replace(temp_template,'{description}',description);
                                     detail_columns.thursday[key].template = temp_template;
                                 }else{
                                     detail_columns.thursday[key].template = "";
                                 }
                             }
                         });
                         _.forEach(detail_columns.friday,function(value,key){
                             var event = _.get(value,'event',"");
                             if(event !== ""){
                                 var date = _.get(value,'event.calendarEventDate',"");
                                 var reason = _.get(value,'event.absentReasonDescription',"");
                                 var description = _.get(value,'event.attendanceStatusTitle',"");
                                 if(date!=="" && reason !== "" && description !== ""){
                                     var temp_template = template;
                                     temp_template = _.replace(temp_template,'{date}',date);
                                     temp_template = _.replace(temp_template,'{reason}',reason);
                                     temp_template = _.replace(temp_template,'{description}',description);
                                     detail_columns.friday[key].template = temp_template;
                                 }else{
                                     detail_columns.friday[key].template = "";
                                 }
                             }
                         });
                         _.forEach(detail_columns.saturday,function(value,key){
                             var event = _.get(value,'event',"");
                             if(event !== ""){
                                 var date = _.get(value,'event.calendarEventDate',"");
                                 var reason = _.get(value,'event.absentReasonDescription',"");
                                 var description = _.get(value,'event.attendanceStatusTitle',"");
                                 if(date!=="" && reason !== "" && description !== ""){
                                     var temp_template = template;
                                     temp_template = _.replace(temp_template,'{date}',date);
                                     temp_template = _.replace(temp_template,'{reason}',reason);
                                     temp_template = _.replace(temp_template,'{description}',description);
                                     detail_columns.saturday[key].template = temp_template;
                                 }else{
                                     detail_columns.saturday[key].template = "";
                                 }
                             }
                         });
                         _.forEach(detail_columns.sunday,function(value,key){
                             var event = _.get(value,'event',"");
                             if(event !==""){
                                 var date = _.get(value,'event.calendarEventDate',"");
                                 var reason = _.get(value,'event.absentReasonDescription',"");
                                 var description = _.get(value,'event.attendanceStatusTitle',"");
                                 if(date!=="" && reason !== "" && description !== ""){
                                     var temp_template = template;
                                     temp_template = _.replace(temp_template,'{date}',date);
                                     temp_template = _.replace(temp_template,'{reason}',reason);
                                     temp_template = _.replace(temp_template,'{description}',description);
                                     detail_columns.sunday[key].template = temp_template;
                                 }else{
                                     detail_columns.sunday[key].template = "";
                                 }
                             }
                         });
                         var behaviors = {
                             monday:data.behaviors.M,
                             tuesday:data.behaviors.T,
                             wednesday:data.behaviors.W,
                             thursday:data.behaviors.TH,
                             friday:data.behaviors.F,
                             saturday:data.behaviors.SA,
                             sunday:data.behaviors.S,
                         }

                         for (var period in data.periods){
                             if(data.periods[period].includes("Period")){
                                 periods.push(data.periods[period]);
                             }
                         }
                         var list_of_item = {
                             header:header,
                             header_detail:header_detail,
                             detail_columns:detail_columns,
                             periods:_.uniq(periods),
                             behaviors:behaviors,
                             status:false
                         }
                         list_of_student_data.push(list_of_item);
                     }
                 });
                 vm.legend = _.uniq(legend);
                 vm.list_of_details = list_of_student_data;
                 if(list_of_student_data.length !== 0){
                     vm.show_attendance = true;
                 }else{
                     vm.show_attendance = false;
                 }

             },function(error){

             });

        init();
        function init(){

            var student_profile = JSON.parse(sessionStorage.getItem("student_profiles"));
            var current_index = _.findIndex(student_profile,{'id':id});
            vm.prev_link = _.get(student_profile[current_index - 1],'value',"");
            vm.next_link = _.get(student_profile[current_index + 1],'value',"");
            var student = student_profile[current_index];
            vm.on_track_to_graduate = _.get(student,'on_track_graduate',"");
            StudentService.getTranscriptById(id)
                .then(function(response){
                    if(response.data.success === true){
                        var data = response.data.info.data;
                        var source = response.data.info.source;
                        var list_high_schools = [];
                        var list_transcripts = [];
                        var high_school = {};
                        var transcript_header = {};
                        _.forEach(data,function(high_school_value,key){
                            list_transcripts = [];
                            _.forEach(high_school_value.transcripts,function(transcripts){
                                if(_.isNull(transcripts)){
                                    transcripts = [];
                                }
                                list_transcripts.push(transcripts);
                            });
                            high_school = {
                                grade_level : _.get(high_school_value,'gradeLevel',""),
                                school_name : _.get(high_school_value,'schoolName',""),
                                school_year : _.get(high_school_value,'schoolYear',""),
                                session : _.get(high_school_value,'session',""),
                                start_date : _.get(high_school_value,'startDate',""),
                                start_date_time : _.get(high_school_value,'startDateTime',""),
                                transcripts:list_transcripts
                            }
                            list_high_schools.push(high_school);
                        });

                        transcript_header ={
                            credits:_.get(source,'credits',""),
                            grade_level:_.get(source,'gradeLevel',""),
                            total_credits_earned:_.get(source,'totalCreditsEarned',""),
                            total_credits_attempted:_.get(source,'totalCreditsAttempted',""),
                            total_cumulative_gpa:_.get(source,'totalCumulativeGpa',""),
                            subject_values:_.get(source,'subjectValues',"")

                        }
                        vm.list_high_schools = list_high_schools;
                        vm.transcript_header = transcript_header;
                       vm.show_transcript = true;
                    }else{
                        vm.show_transcript = false;
                    }
                },function(error){
                });
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

            StudentService.getAssessmentById(id)
                .then(function(response){
                    if(response.data.success === true){
                        if(response.data.info.total > 0){
                            vm.assessment = _.get(response,'data.info.data',"");
                            vm.show_assessment = true;
                        }else{
                            vm.show_assessment = false;
                        }
                    }else{
                        vm.show_assessment = false;
                    }
                },function(error){

                });

            StudentService.getStudentById(id)
                .then(function(response){
                    if(response.data.success === true){
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
                        student.personal.emergency2.email = _.get(data,'personal.emergency1.email',"");
                        student.personal.emergency2.mentor = _.get(data,'personal.emergency1.mentor',"");
                        student.personal.emergency2.name = _.get(data,'personal.emergency1.name',"");
                        student.personal.emergency2.phone = _.get(data,'personal.emergency1.phone',"");
                        student.personal.emergency2.relationship = _.get(data,'personal.emergency1.relationship',"");
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
                        student.personal.xsre.other_phone_numbers = _.get(data,'personal.xSre.otherPhoneNumbers',"");
                        student.personal.xsre.phone_number = _.get(data,'personal.xSre.phoneNumber',"");

                        _.forEach(student.embedded.programs,function(value){
                            list_program_years.push(new Date(value.participation_start_date).getFullYear());
                        });
                        list_program_years = _.uniq(list_program_years);
                        _.forEach(list_program_years,function(value){
                            var programs = {
                                years:value,
                                programs:[]
                            }
                           list_program_participation.push(programs);
                        });
                        _.forEach(student.embedded.programs,function(value){
                            var years = new Date(value.participation_start_date).getFullYear();
                            var idx = _.findIndex(list_program_participation,{'years':years});
                            var program = {
                                "name":value.program_name,
                                "start_date":_.get(value,"participation_start_date",""),
                                "end_date": new Date(value.participation_end_date) >= Date.now() ? 'Present' : _.get(value,"participation_end_date",""),
                                "active": value.active ? "Active" : "Inactive",
                                "cohorts": value.cohort
                            }
                            list_program_participation[idx].programs.push(program);
                        });
                        if(student.personal.xsre.other_enrollments.length !== 0){
                            vm.show_enrollment = true;
                        }else{
                            vm.show_enrollment = false;
                        }
                        if(list_program_participation.length !== 0){
                            vm.list_program_participations = list_program_participation;
                            vm.show_program_participation = true;
                        }else{
                            vm.show_program_participation = false;
                        }
                        if((student.personal.idea_indicator === 'No' || student.personal.idea_indicator === '')&&(student.personal.section_504_status === 'No' || student.personal.section_504_status === '') &&(student.personal.eligibility_status === 'No' || student.personal.eligibility_status ==='')){
                            student.personal.status = false;
                        }else{
                            student.personal.status = true;
                        }
                        vm.student = student;
                        vm.show_general = true;
                    }
                },function (error) {

                });

            StudentService.getTranscript(id)
                .then(function(response){
                    if(response.data.success === true){

                        var data = _.get(response,'data.info',"");
                        student.transcript.data = data.data;
                        student.transcript.source.academic_summary.class_rank = _.get(data,'source.academicSummary.classRank',"");
                        student.transcript.source.academic_summary.cumulative_gpa = _.get(data,'source.academicSummary.cumulativeGpa',"");
                        student.transcript.source.academic_summary.gpa_scale = _.get(data,'source.academicSummary.gpaScale',"");
                        student.transcript.source.academic_summary.term_credits_attempted = _.get(data,'source.academicSummary.termCreditsAttempted',"");
                        student.transcript.source.academic_summary.term_credits_earned = _.get(data,'source.academicSummary.termCreditsEarned',"");
                        student.transcript.source.academic_summary.term_weighted_gpa = _.get(data,'source.academicSummary.termWeightedGpa',"");
                        student.transcript.source.academic_summary.total_credits_attempted = _.get(data,'source.academicSummary.totalCreditsAttempted',"");
                        student.transcript.source.academic_summary.total_credits_earned = _.get(data,'source.academicSummary.totalCreditsEarned',"");
                        student.transcript.source.credits = _.get(data,'source.credits',"");
                        student.transcript.source.grade_level = _.get(data,'source.gradeLevel',"");
                        student.transcript.source.info.grade_level = _.get(data,'source.info.gradeLevel',"");
                        student.transcript.source.info.total_attempted = _.get(data,'source.info.totalAttempted',"");
                        student.transcript.source.info.total_earned = _.get(data,'source.info.totalEarned',"");
                        student.transcript.source.subject = _.get(data,'source.subject',"");
                        student.transcript.source.subject_values = _.get(data,'source.subjectValues',"");
                        student.transcript.source.total_credits_attempted = _.get(data,'source.totalCreditsAttempted',"");
                        student.transcript.source.total_credits_earned = _.get(data,'source.totalCreditsEarned',"");
                        student.transcript.source.total_cumulative_gpa = _.get(data,'source.totalCumulativeGpa',"");
                        student.transcript.source.transcript_term.courses = _.get(data,'source.transcriptTerm.courses',"");
                        student.transcript.source.transcript_term.school.lea_ref_id = _.get(data,'source.transcriptTerm.school.leaRefId',"");
                        student.transcript.source.transcript_term.school.local_id = _.get(data,'source.transcriptTerm.school.localId',"");
                        student.transcript.source.transcript_term.school.school_name = _.get(data,'source.transcriptTerm.school.schoolName',"");
                        student.transcript.source.transcript_term.school_year = _.get(data,'source.transcriptTerm.schoolYear',"");
                        if(data === ""){

                        }else{

                        }
                    }else{

                    }
                },function(error){

                });

            


        }
        function changeStatus(student){
            student.status = !student.status;
        }
        function xsre()
        {
            StudentService.getXsre(id)
                .then(function(response){
                    vm.data = response.data;
                    vm.refresh = true;
                    jQuery('#debug_modal').modal("show");
                },function(error){

                })
        }
    }

})(jQuery);