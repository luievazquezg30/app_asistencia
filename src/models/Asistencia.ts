export interface Attendance {

    id:number;

    employeeId:number;

    date:string;

    entryTime:string;

    exitTime:string;

    status:string;

    photo?:string;

    latitude?:number;

    longitude?:number;

}