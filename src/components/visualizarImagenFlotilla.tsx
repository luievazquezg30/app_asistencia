import React, { useEffect, useState } from "react";
import { 
  IonContent, IonPage, IonHeader, IonToolbar, IonTitle, 
  IonButton, IonIcon, IonButtons, IonCard, IonCardContent, 
  IonLabel, IonItem, IonList, IonNote 
} from "@ionic/react";
import { arrowBackOutline, personCircleOutline } from "ionicons/icons";
import { useHistory, useParams } from "react-router-dom";
import { employees } from "../data/cuadrillas";
import './VisualizarImagenFlotilla.css';

const VisualizarImagenFlotilla: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const empleado = employees.find(e => e.id.toString() === id);
  const [imgData, setImgData] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("empleado_foto_base64");
    if (stored) {
      setImgData(stored.startsWith("data:image") ? stored : `data:image/jpeg;base64,${stored}`);
    }
  }, []);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon slot="icon-only" icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Detalle del Empleado</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f1f5f9' }}>
        {empleado ? (
          <>
            <div className="profile-header-image">
              {imgData ? (
                <img src={imgData} alt="Perfil" className="profile-main-image" />
              ) : (
                <div className="placeholder-image">
                  <IonIcon icon={personCircleOutline} />
                </div>
              )}
            </div>
            <br /><br /><br /><br />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              textAlign: 'center',
              flexDirection: 'column' 
            }}>
            <IonCard className="details-card">
              <IonCardContent className="ion-text-center">
                <h2 className="employee-name-header">{empleado.nombre}</h2>
                <IonNote>Perfil de Empleado</IonNote>

                <div className="info-divider" />

                <IonList lines="none">
                  <IonItem className="ion-text-center">
                    <IonLabel>
                      <h3>ID EMPLEADO</h3>
                      <p>{empleado.id}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem className="ion-text-center">
                    <IonLabel>
                      <h3>CORREO</h3>
                      <p>{empleado.email || "No disponible"}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem className="ion-text-center">
                    <IonLabel>
                      <h3>ROL</h3>
                      <p className="capitalize">{empleado.rol || "No definido"}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem className="ion-text-center">
                    <IonLabel>
                      <h3>FLOTILLA</h3>
                      <p>{empleado.flotilla || "Sin asignar"}</p>
                    </IonLabel>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
            </div>
          </>
        ) : (
          <div className="ion-text-center ion-padding">
            <p>Información no disponible.</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default VisualizarImagenFlotilla;