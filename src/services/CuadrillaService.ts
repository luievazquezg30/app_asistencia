import { attendanceMock } from "../data/asistencias";
import { Attendance } from "../models/Asistencia";

class AttendanceService {

  getAttendance(): Attendance[] {
    return attendanceMock;
  }

  getAttendanceById(id: number): Attendance | undefined {
    return attendanceMock.find(
      attendance => attendance.id === id
    );
  }

  getAttendanceByEmployee(employeeId: number): Attendance[] {
    return attendanceMock.filter(
      attendance => attendance.employeeId === employeeId
    );
  }

}

export default new AttendanceService();