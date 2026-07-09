import { Role } from "./Role";

export interface User {

    id:number;

    nombre:string;

    usuario:string;

    password:string;

    rol:string;

}

export interface Employee {

    id:number;

    nombre:string;

    email:string;

    password:string;

    rol:string;
    
    flotilla:string;

}