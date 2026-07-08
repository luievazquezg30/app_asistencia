import { Redirect, Route } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const PrivateRoute = ({

component:Component,

...

rest

}:any)=>{

const {user}=useAuth();

return(

<Route

{...rest}

render={(props)=>

user?

<Component {...props}/>

:

<Redirect to="/login"/>

}

/>

);

}

export default PrivateRoute;