import React, { useRef, useState, useEffect } from "react";
import { 
  IonContent, 
  IonPage, 
  IonIcon, 
  IonButton, 
  IonToast,
  useIonRouter
} from "@ionic/react";
import { cameraOutline, refreshOutline, checkmarkCircleOutline, alertCircleOutline } from "ionicons/icons";

import "./tomarAsistencia.css"; 

const TomarAsistencia: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ionRouter = useIonRouter(); 
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoCaptured, setPhotoCaptured] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setPhotoCaptured(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      setToastMessage("No se pudo acceder a la cámara.");
      setShowToast(true);
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        setPhotoCaptured(canvas.toDataURL("image/jpeg", 0.85));
        stopCamera(); 
      }
    }
  };

  const saveAttendancePhoto = () => {
    if (photoCaptured) {
      localStorage.setItem("empleado_foto_base64", photoCaptured);
      setToastMessage("¡Registro exitoso!");
      setShowToast(true);
      setTimeout(() => ionRouter.push("/empleado", "forward", "replace"), 800);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="attendance-capture-content">
        <div className="attendance-bg-gradient" />
        <div className="capture-container">
          <div className="capture-header">
            <h2 className="capture-title">Registro de Asistencia</h2>
          </div>

          <div className="camera-viewfinder-wrapper">
            <div className={`viewfinder-frame ${photoCaptured ? 'success-frame' : 'active-frame'}`}>
              {!photoCaptured ? (
                <video ref={videoRef} autoPlay playsInline className="live-video-feed" />
              ) : (
                <img src={photoCaptured} alt="Asistencia" className="captured-preview-img" />
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>

         <div className="capture-actions-panel">
            {!photoCaptured ? (
                <IonButton 
                expand="block" 
                className="btn-capture-green"
                onClick={capturePhoto}
                >
                <IonIcon className="p-btn"slot="center" icon={cameraOutline} />
                <p>Capturar Evidencia</p>
                </IonButton>
            ) : (
                <div className="action-dual-buttons">
                <IonButton fill="outline" className="btn-capture-secondary" onClick={startCamera}>
                    <IonIcon slot="icon-only" icon={refreshOutline} />
                </IonButton>
                <IonButton expand="block" onClick={saveAttendancePhoto}>
                    <IonIcon slot="start" icon={checkmarkCircleOutline} />
                    Confirmar y Registrar
                </IonButton>
                </div>
            )}
            </div>
        </div>
        <IonToast isOpen={showToast} onDidDismiss={() => setShowToast(false)} message={toastMessage} duration={2500} />
      </IonContent>
    </IonPage>
  );
};

export default TomarAsistencia;