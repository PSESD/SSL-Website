(function() {
    'use strict';

    angular.module('sslv2App')
        .controller('StudentDetailCtrl', StudentDetailCtrl);

    StudentDetailCtrl.$inject = ['$state','StudentService','$stateParams'];

    function StudentDetailCtrl($state,StudentService,$stateParams) {

        var vm = this;
        var id = $stateParams.id;
        var student = "";
        init();

        function init(){
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

            StudentService.getStudentById(id)
                .then(function(response){
                    if(response.data.success === true){
                        var data = _.get(response,'data.info',"");
                        student.embedded.programs = data._embedded.programs;
                        student.embedded.users = data._embedded.users;
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
                            student.personal.xsre.demographics.races = data.personal.xSre.demographics.races;
                        }
                        student.personal.xsre.demographics.sex = data.personal.xSre.demographics.sex;
                        student.personal.xsre.email = data.personal.xSre.email;
                        student.personal.xsre.enrollment.enrollment_status = data.personal.xSre.enrollment.enrollmentStatus;
                        student.personal.xsre.enrollment.enrollment_status_description = data.personal.xSre.enrollment.enrollmentStatusDescription;
                        student.personal.xsre.enrollment.entry_date = data.personal.xSre.enrollment.entryDate;
                        student.personal.xsre.enrollment.exit_date = data.personal.xSre.enrollment.exitDate;
                        student.personal.xsre.enrollment.grade_level = data.personal.xSre.enrollment.gradeLevel;
                        student.personal.xsre.enrollment.lea_ref_id = data.personal.xSre.enrollment.leaRefId;
                        student.personal.xsre.enrollment.membership_type = data.personal.xSre.enrollment.membershipType;
                        student.personal.xsre.enrollment.projected_graduation_year = data.personal.xSre.enrollment.projectedGraduationYear;
                        student.personal.xsre.enrollment.school_name = data.personal.xSre.enrollment.schoolName;
                        student.personal.xsre.enrollment.school_ref_id = data.personal.xSre.enrollment.schoolRefId;
                        student.personal.xsre.enrollment.school_year = data.personal.xSre.enrollment.schoolYear;
                        student.personal.xsre.languages = data.personal.xSre.languages;
                        student.personal.xsre.local_id = data.personal.xSre.localId;
                        student.personal.xsre.other_emails = data.personal.xSre.otherEmails;
                        student.personal.xsre.other_enrollments = data.personal.xSre.otherEnrollments;
                        student.personal.xsre.other_phone_numbers = data.personal.xSre.otherPhoneNumbers;
                        student.personal.xsre.phone_number = data.personal.xSre.phoneNumber;
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
                        student.transcript.source.transcript_term.school.lea_ref_id = data.source.transcriptTerm.school.leaRefId;
                        student.transcript.source.transcript_term.school.local_id = data.source.transcriptTerm.school.localId;
                        student.transcript.source.transcript_term.school.school_name = data.source.transcriptTerm.school.schoolName;
                        student.transcript.source.transcript_term.school_year = data.source.transcriptTerm.schoolYear;
                    }
                },function(error){
                    console.log(error);
                });

            StudentService.getAttendance(id)
                .then(function(response){
                    console.log(response);
                },function(error){
                    console.log(error);
                });

        }
    }

})();