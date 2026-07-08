import { createContext } from "react";

import { User } from "../models/User";


interface AuthContextType {


    user: User | null;


    login(
        usuario:string,
        password:string
    ): Promise<User | null>;



    logout(): Promise<void>;


}



const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
);



export default AuthContext;