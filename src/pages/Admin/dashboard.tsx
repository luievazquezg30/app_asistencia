import React, { useState } from "react"; 
import { 
  IonContent, 
  IonPage, 
  IonIcon, 
  IonButton, 
  IonCard,
  IonTabBar, 
  IonTabButton 
} from "@ionic/react";
import { 
  timeOutline, 
  chevronForwardOutline, 
  chevronDownOutline,
  downloadOutline, 
  homeOutline, 
  personOutline 
} from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import { attendanceMock } from "../../data/asistencias";
import { employees } from "../../data/cuadrillas"; 
import "./dashboard.css";
import AttendanceModal from "../../components/inicarJornadaModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoTecno from "../../assets/img/Logo-C3uYQGLX.png";
import avatarBatman from "../../assets/img/avatar-batman-comics-svgrepo-com.svg";

const Dashboard: React.FC = () => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  
  const [isFilterEnabled, setIsFilterEnabled] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  
  const currentUser = employees?.find((emp) => emp.id === 2) || { 
    id: 999,
    nombre: "Usuario Temporal", 
    rol: "empleado", 
    flotilla: "Tecnocom" 
  };

  const userFleets: string[] = currentUser.rol === "supervisor"
    ? [...new Set(employees.map(emp => emp.flotilla).filter(f => f !== ""))]
    : currentUser.flotilla ? [currentUser.flotilla] : [];

  const filteredAttendance = isFilterEnabled
    ? attendanceMock.filter(item => item.date === selectedDate)
    : attendanceMock;

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      const records = filteredAttendance;
      doc.setFontSize(16);
      const tituloReporte = isFilterEnabled ? `Asistencias del Día: ${selectedDate}` : "Historial General de Asistencias";
      doc.text(tituloReporte, 14, 20);
      doc.setFontSize(10);
      doc.text(`Generado por: ${currentUser.nombre} (ID: ${currentUser.id})`, 14, 28);
      doc.text(`Fecha de Reporte: ${new Date().toLocaleDateString()}`, 14, 34);

      const columns = ["Fecha", "Colaborador", "Flotilla", "Entrada", "Salida", "Estado"];
      const rows = records.map(item => {
        const emp = employees.find(e => e.id === item.employeeId);
        return [item.date, emp ? emp.nombre : `ID: ${item.employeeId}`, emp?.flotilla || "Sin asignar", `${item.entryTime} hrs`, item.exitTime ? `${item.exitTime} hrs` : "Pendiente", item.status];
      });

      autoTable(doc, { startY: 40, head: [columns], body: rows, theme: "striped", headStyles: { fillColor: [67, 118, 199] } });
      doc.save(isFilterEnabled ? `Asistencias_${selectedDate}.pdf` : "Historial_General_Asistencias.pdf");
    } catch (error) { console.error("Error generando PDF:", error); }
  };

  const handleFleetAction = (fleetName: string) => { history.push("/visualizarFlotilla", { fleet: fleetName }); };

  return (
    <IonPage>
      <IonContent fullscreen={true}>
        <div className="header">
          <img src={logoTecno} alt="Logo" className="logo-superior-izq" />
          <div className="desc">
            <h2 className="ion-no-margin">Buen día,</h2>
            <h1 className="ion-no-margin">{currentUser.nombre}</h1>
            <p className="subtitle">Tu ID es: {currentUser.id}</p>
          </div>
        </div>

        <div className="footer-container"> 
          <div className="container">
            <IonCard className="plan-card ion-no-margin">
              <img src={avatarBatman} alt="Avatar" className="avatar-img" />
              <div className="card-details">
                <p className="plan-tag">Rol: {currentUser.rol}</p>
                <p className="title">Flotillas bajo gestión:</p>
                <div className="flotillas">
                  {userFleets.length > 0 ? userFleets.map((fleet, index) => <p key={index}>• {fleet}</p>) : <p>Sin flotillas asignadas</p>}
                </div>
              </div>
            </IonCard>

            <h6>Gestor de Flotillas</h6>
            <div className="attendance-actions">
              {userFleets.length > 0 ? userFleets.map((fleet, index) => (
                <div key={index} className="action-btn entrada" onClick={() => handleFleetAction(fleet)}>
                  <span>Gestionar {fleet}</span>
                </div>
              )) : <div className="action-btn disabled"><span>No tienes flotillas activas</span></div>}
            </div>

            <div className="container" style={{ marginTop: '24px' }}>
              <h6>Gestión de Supervisores</h6>
              <IonCard className="ion-padding" style={{ borderRadius: '12px', margin: '0' }}>
                {employees.filter((emp) => emp.rol === "supervisor").map((sup) => (
                  <div key={sup.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px' }}>{sup.nombre}</strong>
                      <small style={{ color: '#666' }}>Flotilla: {sup.flotilla || <span style={{ color: '#eb445a' }}>Sin asignar</span>}</small>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <IonButton size="small" fill="outline" style={{ '--color': '#4376c7' }}>Asignar</IonButton>
                      <IonButton size="small" fill="clear" color="danger">Eliminar</IonButton>
                    </div>
                  </div>
                ))}
              </IonCard>
            </div>

        
            <div className="date-filter-box">
              <div className="date-filter-header">
                <label className="date-filter-label">
                  <input type="checkbox" checked={isFilterEnabled} onChange={(e) => { setIsFilterEnabled(e.target.checked); if(!e.target.checked) setIsDropdownOpen(false); }} />
                  Filtrar por fecha
                </label>
                {isFilterEnabled && <input type="date" className="date-input-native" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setIsDropdownOpen(true); }} />}
              </div>
            </div>

            <div className="date-filter-header" style={{ marginTop: '24px', marginBottom: '12px' }}>
              <h6>{isFilterEnabled ? "Registros Filtrados" : "Historial General"}</h6>
              <IonButton fill="clear" size="small" onClick={downloadPDF} style={{ '--color': '#4376c7' }}>
                <IonIcon slot="icon-only" icon={downloadOutline} />
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>

      <IonTabBar slot="bottom" className="custom-tab-bar">
        <IonTabButton tab="home" onClick={() => history.push("/supervisor")} className="custom-tab-btn">
          <IonIcon icon={homeOutline} className="tab-icon" />
        </IonTabButton>
        <IonTabButton tab="perfil" onClick={() => history.push("/login")} className="custom-tab-btn">
          <IonIcon icon={personOutline} className="tab-icon" />
        </IonTabButton>
      </IonTabBar>
    </IonPage>
  );
};

export default Dashboard;