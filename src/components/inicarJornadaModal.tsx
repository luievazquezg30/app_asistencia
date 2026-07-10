import React from 'react';
import { IonModal, IonButton, IonText, useIonRouter } from '@ionic/react';
import './inicarJornadaModal.css';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: (confirm: boolean) => void;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({ isOpen, onClose }) => {
  const router = useIonRouter();

  const goToRegisterUbi = () => {
    onClose(true);
    router.push('/registrarUbicacion', 'forward');
  };

  return (
    <IonModal 
      isOpen={isOpen} 
      onDidDismiss={() => onClose(false)} 
      className="custom-attendance-modal"
    >
      <div className="modal-container">
        <IonText className="modal-title">
          <h2>¿Quieres iniciar tu jornada?</h2>
        </IonText>
        
        <div className="button-group">
          <a 
            
            className="btn-confirm"
            onClick={goToRegisterUbi}
          >
            SI
          </a>
          
          <a 
            className="btn-cancel"
            onClick={() => onClose(false)}
          >
            No
          </a>
        </div>
      </div>
    </IonModal>
  );
};

export default AttendanceModal;