import { ReactNode, useState } from "react";
import AuthContext from "./AuthContext";

interface Props{

    children:ReactNode;

}

const AuthProvider=({children}:Props)=>{

    const [user,setUser]=useState(null);

    return(

        <AuthContext.Provider
            value={{

                user,

                setUser

            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export default AuthProvider;