import React, { useState } from "react"; 
import { IonContent, IonPage, IonImg, IonCard, IonIcon, IonButton } from "@ionic/react";
import { checkmarkOutline, logOutOutline, timeOutline, chevronForwardOutline, downloadOutline } from 'ionicons/icons';
import { attendanceMock } from "../../data/asistencias";
import { users } from "../../data/users";
import "./dashboard.css";
import AttendanceModal from "../../components/inicarJornadaModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoTecno from "../../assets/img/Logo-C3uYQGLX.png";
import avatarBatman from "../../assets/img/avatar-batman-comics-svgrepo-com.svg";
import incidente from "../../assets/img/danger-triangle-svgrepo-com.svg";

const Dashboard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const currentUser = users.find((emp: any) => emp.id === 3);

  const downloadPDF = () => {
    const doc = new jsPDF();
 
    const records = attendanceMock.filter(item => item.employeeId === 1);

    doc.setFontSize(16);
    doc.text("Historial de Asistencias", 14, 20);
    doc.setFontSize(10);
    doc.text(`Empleado ID: 1`, 14, 28);
    doc.text(`Fecha de Reporte: ${new Date().toLocaleDateString()}`, 14, 34);

    const columns = ["Fecha", "Entrada", "Salida", "Estado"];
    
    const rows = records.map(item => [
      item.date,
      `${item.entryTime} hrs`,
      item.exitTime ? `${item.exitTime} hrs` : "N/A",
      item.status
    ]);

    autoTable(doc, {
      startY: 40,
      head: [columns],
      body: rows,
      theme: "striped",
      headStyles: { fillColor: [67, 118, 199] } 
    });

    doc.save(`Historial_Asistencias_Emp1.pdf`);
  };

  return (
    <IonPage>
      <IonContent fullscreen={true} scrollY={false}>
        
        <div className="header">
         <img src={logoTecno} alt="Logo" className="logo-superior-izq" />
          <div className="desc">
            <h2 className="ion-no-margin">Buen día,</h2>
            <h1 className="ion-no-margin">
              {currentUser ? currentUser.nombre : "José Carlos"}
            </h1>
            <div className="item-divider-replacer" />
            <p className="subtitle">
              Tu ID es: {currentUser ? currentUser.id : "XXXXXX"}
            </p>
          </div>
        </div>

        <div className="footer-container">
          <div className="container">
            
            <IonCard className="plan-card ion-no-margin">
              <img src={avatarBatman} alt="Logo" className="avatar-img" />
              <div className="card-details">
                <p className="plan-tag">Supervisor: Santana</p>
                <p className="title">Flotilla: Tecnocom</p>
              </div>
            </IonCard>

            <h6>Métricas De Jornada</h6>

            <div className="attendance-actions">
              <div className="action-btn entrada" onClick={() => setShowModal(true)}>
                <IonIcon icon={checkmarkOutline} />
                <span>Iniciar Jornada</span>
              </div>
              
              <div className="action-btn salida" onClick={() => setShowModal(true)}>
                <IonIcon icon={logOutOutline} />
                <span>Terminar Jornada</span>
              </div>

              <div className="action-btn disabled">
                <IonIcon icon={timeOutline} />
                <span>Tu Jornada</span>
              </div>
            </div>

            <h6>Comunicación Con Empresa</h6>
          </div>

          <div className="horizontal-carousel">
            <div className="carousel-card">
              <img src={incidente} alt="incidente" className="incidente-img" />
              <div className="info">
                <h5>Reportar Incidente</h5>
                <p>Reporte algún colaborador en nuestro nuevo canal.</p>
                <a href="#">Reportar <IonIcon icon={chevronForwardOutline} style={{ fontSize: '10px' }} /></a>
              </div>
            </div>
          </div>
          

          <div className="container" style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h6 style={{ margin: 0 }}>Historial de asistencias</h6>
              <IonButton 
                fill="clear" 
                size="small" 
                onClick={downloadPDF}
                style={{ '--color': '#4376c7', margin: 0, padding: 0 }}
              >
                <IonIcon slot="icon-only" icon={downloadOutline} />
              </IonButton>
            </div>
            
            {attendanceMock.filter(item => item.employeeId === 1).length > 0 ? (
              attendanceMock
                .filter(item => item.employeeId === 1)
                .map((item) => {
                  return (
                    <div 
                      key={item.id} 
                      style={{
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '10px',
                        borderLeft: item.status === 'Completa' ? '4px solid #2dd36f' : '4px solid #3880ff'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.date}</span>
                        <span style={{ 
                          fontSize: '12px', 
                          fontWeight: '600',
                          color: item.status === 'Completa' ? '#2dd36f' : '#3880ff' 
                        }}>
                          {item.status}
                        </span>
                      </div>
                      
                      <p style={{ margin: '0', fontSize: '13px', color: '#444' }}>
                        <strong>Entrada:</strong> {item.entryTime} hrs
                        {item.exitTime && <> | <strong>Salida:</strong> {item.exitTime} hrs</>}
                      </p>
                      <a href="#">Ver <IonIcon icon={chevronForwardOutline} style={{ fontSize: '10px' }} /></a>
                    </div>
                  );
                  
                })
            ) : (
              <p style={{ fontSize: '14px', color: '#666', paddingBottom: '30px' }}>
                No hay asistencias registradas.
              </p>
            )}
          </div>
        
        </div>

        <AttendanceModal
          isOpen={showModal}
          onClose={(confirm: boolean) => {
            console.log("El usuario seleccionó:", confirm ? "Sí" : "No");
            setShowModal(false);
          }}
        />

      </IonContent>
    </IonPage>
  );
};

export default Dashboard;