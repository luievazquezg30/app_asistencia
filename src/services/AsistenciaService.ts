import { attendanceMock } from "../data/asistencias";
import { Attendance } from "../models/Asistencia";


class AttendanceService {



    getAttendance():Attendance[]{


        return attendanceMock;


    }



    getAttendanceByEmployee(
        employeeId:number
    ):Attendance[]{


        return attendanceMock.filter(
            item => item.employeeId === employeeId
        );


    }



    registerAttendance(
        attendance:Attendance
    ){


        attendanceMock.push(attendance);


        return attendance;


    }



}



export default new AttendanceService();