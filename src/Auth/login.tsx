import React, { useState } from "react";

import {
    IonPage,
    IonContent,
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
    IonText
} from "@ionic/react";

import { useHistory } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";



const Login: React.FC = () => {


    const [usuario, setUsuario] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");


    const { login } = useAuth();


    const history = useHistory();



    const ingresar = async()=>{


    setError("");


    const usuarioLogueado = await login(
        usuario,
        password
    );


    if(!usuarioLogueado){

        setError(
            "Credenciales incorrectas"
        );

        return;

    }



    switch(usuarioLogueado.rol){


        case "admin":

            history.replace("/admin");

        break;



        case "supervisor":

            history.replace("/supervisor");

        break;



        case "empleado":

            history.replace("/empleado");

        break;



        default:

            setError(
                "Rol no válido"
            );

        break;


    }


};


    return (

        <IonPage>

            <IonContent
                className="ion-padding"
            >


                <IonItem>

                    <IonLabel position="floating">
                        Usuario
                    </IonLabel>

                    <IonInput

                        value={usuario}

                        onIonChange={(e)=>
                            setUsuario(
                                e.detail.value!
                            )
                        }

                    />

                </IonItem>



                <IonItem>

                    <IonLabel position="floating">
                        Contraseña
                    </IonLabel>


                    <IonInput

                        type="password"

                        value={password}

                        onIonChange={(e)=>
                            setPassword(
                                e.detail.value!
                            )
                        }

                    />


                </IonItem>



                {
                    error && (

                        <IonText color="danger">

                            <p>
                                {error}
                            </p>

                        </IonText>

                    )
                }



                <IonButton

                    expand="block"

                    onClick={ingresar}

                >

                    Ingresar

                </IonButton>



            </IonContent>


        </IonPage>

    );


};


export default Login;