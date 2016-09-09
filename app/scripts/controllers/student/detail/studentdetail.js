(function($) {
    'use strict';

    angular.module('sslv2App')
        .controller('StudentDetailCtrl', StudentDetailCtrl);

    StudentDetailCtrl.$inject = ['$state','StudentService','$stateParams','$q','$timeout','$http','RESOURCES','$cookies'];

    function StudentDetailCtrl($state,StudentService,$stateParams,$http,RESOURCES,$cookies) {

        var vm = this;
        var id = $stateParams.id;
        var student = "";
        var list_of_student_data = [];
        var periods = [];
        vm.text ="";
        vm.changeStatus = changeStatus;
        vm.student_id = $stateParams.id;
        vm.list_of_details = "";
        vm.list_programs = [];
        vm.list_program_years = [];
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
             },function(error){
                 console.log(error);
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
                        _.forEach(data,function(high_school_value){
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
                    }
                },function(error){
                    console.log(error);
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
                        vm.assessment = response.data.info.data;
                    }
                },function(error){
                    console.log(error);
                });

            StudentService.getStudentById(id)
                .then(function(response){
                    if(response.data.success === true){
                        var data = _.get(response,'data.info',"");
                        student.embedded.programs = _.get(data,'_embedded.programs',"");
                        student.embedded.users = _.get(data,'_embedded.users',"");
                        student.last_update = data.lastUpdated;
                        student.report_date = data.reportDate;
                        student.local_id = data.localId;
                        student.personal.address = data.personal.address;
                        student.personal.college_bound = data.personal.collegeBound;
                        student.personal.days_absent = data.personal.daysAbsent;
                        student.personal.days_in_attendance = data.personal.daysInAttendance;
                        student.personal.eligibility_status = data.personal.eligibilityStatus;
                        student.personal.email = data.personal.email;
                        student.personal.emergency1.email = data.personal.emergency1.email;
                        student.personal.emergency1.mentor = data.personal.emergency1.mentor;
                        student.personal.emergency1.name = data.personal.emergency1.name;
                        student.personal.emergency1.phone = data.personal.emergency1.phone;
                        student.personal.emergency1.relationship = data.personal.emergency1.relationship
                        student.personal.emergency2.email = data.personal.emergency1.email;
                        student.personal.emergency2.mentor = data.personal.emergency1.mentor;
                        student.personal.emergency2.name = data.personal.emergency1.name;
                        student.personal.emergency2.phone = data.personal.emergency1.phone;
                        student.personal.emergency2.relationship = data.personal.emergency1.relationship;
                        student.personal.enrollment_status = data.personal.enrollmentStatus;
                        student.personal.first_name = data.personal.firstName;
                        student.personal.last_name = data.personal.lastName;
                        student.personal.idea_indicator = data.personal.ideaIndicator;
                        student.personal.middle_name = data.personal.middleName;
                        student.personal.phone = data.personal.phone;
                        student.personal.school_district = data.personal.schoolDistrict;
                        student.personal.school_year = data.personal.schoolYear;
                        student.personal.section_504_status = data.personal.section504Status;
                        student.personal.summary.attendance_count = data.personal.summary.attendanceCount;
                        student.personal.summary.behavior_count = data.personal.summary.behaviorCount;
                        student.personal.summary.date = data.personal.summary.date;
                        student.personal.summary.risk_flag = data.personal.summary.riskFlag;
                        student.personal.xsre.address = data.personal.xSre.address;
                        student.personal.xsre.demographics.birth_date = data.personal.xSre.demographics.birthDate;
                        student.personal.xsre.demographics.hispanic_latino_ethnicity = data.personal.xSre.demographics.hispanicLatinoEthnicity;
                        if(data.personal.xSre.demographics.races.length > 0){
                            student.personal.xsre.demographics.races = data.personal.xSre.demographics.races.join();
                        }else{
                            if(data.personal.xSre.demographics.races.length === 0){
                                student.personal.xsre.demographics.races = '';
                            }else{
                                student.personal.xsre.demographics.races = data.personal.xSre.demographics.races;
                            }
                        }
                        student.personal.xsre.demographics.sex = data.personal.xSre.demographics.sex;
                        student.personal.xsre.email = data.personal.xSre.email;
                        student.personal.xsre.enrollment.enrollment_status = data.personal.xSre.enrollment.enrollmentStatus;
                        student.personal.xsre.enrollment.enrollment_status_description = data.personal.xSre.enrollment.enrollmentStatusDescription;
                        student.personal.xsre.enrollment.entry_date = data.personal.xSre.enrollment.entryDate;
                        student.personal.xsre.enrollment.exit_date = data.personal.xSre.enrollment.exitDate;
                        student.personal.xsre.enrollment.grade_level = data.personal.xSre.enrollment.gradeLevel;
                        student.personal.xsre.enrollment.lea_ref_id = _.get(data,'personal.xSre.enrollment.leaRefId',"");
                        student.personal.xsre.enrollment.membership_type = data.personal.xSre.enrollment.membershipType;
                        student.personal.xsre.enrollment.projected_graduation_year = data.personal.xSre.enrollment.projectedGraduationYear;
                        student.personal.xsre.enrollment.school_name = _.get(data,'personal.xSre.enrollment.schoolName',"");
                        student.personal.xsre.enrollment.school_ref_id = data.personal.xSre.enrollment.schoolRefId;
                        student.personal.xsre.enrollment.school_year = data.personal.xSre.enrollment.schoolYear;
                        student.personal.xsre.languages = data.personal.xSre.languages;
                        student.personal.xsre.local_id = data.personal.xSre.localId;
                        student.personal.xsre.other_emails = data.personal.xSre.otherEmails;
                        student.personal.xsre.other_enrollments = data.personal.xSre.otherEnrollments;
                        student.personal.xsre.other_phone_numbers = data.personal.xSre.otherPhoneNumbers;
                        student.personal.xsre.phone_number = data.personal.xSre.phoneNumber;

                        _.forEach(student.embedded.programs,function(value){
                            vm.list_program_years.push(new Date(value.participation_start_date).getFullYear());
                           var program = {
                               "years":new Date(value.participation_start_date).getFullYear(),
                               "name":value.program_name,
                               "start_date":value.participation_start_date,
                               "end_date":new Date(value.participation_end_date) >= Date.now()?'Present':value.participation_end_date,
                               "active": value.active ? 'Active':'Inactive',
                               "cohorts":value.cohort
                           };
                            vm.list_programs.push(program);
                        });
                        vm.list_program_years = _.uniq(vm.list_program_years);
                        vm.list_programs = _.sortBy(vm.list_programs,function(val){return val.years});
                        vm.student = student;
                    }
                },function (error) {
                    console.log(error);
                });

            StudentService.getTranscript(id)
                .then(function(response){
                    if(response.data.success === true){
                        var data = _.get(response,'data.info',"");
                        student.transcript.data = data.data;
                        student.transcript.source.academic_summary.class_rank = data.source.academicSummary.classRank;
                        student.transcript.source.academic_summary.cumulative_gpa = data.source.academicSummary.cumulativeGpa;
                        student.transcript.source.academic_summary.gpa_scale = data.source.academicSummary.gpaScale;
                        student.transcript.source.academic_summary.term_credits_attempted = data.source.academicSummary.termCreditsAttempted;
                        student.transcript.source.academic_summary.term_credits_earned = data.source.academicSummary.termCreditsEarned;
                        student.transcript.source.academic_summary.term_weighted_gpa = data.source.academicSummary.termWeightedGpa;
                        student.transcript.source.academic_summary.total_credits_attempted = data.source.academicSummary.totalCreditsAttempted;
                        student.transcript.source.academic_summary.total_credits_earned = data.source.academicSummary.totalCreditsEarned;
                        student.transcript.source.credits = data.source.credits;
                        student.transcript.source.grade_level = data.source.gradeLevel;
                        student.transcript.source.info.grade_level = data.source.info.gradeLevel;
                        student.transcript.source.info.total_attempted = data.source.info.totalAttempted;
                        student.transcript.source.info.total_earned = data.source.info.totalEarned;
                        student.transcript.source.subject = data.source.subject;
                        student.transcript.source.subject_values = data.source.subjectValues;
                        student.transcript.source.total_credits_attempted = data.source.totalCreditsAttempted;
                        student.transcript.source.total_credits_earned = data.source.totalCreditsEarned;
                        student.transcript.source.total_cumulative_gpa = data.source.totalCumulativeGpa;
                        student.transcript.source.transcript_term.courses = data.source.transcriptTerm.courses;
                        student.transcript.source.transcript_term.school.lea_ref_id = _.get(data,'source.transcriptTerm.school.leaRefId',"");
                        student.transcript.source.transcript_term.school.local_id = _.get(data,'source.transcriptTerm.school.localId',"");
                        student.transcript.source.transcript_term.school.school_name = data.source.transcriptTerm.school.schoolName;
                        student.transcript.source.transcript_term.school_year = data.source.transcriptTerm.schoolYear;
                    }
                },function(error){
                    console.log(error);
                });

            


        }
        function changeStatus(student){
            student.status = !student.status;
        }
    }

})(jQuery);