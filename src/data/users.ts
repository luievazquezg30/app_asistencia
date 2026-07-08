import { User } from "../models/User";
import { Role } from "../models/Role";

export const users:User[] = [

{
    id:1,
    nombre:"Administrador",
    usuario:"admin",
    password:"1234",
    rol:Role.ADMIN
},

{
    id:2,
    nombre:"Juan Supervisor",
    usuario:"supervisor",
    password:"1234",
    rol:Role.SUPERVISOR
},

{
    id:3,
    nombre:"Pedro Empleado",
    usuario:"empleado",
    password:"1234",
    rol:Role.EMPLEADO
}

];