import React from "react";

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useAuth } from "../../hooks/useAuth";


const Dashboard: React.FC = () => {

    const { user } = useAuth();


    return (
        <IonPage>

            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        Dashboard Administrador
                    </IonTitle>
                </IonToolbar>
            </IonHeader>


            <IonContent className="ion-padding">

                <h1>
                    Bienvenido {user?.nombre}
                </h1>


                <p>
                    Panel administrativo
                </p>


                <ul>
                    <li>
                        Gestión de empleados
                    </li>

                    <li>
                        Reportes de asistencia
                    </li>

                    <li>
                        Configuración
                    </li>
                </ul>


            </IonContent>

        </IonPage>
    );
};


export default Dashboard;