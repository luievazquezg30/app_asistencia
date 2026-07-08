import {

IonModal,
IonHeader,
IonToolbar,
IonTitle,
IonContent,
IonButton,
IonImg

} from "@ionic/react";

import { Camera, CameraResultType } from "@capacitor/camera";
import { Geolocation } from "@capacitor/geolocation";

import { useState } from "react";

interface Props{

isOpen:boolean;

onClose:()=>void;

onSave:(photo:string,lat:number,lng:number)=>void;

}

const RegisterAttendanceModal:React.FC<Props>=({

isOpen,
onClose,
onSave

})=>{

const [photo,setPhoto]=useState("");

const [lat,setLat]=useState(0);

const [lng,setLng]=useState(0);

const takePhoto=async()=>{

const image=await Camera.getPhoto({

quality:80,

allowEditing:false,

resultType:CameraResultType.DataUrl

});

setPhoto(image.dataUrl!);

const location=await Geolocation.getCurrentPosition();

setLat(location.coords.latitude);

setLng(location.coords.longitude);

};

return(

<IonModal isOpen={isOpen}>

<IonHeader>

<IonToolbar>

<IonTitle>

Registrar asistencia

</IonTitle>

</IonToolbar>

</IonHeader>

<IonContent className="ion-padding">

<IonButton expand="block" onClick={takePhoto}>

Tomar fotografía

</IonButton>

{

photo &&

<IonImg src={photo}/>

}

{

lat!==0 &&

<p>

Latitud: {lat}

<br/>

Longitud: {lng}

</p>

}

<IonButton

expand="block"

onClick={()=>onSave(photo,lat,lng)}

>

Confirmar

</IonButton>

<IonButton

expand="block"

fill="outline"

onClick={onClose}

>

Cancelar

</IonButton>

</IonContent>

</IonModal>

);

};

export default RegisterAttendanceModal;