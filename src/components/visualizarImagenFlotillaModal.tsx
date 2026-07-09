import React, { useState, useEffect } from "react";
import { 
  IonModal, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonContent, 
  IonIcon 
} from "@ionic/react";
import { closeOutline, imageOutline } from "ionicons/icons";

import "./visualizarImagenFlotillaModal.css"; 

interface VisualizarImagenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VisualizarImagenFlotillaModal: React.FC<VisualizarImagenModalProps> = ({ isOpen, onClose }) => {
  const [storedImage, setStoredImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const base64Image = localStorage.getItem("empleado_foto_base64");
      setStoredImage(base64Image);
    }
  }, [isOpen]);

  return (
    <IonModal 
      isOpen={isOpen} 
      onDidDismiss={onClose} 
      className="image-preview-modal"
    >
      <IonHeader>
        <IonToolbar className="modal-toolbar">
          <IonTitle className="modal-title">
            Evidencia de Flotilla
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose} className="close-btn">
              <IonIcon slot="icon-only" icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* Cambiado el background en línea a gris claro */}
      <IonContent className="ion-padding" style={{ '--background': '#f4f5f8' }}>
        <div className="modal-image-container">
          {storedImage ? (
            <img 
              src={storedImage} 
              alt="Evidencia Almacenada" 
              className="evidence-img"
            />
          ) : (
            <div className="modal-empty-state">
              <IonIcon icon={imageOutline} className="empty-icon" />
              <p className="empty-text">
                No hay ninguna imagen guardada en el almacenamiento local.
              </p>
            </div>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default VisualizarImagenFlotillaModal;