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
Dashboard Empleado
</IonTitle>

</IonToolbar>

</IonHeader>



<IonContent className="ion-padding">


<h1>
Hola {user?.nombre}
</h1>


<p>
Panel del empleado
</p>


<ul>

<li>
Registrar entrada
</li>


<li>
Registrar salida
</li>


<li>
Consultar historial
</li>


</ul>


</IonContent>


</IonPage>


);


};


export default Dashboard;