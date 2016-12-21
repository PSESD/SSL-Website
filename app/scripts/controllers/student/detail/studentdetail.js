(function($) {
    'use strict';

    angular.module('sslv2App')
        .controller('StudentDetailCtrl', StudentDetailCtrl);

    StudentDetailCtrl.$inject = ['$state','StudentService','$stateParams','$interval'];

    function StudentDetailCtrl($state,StudentService,$stateParams,$interval) {

        var vm = this;
        vm.show_loading = true;
        var selectedObj;
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
        var activeMonth;
        var listClassName = [];
        var listOfEvents = [{}];
        var isFirstTime = true;
        var momentjs = moment();
        var listOfDateTime = [];
        var id = $stateParams.id;
        var student = "";
        var list_of_student_data = [];
        var listOfSelectedMonth = [];
        var periods = [];
        var selectedMonth = "";
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
        
        function closeMonthDetail() {
            vm.show_detail = false;
            activeMonth.isActive = false;
            if(listSelectedObj.length > 0)
            {
                _.forEach(listSelectedObj,function (v) {
                    v.show = true;
                })
            }
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
                                    loadAttendance(data);
                                    vm.show_update = true;
                                },function(error){
                                })
                        },function(){

                        });
                },function(error){


                });
        }
        function expand(objMonth,month,year,name,obj,className) {

            if(_.get(activeMonth,'isActive',"") !== ""){
                activeMonth.isActive = false;
                activeMonth = objMonth;
                activeMonth.isActive = true;
            }else{
                activeMonth = objMonth;
                activeMonth.isActive = true;
            }
            if(listSelectedObj.length > 0)
            {
                _.forEach(listSelectedObj,function (v) {
                    v.show = true;
                })
            }
            listSelectedObj.push(obj);
            //obj.show = !obj.show;
            vm.month_name = name;
            isFirstTime = false;
            selectedMonth = year+"-"+month;
            while(vm.selectedMonth.length>0){
                vm.selectedMonth.pop();
            }
            loadDetailMonth(data,month,name,className);
            if(vm.selectedMonth.length>0){
                vm.show_detail = true;
            }else{
                vm.show_detail = false;
            }
        }
        function changeYear(){

            vm.show_detail = false;
            isFirstTime = true;
            while(vm.selectedMonth.length > 0)
            {
                vm.selectedMonth.pop();
            }
            vm.list_of_details = [];
            while(vm.listOfCalendar.length > 0){
                vm.listOfCalendar.pop();
            }
            while (listOfDateTime.length > 0){
                listOfDateTime.pop();
            }
            vm.attandance_show = true;
            if(vm.student.selected_years === null){
                StudentService.getAttendance(id)
                    .then(function(response){

                        var years = _.get(response,'data.info.source.years',"");
                        _.forEach(years,function(value){
                            listOfYears.push({
                                id:_.replace(value,'/','-'),
                                name:_.replace(value,'/','-')
                            })
                        });
                        vm.listOfYears = listOfYears;
                        data = _.get(response,'data.info.data',[]);
                        generateMonth(data);
                        vm.attandance_show = false;
                        setInterval(set_inter,1000)

                    },function(error){

                    });
            }else{
                StudentService.getAttendanceByYear(id,vm.student.selected_years.id)
                    .then(function(response){
                        data  = _.get(response,'data.info.data',[]);
                        generateMonth(data);
                        vm.attandance_show = false;
                        setInterval(set_inter,1000)
                    },function(error){
                    })
            }

        }

        if($stateParams.debug === "true"){
            vm.show_xsre = true;
        }else if($stateParams.debug === undefined){
            vm.show_xsre = false;
        }
        StudentService.getAttendance(id)
            .then(function(response){

                var years = _.get(response,'data.info.source.years',"");
                _.forEach(years,function(value){
                    listOfYears.push({
                        id:_.replace(value,'/','-'),
                        name:_.replace(value,'/','-')
                    })
                });
                vm.listOfYears = listOfYears;
                data = _.get(response,'data.info.data',[]);

                generateMonth(data);
            },function(error){

            });

        init();
        loadGeneral(id);
        function loadDetailMonth(data,month,name,className) {

            var detail;
            _.forEach(data,function (value) {
                _.forEach(value,function (v,k) {
                    var tempDate = v.weekDate.split('-');
                    var tempDate1 = new Date(tempDate[0].trim());
                    var tempDate2 = new Date(tempDate[1].trim());
                    if(month == parseInt(tempDate1.getMonth()+1) && month == parseInt(tempDate2.getMonth()+1)){
                        var Sunday = new Date(v.details[0].S);
                        var Monday = new Date(v.details[0].M);
                        var Tuesday = new Date(v.details[0].T);
                        var Wednesday = new Date(v.details[0].W);
                        var Thursday = new Date(v.details[0].TH);
                        var Friday = new Date(v.details[0].F);
                        var Saturday = new Date(v.details[0].SA);
                        detail ={
                            Sunday:Sunday.getDate(),
                            Monday:Monday.getDate(),
                            Tuesday:Tuesday.getDate(),
                            Wednesday:Wednesday.getDate(),
                            Thursday:Thursday.getDate(),
                            Friday:Friday.getDate(),
                            Saturday:Saturday.getDate(),
                        }
                    }

                    var date = v.weekDate.split('-');
                    var date1;
                    var date2;
                    date1 = new Date(date[0].trim());
                    date2 = new Date(date[1].trim());
                    if(/*parseInt(month) == date1.getMonth()+1 && parseInt(month) == date2.getMonth() + 1 ||*/ parseInt(month - 1) == date2.getMonth()){
                        var listCourses = [];
                        var temp = k.split('-');
                        var from = temp[0].trim().split('/');
                        var to = temp[1].trim().split('/');
                        var tag1;
                        var tag2;
                        from = moment(temp[0]).format('MMM DD YYYY');
                        to = moment(temp[1]).format('MMM DD YYYY');
                        tag1 = moment(temp[0]).format('MMM-DD');
                        tag2 = moment(temp[1]).format('MMM-DD');
                        // _.forIn(v.listCourse,function (v) {
                        //     // if(v !== null){
                        //     //     if(v.length !== 0){
                        //     //         _.forEach(v,function (val) {
                        //     //             var teacherName;
                        //     //             if(val.teacherNames.length > 1){
                        //     //                 teacherName = val.teacherNames[0]+','+val.teacherNames[1]
                        //     //             }else if(val.teacherNames.length === 1){
                        //     //                 teacherName = val.teacherNames[0];
                        //     //             }
                        //     //             var course = {
                        //     //                 title:val.courseTitle,
                        //     //                 number:val.timeTablePeriod,
                        //     //                 teacher:teacherName
                        //     //             }
                        //     //             listCourses.push(course);
                        //     //         })
                        //     //     }else{
                        //     //         listCourses.push([]);
                        //     //     }
                        //     // }
                        // });
                        var weekClass = tag1+"-"+tag2;
                        weekClass = weekClass.replace(" ",'-').trim();
                        listOfSelectedMonth.push({
                            weekName:from+" - "+to,
                            showMonth:true,
                            dates:detail,
                            courses:listCourses,
                            weekClass:weekClass
                        });
                        vm.selectedMonth = listOfSelectedMonth;
                    }
                });
            });
            vm.selectedMonth = listOfSelectedMonth;
            if(className !== ""){
                var collps = setInterval(function () {
                    jQuery('.'+className).collapse('show');
                    clearInterval(collps);
                },100);
            }


        }

        function generateMonth(data){
            var listMonths = [];
            _.forEach(data,function (v,k) {

                _.forEach(v,function (value,key) {
                    var date = key.split('-')
                    date = new Date(date[0].trim());
                    var data;
                    data = value;
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
                            var attendanceEventType = _.get(event,'attendanceEventType',"");
                            var attendanceStatus = _.get(event,'attendanceStatus',"");
                            if(date!=="" && reason !== "" && description !== ""){
                                var temp_template = template;
                                temp_template = _.replace(temp_template,'{date}',date);
                                temp_template = _.replace(temp_template,'{reason}',reason);
                                temp_template = _.replace(temp_template,'{description}',description);
                                detail_columns.monday[key].template = temp_template;
                                if(attendanceEventType !== ""){
                                    listOfEvents.push({
                                        date:new Date(date).getFullYear()+'-'+parseInt(new Date(date).getMonth()+1)+'-'+new Date(date).getDate(),
                                        event:event.attendanceEventType,
                                        eventStatus:attendanceStatus
                                    });
                                }
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
                            var attendanceEventType = _.get(event,'attendanceEventType',"");
                            var attendanceStatus = _.get(event,'attendanceStatus',"");
                            if(date!=="" && reason !== "" && description !== ""){
                                var temp_template = template;
                                temp_template = _.replace(temp_template,'{date}',date);
                                temp_template = _.replace(temp_template,'{reason}',reason);
                                temp_template = _.replace(temp_template,'{description}',description);
                                detail_columns.tuesday[key].template = temp_template;
                                if(attendanceEventType !== ""){
                                    listOfEvents.push({
                                        date:new Date(date).getFullYear()+'-'+parseInt(new Date(date).getMonth()+1)+'-'+new Date(date).getDate(),
                                        event:event.attendanceEventType,
                                        eventStatus:attendanceStatus
                                    });
                                }
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
                            var attendanceEventType = _.get(event,'attendanceEventType',"");
                            var attendanceStatus = _.get(event,'attendanceStatus',"");
                            if(date!=="" && reason !== "" && description !== ""){
                                var temp_template = template;
                                temp_template = _.replace(temp_template,'{date}',date);
                                temp_template = _.replace(temp_template,'{reason}',reason);
                                temp_template = _.replace(temp_template,'{description}',description);
                                detail_columns.wednesday[key].template = temp_template;
                                if(attendanceEventType !== ""){
                                    listOfEvents.push({
                                        date:new Date(date).getFullYear()+'-'+parseInt(new Date(date).getMonth()+1)+'-'+new Date(date).getDate(),
                                        event:event.attendanceEventType,
                                        eventStatus:attendanceStatus
                                    });
                                }
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
                            var attendanceEventType = _.get(event,'attendanceEventType',"");
                            var attendanceStatus = _.get(event,'attendanceStatus',"");
                            if(date!=="" && reason !== "" && description !== ""){
                                var temp_template = template;
                                temp_template = _.replace(temp_template,'{date}',date);
                                temp_template = _.replace(temp_template,'{reason}',reason);
                                temp_template = _.replace(temp_template,'{description}',description);
                                detail_columns.thursday[key].template = temp_template;
                                if(attendanceEventType !== ""){
                                    listOfEvents.push({
                                        date:new Date(date).getFullYear()+'-'+parseInt(new Date(date).getMonth()+1)+'-'+new Date(date).getDate(),
                                        event:event.attendanceEventType,
                                        eventStatus:attendanceStatus
                                    });
                                }
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
                            var attendanceEventType = _.get(event,'attendanceEventType',"");
                            var attendanceStatus = _.get(event,'attendanceStatus',"");
                            if(date!=="" && reason !== "" && description !== ""){
                                var temp_template = template;
                                temp_template = _.replace(temp_template,'{date}',date);
                                temp_template = _.replace(temp_template,'{reason}',reason);
                                temp_template = _.replace(temp_template,'{description}',description);
                                detail_columns.friday[key].template = temp_template;
                                if(attendanceEventType !== ""){
                                    listOfEvents.push({
                                        date:new Date(date).getFullYear()+'-'+parseInt(new Date(date).getMonth()+1)+'-'+new Date(date).getDate(),
                                        event:event.attendanceEventType,
                                        eventStatus:attendanceStatus
                                    });
                                }
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
                            var attendanceEventType = _.get(event,'attendanceEventType',"");
                            var attendanceStatus = _.get(event,'attendanceStatus',"");
                            if(date!=="" && reason !== "" && description !== ""){
                                var temp_template = template;
                                temp_template = _.replace(temp_template,'{date}',date);
                                temp_template = _.replace(temp_template,'{reason}',reason);
                                temp_template = _.replace(temp_template,'{description}',description);
                                detail_columns.saturday[key].template = temp_template;
                                if(attendanceEventType !== ""){
                                    listOfEvents.push({
                                        date:new Date(date).getFullYear()+'-'+parseInt(new Date(date).getMonth()+1)+'-'+new Date(date).getDate(),
                                        event:event.attendanceEventType,
                                        eventStatus:attendanceStatus
                                    });
                                }
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
                            var attendanceEventType = _.get(event,'attendanceEventType',"");
                            var attendanceStatus = _.get(event,'attendanceStatus',"");
                            if(date!=="" && reason !== "" && description !== ""){
                                var temp_template = template;
                                temp_template = _.replace(temp_template,'{date}',date);
                                temp_template = _.replace(temp_template,'{reason}',reason);
                                temp_template = _.replace(temp_template,'{description}',description);
                                detail_columns.sunday[key].template = temp_template;
                                if(attendanceEventType !== ""){
                                    listOfEvents.push({
                                        date:new Date(date).getFullYear()+'-'+parseInt(new Date(date).getMonth()+1)+'-'+new Date(date).getDate(),
                                        event:event.attendanceEventType,
                                        eventStatus:attendanceStatus
                                    });
                                }
                            }else{
                                detail_columns.sunday[key].template = "";
                            }
                        }
                    });
                    listMonths.push({
                        year:date.getFullYear(),
                        month:date.getMonth()
                    });

                    list_of_student_data.push(header_detail);
                })
            });
            listMonths = _.uniqWith(listMonths,_.isEqual);
            _.forEach(listMonths,function(v){
                var clonedMoment = momentjs.clone();
                var moment = _removeTime(clonedMoment.set({'year':v.year,'month':v.month }));
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

            _.forEach(vm.listOfCalendar,function (v,k) {
                listClassName = [];

                _.forEach(v.data,function (data) {
                    var temp1 = data.days[0].date;
                    var temp2 = data.days[6].date;
                   //var list = 'week_'+temp1.add(1,'d').format("DD") +'_'+ temp2.add(1,'d').format("DD"); Nov 08 2015-Nov 02 2015
                    var list = moment(temp1).add(1,'d').format('MMM-DD')+'-'+moment(temp2).add(1,'d').format('MMM-DD');
                    list = list.replace(" ","-").trim();
                   listClassName.push(list);
                });
                vm.listOfCalendar[k].listClassName = listClassName;
            });
            vm.show_attendance = true;
        }
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
                            enrollment = _.get(data,'personal.xSre.otherEnrollments',"");
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
                            if(student.personal.emergency2.name === "" || student.personal.emergency2.relationship === "" || student.personal.emergency2.phone === "" || student.personal.emergency2.email === "")
                            {
                                student.personal.additional_status = false;
                            }else{
                                student.personal.additional_status = false;
                            }
                            vm.student = student;
                            vm.show_general = true;
                    }
                },function (error) {

                });
        }
        function loadAttendance(data){

            var legend = [];

            vm.attandance_show = false;
            list_of_student_data = [];
            _.forEach(data,function(values){

                for(var v in values){
                    var isValid = false;
                    var dateTime;
                    var date;
                    var data = values[v];
                    if(v.indexOf('-')>-1){
                        dateTime = v.split('-');
                        date = new Date(dateTime[0]);
                    }
                    if(selectedMonth === date.getFullYear()+'-'+parseInt(date.getMonth()+1)){
                        isValid = true;
                    }


                        data = values[v];
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
                                var attendanceEventType = _.get(event,'attendanceEventType',"");
                                var attendanceStatus = _.get(event,'attendanceStatus',"");
                                if(date!=="" && reason !== "" && description !== ""){
                                    var temp_template = template;
                                    temp_template = _.replace(temp_template,'{date}',date);
                                    temp_template = _.replace(temp_template,'{reason}',reason);
                                    temp_template = _.replace(temp_template,'{description}',description);
                                    detail_columns.monday[key].template = temp_template;
                                    if(attendanceEventType !== ""){
                                        listOfEvents.push({
                                            date:new Date(date).getFullYear()+'-'+parseInt(new Date(date).getMonth()+1)+'-'+new Date(date).getDate(),
                                            event:event.attendanceEventType,
                                            eventStatus:attendanceStatus
                                        });
                                    }
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
                                var attendanceEventType = _.get(event,'attendanceEventType',"");
                                var attendanceStatus = _.get(event,'attendanceStatus',"");
                                if(date!=="" && reason !== "" && description !== ""){
                                    var temp_template = template;
                                    temp_template = _.replace(temp_template,'{date}',date);
                                    temp_template = _.replace(temp_template,'{reason}',reason);
                                    temp_template = _.replace(temp_template,'{description}',description);
                                    detail_columns.tuesday[key].template = temp_template;
                                    if(attendanceEventType !== ""){
                                        listOfEvents.push({
                                            date:new Date(date).getFullYear()+'-'+parseInt(new Date(date).getMonth()+1)+'-'+new Date(date).getDate(),
                                            event:event.attendanceEventType,
                                            eventStatus:attendanceStatus
                                        });
                                    }
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
                                var attendanceEventType = _.get(event,'attendanceEventType',"");
                                var attendanceStatus = _.get(event,'attendanceStatus',"");
                                if(date!=="" && reason !== "" && description !== ""){
                                    var temp_template = template;
                                    temp_template = _.replace(temp_template,'{date}',date);
                                    temp_template = _.replace(temp_template,'{reason}',reason);
                                    temp_template = _.replace(temp_template,'{description}',description);
                                    detail_columns.wednesday[key].template = temp_template;
                                    if(attendanceEventType !== ""){
                                        listOfEvents.push({
                                            date:new Date(date).getFullYear()+'-'+parseInt(new Date(date).getMonth()+1)+'-'+new Date(date).getDate(),
                                            event:event.attendanceEventType,
                                            eventStatus:attendanceStatus
                                        });
                                    }
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
                                var attendanceEventType = _.get(event,'attendanceEventType',"");
                                var attendanceStatus = _.get(event,'attendanceStatus',"");
                                if(date!=="" && reason !== "" && description !== ""){
                                    var temp_template = template;
                                    temp_template = _.replace(temp_template,'{date}',date);
                                    temp_template = _.replace(temp_template,'{reason}',reason);
                                    temp_template = _.replace(temp_template,'{description}',description);
                                    detail_columns.thursday[key].template = temp_template;
                                    if(attendanceEventType !== ""){
                                        listOfEvents.push({
                                            date:new Date(date).getFullYear()+'-'+parseInt(new Date(date).getMonth()+1)+'-'+new Date(date).getDate(),
                                            event:event.attendanceEventType,
                                            eventStatus:attendanceStatus
                                        });
                                    }
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
                                var attendanceEventType = _.get(event,'attendanceEventType',"");
                                var attendanceStatus = _.get(event,'attendanceStatus',"");
                                if(date!=="" && reason !== "" && description !== ""){
                                    var temp_template = template;
                                    temp_template = _.replace(temp_template,'{date}',date);
                                    temp_template = _.replace(temp_template,'{reason}',reason);
                                    temp_template = _.replace(temp_template,'{description}',description);
                                    detail_columns.friday[key].template = temp_template;
                                    if(attendanceEventType !== ""){
                                        listOfEvents.push({
                                            date:new Date(date).getFullYear()+'-'+parseInt(new Date(date).getMonth()+1)+'-'+new Date(date).getDate(),
                                            event:event.attendanceEventType,
                                            eventStatus:attendanceStatus
                                        });
                                    }
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
                                var attendanceEventType = _.get(event,'attendanceEventType',"");
                                var attendanceStatus = _.get(event,'attendanceStatus',"");
                                if(date!=="" && reason !== "" && description !== ""){
                                    var temp_template = template;
                                    temp_template = _.replace(temp_template,'{date}',date);
                                    temp_template = _.replace(temp_template,'{reason}',reason);
                                    temp_template = _.replace(temp_template,'{description}',description);
                                    detail_columns.saturday[key].template = temp_template;
                                    if(attendanceEventType !== ""){
                                        listOfEvents.push({
                                            date:new Date(date).getFullYear()+'-'+parseInt(new Date(date).getMonth()+1)+'-'+new Date(date).getDate(),
                                            event:event.attendanceEventType,
                                            eventStatus:attendanceStatus
                                        });
                                    }
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
                                var attendanceEventType = _.get(event,'attendanceEventType',"");
                                var attendanceStatus = _.get(event,'attendanceStatus',"");
                                if(date!=="" && reason !== "" && description !== ""){
                                    var temp_template = template;
                                    temp_template = _.replace(temp_template,'{date}',date);
                                    temp_template = _.replace(temp_template,'{reason}',reason);
                                    temp_template = _.replace(temp_template,'{description}',description);
                                    detail_columns.sunday[key].template = temp_template;
                                    if(attendanceEventType !== ""){
                                        listOfEvents.push({
                                            date:new Date(date).getFullYear()+'-'+parseInt(new Date(date).getMonth()+1)+'-'+new Date(date).getDate(),
                                            event:event.attendanceEventType,
                                            eventStatus:attendanceStatus
                                        });
                                    }
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
                        var arrMonth = header_detail.date.split('-');
                        var date = new Date(arrMonth[0].trim());
                        var month_detail = {
                            month:date.getMonth() +1,
                            year:date.getFullYear()
                        }
                        var list_of_item = {
                            header:header,
                            header_detail:header_detail,
                            detail_columns:detail_columns,
                            periods:_.uniq(periods),
                            behaviors:behaviors,
                            status:false,
                            events:listOfEvents,
                            month:month_detail
                        }
                            list_of_student_data.push(list_of_item);
                            vm.legend = _.uniq(legend);
                            vm.list_of_details = list_of_student_data;

                        if(list_of_student_data.length !== 0){
                            vm.show_attendance = true;
                        }else{
                            vm.show_attendance = false;
                        }
                        console.log(isValid);
                        if(isValid === true)
                        {
                            listOfSelectedMonth.push(list_of_item);

                            vm.selectedMonth = listOfSelectedMonth;

                        }

                }

            });

            _.forEach(vm.list_of_details,function (value) {
                var datetime = value.header_detail.date.split('-');
                datetime = new Date(datetime[0].trim());
                listOfDateTime.push({
                    "year":datetime.getFullYear(),
                    "month":datetime.getMonth(),
                    "date":datetime.getDay()
                });
                listOfDateTime = _.uniqWith(listOfDateTime,_.isEqual);
            });
            _.forEach(listOfDateTime,function(v){
                var clonedMoment = momentjs.clone();
                var moment = _removeTime(clonedMoment.set({'year':v.year,'month':v.month }));
                var month = moment.clone();

                var start = moment.clone();

                start.date(1);

                _removeTime(start.day(0));
                if(isFirstTime === true){
                    vm.listOfCalendar.push(
                        {
                            'data':_buildMonth(start,month),
                            'name':moment
                        });
                }
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

        var object = null;
        function set_inter() {
            object = jQuery('.missed-late-class-container .late-class').html();
            if(object != undefined){
                _.forEach(listOfEvents,function (v) {
                    var date = _.get(v,'date',"");
                    if(date !== "")
                    {

                        if(v.event === "Daily Attendance" && (v.eventStatus === "ExcusedAbsence" || v.eventStatus === "UnexcusedAbsence"))
                        {
                            jQuery("#"+date+" .missed-day").removeClass('hide');
                        }else{
                            if(v.event === "ClassSectionAttendance" && v.eventStatus === "Tardy"){
                                jQuery("#"+date+" .late-class").removeClass('hide');
                            }
                            if(v.event === "ClassSectionAttendance" && v.eventStatus === "Unexcused")
                                jQuery("#"+date+" .missed-class").removeClass('hide');
                        }
                    }

                })
                clearInterval(inter);
            }
        }
        var inter = setInterval(set_inter,1000)
    }

})(jQuery);