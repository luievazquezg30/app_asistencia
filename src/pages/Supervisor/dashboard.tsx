import React from "react";

import { 
IonContent,
IonHeader,
IonPage,
IonTitle,
IonToolbar
} from "@ionic/react";

import { useAuth } from "../../hooks/useAuth";


const Dashboard: React.FC = () => {


const {user}=useAuth();


return(

<IonPage>


<IonHeader>

<IonToolbar>

<IonTitle>
Dashboard Supervisor
</IonTitle>

</IonToolbar>

</IonHeader>



<IonContent className="ion-padding">


<h1>
Bienvenido {user?.nombre}
</h1>


<p>
Panel de supervisión
</p>


<ul>

<li>
Revisar asistencias
</li>

<li>
Validar incidencias
</li>

<li>
Consultar empleados
</li>


</ul>


</IonContent>


</IonPage>

);


};


export default Dashboard;