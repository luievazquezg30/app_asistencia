import { Attendance } from "../models/Asistencia";


export const attendanceMock:Attendance[]=[


{
    id:1,
    employeeId:1,
    date:"2026-07-07",
    entryTime:"08:00",
    exitTime:"17:00",
    status:"Completa"
},


{
    id:2,
    employeeId:3,
    date:"2026-07-09",
    entryTime:"08:15",
    exitTime:"17:00",
    status:"Completa"
},

{
    id:3,
    employeeId:1,
    date:"2026-07-07",
    entryTime:"08:00",
    exitTime:"17:00",
    status:"Completa"
},


{
    id:4,
    employeeId:4,
    date:"2026-07-07",
    entryTime:"08:15",
    exitTime:"17:00",
    status:"En curso"
},
{
    id:5,
    employeeId:4,
    date:"2026-07-07",
    entryTime:"08:15",
    exitTime:"",
    status:"En curso"
},
{
    id:6,
    employeeId:4,
    date:"2026-07-07",
    entryTime:"08:15",
    exitTime:"20:15",
    status:"Completa"
}



];
