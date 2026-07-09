import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonImg,
  IonRow,
  IonCol,
  IonLoading
} from "@ionic/react";

import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Geolocation } from "@capacitor/geolocation";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (photo: string, lat: number, lng: number) => void;
}

const RegisterAttendanceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [loadingLocation, setLoadingLocation] = useState(false); 

  const closeModalAndReset = () => {
    setPhoto(undefined);
    setLat(0);
    setLng(0);
    setLoadingLocation(false);
    onClose();
  };

  const takePhoto = async () => {
    // 1. INTENTAR LA CÁMARA PRIMERO
    try {
      console.log("Iniciando cámara...");
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera 
      });

      console.log("Foto obtenida con éxito");
      if (image && image.dataUrl) {
        setPhoto(image.dataUrl);
      }
    } catch (error) {
      console.error("Error en Cámara:", error);
      alert("Error / Cancelación en Cámara: " + JSON.stringify(error));
    }

    try {
      console.log("Iniciando GPS...");
      setLoadingLocation(true);
      
      const location = await Geolocation.getCurrentPosition({
        enableHighAccuracy: false, 
        timeout: 7000             
      });
      
      console.log("GPS obtenido con éxito:", location.coords);
      setLat(location.coords.latitude);
      setLng(location.coords.longitude);
    } catch (error) {
      console.error("Error en GPS:", error);
      alert("Error en GPS: " + JSON.stringify(error) + "\n\nVerifica que diste permisos de ubicación en la barra de direcciones.");
    } finally {
      setLoadingLocation(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={closeModalAndReset}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registrar asistencia</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        
        {photo ? (
          <div className="ion-text-center ion-margin-bottom">
            <IonImg 
              src={photo} 
              style={{ maxHeight: "300px", borderRadius: "8px", objectFit: "cover" }} 
            />
            <IonButton fill="clear" color="medium" onClick={takePhoto}>
              Cambiar fotografía
            </IonButton>
          </div>
        ) : (
          <IonButton expand="block" onClick={takePhoto} className="ion-margin-bottom">
            Tomar fotografía obligatoria
          </IonButton>
        )}

        <hr />

        <div className="ion-margin-vertical">
          <h5>Ubicación</h5>
          {loadingLocation && (
            <IonRow className="ion-align-items-center">
              <IonCol size="auto">
                <IonLoading isOpen={true} message="Obteniendo GPS..." spinner="crescent" backdropDismiss={false}/>
              </IonCol>
            </IonRow>
          )}

          {lat !== 0 && !loadingLocation && (
            <p style={{ fontSize: '0.9em', color: '#666' }}>
              <b>Lat:</b> {lat.toFixed(6)} <br />
              <b>Lng:</b> {lng.toFixed(6)}
            </p>
          )}
          
          {lat === 0 && !loadingLocation && photo && (
             <p style={{ color: 'red' }}>No se pudo obtener la ubicación automáticamente.</p>
          )}
        </div>

        {/* Botones de Acción */}
        <IonRow className="ion-margin-top">
          <IonCol>
            <IonButton
              expand="block"
              fill="outline"
              color="medium"
              onClick={closeModalAndReset}
            >
              Cancelar
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton
              expand="block"
              disabled={!photo || loadingLocation} 
              onClick={() => {
                if(photo) {
                  onSave(photo, lat, lng);
                  closeModalAndReset();
                }
              }}
            >
              Confirmar
            </IonButton>
          </IonCol>
        </IonRow>

      </IonContent>
    </IonModal>
  );
};

export default RegisterAttendanceModal;