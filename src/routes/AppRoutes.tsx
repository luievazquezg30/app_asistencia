import { Redirect, Route } from "react-router-dom";
import { IonRouterOutlet } from "@ionic/react";

import Login from "../Auth/login";
import AdminDashboard from "../pages/Admin/dashboard";
import SupervisorDashboard from "../pages/Supervisor/dashboard";
import EmpleadoDashboard from "../pages/Empleado/dashboard";
import RegistrarUbicacion from "../components/registrarUbicacion"; 
import VisualizarFlotilla from "../components/visualizarFlotilla"; 

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
                path="/admin"
                component={AdminDashboard}
            />

            <Route
                exact
                path="/supervisor"
                component={SupervisorDashboard}
            />

            <Route
                exact
                path="/empleado"
                component={EmpleadoDashboard}
            />

            <Route
                exact
                path="/registrarUbicacion"
                component={RegistrarUbicacion}
            />

            <Route
                exact
                path="/visualizarFlotilla"
                component={VisualizarFlotilla}
            />

            <Route 
                exact 
                path="/visualizarFlotilla/:nombreFlotilla" 
                component={VisualizarFlotilla} 
            />

            <Route
                exact
                path="/"
                render={() => (
                    <Redirect to="/login"/>
                )}
            />

            <Route component={NotFound}/>
        </IonRouterOutlet>
    );
}

export default AppRoutes;