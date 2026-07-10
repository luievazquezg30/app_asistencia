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
import { useHistory } from "react-router-dom"; // Hook para la redirección
import { attendanceMock } from "../../data/asistencias";
import { employees } from "../../data/cuadrillas"; 
import "./dashboard.css";
import AttendanceModal from "../../components/inicarJornadaModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoTecno from "../../assets/img/Logo-C3uYQGLX.png";
import avatarBatman from "../../assets/img/avatar-batman-comics-svgrepo-com.svg";
import incidente from "../../assets/img/danger-triangle-svgrepo-com.svg";

const Dashboard: React.FC = () => {
  const history = useHistory(); // Instancia de history para navegar
  const [showModal, setShowModal] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState<string>(""); 
  
  // Estados para manejo de filtros y menú desplegable
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
   
      const tituloReporte = isFilterEnabled 
        ? `Asistencias del Día: ${selectedDate}` 
        : "Historial General de Asistencias";
        
      doc.text(tituloReporte, 14, 20);
      
      doc.setFontSize(10);
      doc.text(`Generado por: ${currentUser.nombre} (ID: ${currentUser.id})`, 14, 28);
      doc.text(`Fecha de Reporte: ${new Date().toLocaleDateString()}`, 14, 34);

      const columns = ["Fecha", "Colaborador", "Flotilla", "Entrada", "Salida", "Estado"];
      
      const rows = records.map(item => {
        const emp = employees.find(e => e.id === item.employeeId);
        return [
          item.date,
          emp ? emp.nombre : `ID: ${item.employeeId}`,
          emp?.flotilla || "Sin asignar",
          `${item.entryTime} hrs`,
          item.exitTime ? `${item.exitTime} hrs` : "Pendiente",
          item.status
        ];
      });

      autoTable(doc, {
        startY: 40,
        head: [columns],
        body: rows,
        theme: "striped",
        headStyles: { fillColor: [67, 118, 199] } 
      });

      const nombreArchivo = isFilterEnabled 
        ? `Asistencias_${selectedDate}.pdf` 
        : "Historial_General_Asistencias.pdf";

      doc.save(nombreArchivo);
    } catch (error) {
      console.error("Error generando PDF:", error);
    }
  };

  // FUNCIÓN MODIFICADA: Ahora redirige pasando el estado con el nombre de la flotilla
  const handleFleetAction = (fleetName: string) => {
    history.push("/visualizarFlotilla", { fleet: fleetName });
  };

  return (
    <IonPage>
      <IonContent fullscreen={true}>
        
        <div className="header">
          <img src={logoTecno} alt="Logo" className="logo-superior-izq" />
          <div className="desc">
            <h2 className="ion-no-margin">Buen día,</h2>
            <h1 className="ion-no-margin">{currentUser.nombre}</h1>
            <div className="item-divider-replacer" />
            <p className="subtitle">Tu ID es: {currentUser.id}</p>
          </div>
        </div>

        <div className="footer-container"> 
          <div className="container">
            <IonCard className="plan-card ion-no-margin">
              <img src={avatarBatman} alt="Logo" className="avatar-img" />
              <div className="card-details">
                <p className="plan-tag">
                  Rol: {currentUser.rol}
                </p>
                <p className="title">Flotillas bajo gestión: </p>
                <div className="flotillas">
                  {userFleets.length > 0 ? (
                    userFleets.map((fleet, index) => <p key={index}>• {fleet}</p>)
                  ) : (
                    <p>Sin flotillas asignadas</p>
                  )}
                </div>
              </div>
            </IonCard>

            <h6>Gestor de Flotillas</h6>

            <div className="attendance-actions">
              {userFleets.length > 0 ? (
                userFleets.map((fleet, index) => (
                  <div 
                    key={index} 
                    className="action-btn entrada" 
                    onClick={() => handleFleetAction(fleet)}
                  >
                    <span>Gestionar {fleet}</span>
                  </div>
                ))
              ) : (
                <div className="action-btn disabled">
                  <IonIcon icon={timeOutline} />
                  <span>No tienes flotillas activas</span>
                </div>
              )}
            </div>

            {/* SECCIÓN FILTRO POR FECHA (MÓDULO DESPLEGABLE) */}
            <div className="date-filter-box">
              <div className="date-filter-header">
                <label className="date-filter-label">
                  <input 
                    type="checkbox" 
                    checked={isFilterEnabled} 
                    onChange={(e) => {
                      setIsFilterEnabled(e.target.checked);
                      if(!e.target.checked) setIsDropdownOpen(false); 
                    }}
                  />
                  Filtrar por fecha específica
                </label>
                
                {isFilterEnabled && (
                  <input 
                    type="date" 
                    className="date-input-native"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setIsDropdownOpen(true); 
                    }}
                  />
                )}
              </div>

              {/* Menú Desplegable */}
              {isFilterEnabled && (
                <div className="dropdown-trigger-bar" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <span className="dropdown-trigger-text">
                    Resultados para el: <strong>{selectedDate}</strong> ({filteredAttendance.length})
                  </span>
                  <IonIcon icon={isDropdownOpen ? chevronDownOutline : chevronForwardOutline} />
                </div>
              )}

              {isFilterEnabled && isDropdownOpen && (
                <div className="dropdown-content-list">
                  {filteredAttendance.length > 0 ? (
                    filteredAttendance.map((item) => {
                      const empleado = employees.find(emp => emp.id === item.employeeId);
                      return (
                        <div key={item.id} className="dropdown-item-card" style={{ borderLeft: item.status === 'Completa' ? '4px solid #2dd36f' : '4px solid #3880ff' }}>
                          <div className="date-filter-header">
                            <span className="dropdown-trigger-text" style={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                              {empleado ? empleado.nombre : `ID: ${item.employeeId}`}
                            </span>
                            <span style={{ color: item.status === 'Completa' ? '#2dd36f' : '#3880ff', fontWeight: 'bold', fontSize: '13px' }}>
                              {item.status}
                            </span>
                          </div>
                          <p className="dropdown-trigger-text" style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
                            <strong>Flotilla:</strong> {empleado?.flotilla || "Sin asignar"} | <strong>Entrada:</strong> {item.entryTime} hrs {item.exitTime && `| Salida: ${item.exitTime} hrs`}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="dropdown-trigger-text" style={{ fontStyle: 'italic', textAlign: 'center', margin: '8px 0' }}>
                      No hay asistencias registradas en esta fecha.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* SECCIÓN DEL BOTÓN DE DESCARGA ADAPTADO CON ESTILO INLINE REQUERIDO */}
            <div className="date-filter-header" style={{ marginTop: '24px', marginBottom: '12px' }}>
              <h6 style={{ margin: 0 }}>
                {isFilterEnabled ? "Todos los Registros Filtrados" : "Historial General de la Empresa"}
              </h6>
              <IonButton 
                fill="clear" 
                size="small" 
                onClick={downloadPDF}
                style={{ '--color': '#4376c7', margin: 0, padding: 0 }}
              >
                <IonIcon slot="icon-only" icon={downloadOutline} />
              </IonButton>
            </div>
          </div>

          {/* LISTADO PRINCIPAL DINÁMICO */}
          <div className="container">
            {filteredAttendance && filteredAttendance.length > 0 ? (
              filteredAttendance.map((item) => {
                const empleado = employees.find(emp => emp.id === item.employeeId);
                return (
                  <div 
                    key={item.id} 
                    className="dropdown-item-card"
                    style={{ 
                      padding: '12px', 
                      backgroundColor: '#f9f9f9',
                      borderLeft: item.status === 'Completa' ? '4px solid #2dd36f' : '4px solid #3880ff' 
                    }}
                  >
                    <div className="date-filter-header" style={{ marginBottom: '6px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#1a1a1a' }}>
                        {empleado ? empleado.nombre : `Empleado ${item.employeeId}`}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: item.status === 'Completa' ? '#2dd36f' : '#3880ff' }}>
                        {item.status}
                      </span>
                    </div>
                    <p className="dropdown-trigger-text" style={{ margin: '0', fontSize: '13px', color: '#444' }}>
                      <strong>Flotilla:</strong> {empleado?.flotilla || "Sin asignar"} <br />
                      <strong>Fecha:</strong> {item.date} | <strong>Entrada:</strong> {item.entryTime} hrs
                      {item.exitTime && <> | <strong>Salida:</strong> {item.exitTime} hrs</>}
                    </p>
                  </div>
                )
              })
            ) : (
              <p className="dropdown-trigger-text" style={{ paddingBottom: '30px', paddingLeft: '20px' }}>
                No hay asistencias registradas.
              </p>
            )}
          </div>
        </div>
      </IonContent >
      
       <IonTabBar slot="bottom" className="custom-tab-bar">
              <IonTabButton 
              tab="home" 
              onClick={() => history.push("/supervisor")} 
              className="custom-tab-btn"
          >
              <IonIcon icon={homeOutline} className="tab-icon" />
          </IonTabButton>
          <IonTabButton tab="perfil" onClick={() => history.push("/login")}  className="custom-tab-btn">
              <IonIcon icon={personOutline} className="tab-icon" />
          </IonTabButton>
        </IonTabBar>

      <AttendanceModal
        isOpen={showModal}
        onClose={(confirm: boolean) => setShowModal(false)}
      />
    </IonPage>
  );
};

export default Dashboard;