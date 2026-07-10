import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonIcon
} from "@ionic/react";
import { chevronBackOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import "./registrarUbicacion.css"; 

const MapPage: React.FC = () => {
  const history = useHistory();
  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState<string>("Rastreando tu ubicación.");
  const [subtitle, setSubtitle] = useState<string>("Ubicación de trabajo");

  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setStep((prevStep) => {
        const nextStep = prevStep + 1;
        
        if (nextStep === 2) {
          setTitle("Encontramos tu ubicación.");
          setSubtitle("Ubicación actual");
        } else if (nextStep >= 3) {
          setTitle("Ubicación confirmed.");
          setSubtitle("Punto de encuentro verificado");
          clearInterval(loadingInterval);
        }
        
        return nextStep;
      });
    }, 2000);

    return () => clearInterval(loadingInterval);
  }, []);

  const handleBack = () => {
    history.goBack();
  };

  return (
    <IonPage>
      <IonContent fullscreen={true} scrollY={false}>
        
        <IonButton className="back-btn" onClick={handleBack}>
          <IonIcon slot="icon-only" size="small" icon={chevronBackOutline} />
        </IonButton>

        <div className="map-mockup">
          <div className="map-marker-static">📍</div>
        </div>

        <div className="bottom-card-container">
          <h5 className="ion-no-margin">{title}</h5>
          <div className="progress-bar-container">
            <div className={`item ${step > 0 ? 'active' : ''}`}></div>
            <div className={`item ${step > 1 ? 'active' : ''}`}></div>
            <div className={`item ${step > 2 ? 'active' : ''}`}></div>
          </div>

          <h6>{subtitle}</h6>
          
          <div className="location-desc-box">
            <p>Av. Paseo del Atlántico 1472, Mazatlán, Sinaloa, MX</p>
          </div>

            <IonButton 
                className="btn-ready" 
                expand="block" 
                disabled={step < 3} 
                routerLink="/tomarAsistencia"
                >
                Listo
            </IonButton>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default MapPage;