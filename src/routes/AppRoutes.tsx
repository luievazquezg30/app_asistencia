import { Redirect, Route } from "react-router-dom";

import {

    IonRouterOutlet

} from "@ionic/react";

import Login from "../Auth/login";
import NotFound from "../Shared/notFound";

const AppRoutes = () => {

    return (

        <IonRouterOutlet>

            <Route
                exact
                path="/login"
                component={Login}
            />

            <Route
                exact
                path="/"
            >

                <Redirect to="/login"/>

            </Route>

            <Route component={NotFound}/>

        </IonRouterOutlet>

    );

}

export default AppRoutes;