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
  const todayStr = new Date().toISOString().split('T')[0];
  const firstDayOfMonthStr = `${todayStr.slice(0, 7)}-01`;
  const [isFilterEnabled, setIsFilterEnabled] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>(firstDayOfMonthStr);
  const [endDate, setEndDate] = useState<string>(todayStr);
  const [selectedUser, setSelectedUser] = useState<string>(""); 
  const [selectedFleetFilter, setSelectedFleetFilter] = useState<string>(""); 
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

  const filteredAttendance = attendanceMock.filter(item => {
    if (!isFilterEnabled) return true;

    const emp = employees.find(e => e.id === item.employeeId);

    const matchDateRange = item.date >= startDate && item.date <= endDate;
    const matchUser = selectedUser === "" || item.employeeId.toString() === selectedUser;
    const matchFleet = selectedFleetFilter === "" || (emp && emp.flotilla === selectedFleetFilter);

    return matchDateRange && matchUser && matchFleet;
  });

  
  const generatePDF = (records: typeof attendanceMock, isAdvancedFilter: boolean) => {
    try {
      const doc = new jsPDF();

      doc.setFontSize(16);
      const tituloReporte = isAdvancedFilter 
        ? `Reporte de Filtración Avanzada` 
        : "Historial General de Asistencias";
      doc.text(tituloReporte, 14, 20);
      
      doc.setFontSize(10);
      doc.text(`Generado por: ${currentUser.nombre} (ID: ${currentUser.id})`, 14, 28);
      doc.text(`Fecha de Reporte: ${new Date().toLocaleDateString()}`, 14, 34);

     
      if (isAdvancedFilter) {
        const empFiltrado = employees.find(e => e.id.toString() === selectedUser);
        const textoUsuario = empFiltrado ? empFiltrado.nombre : 'Todos';
        const textoFlotilla = selectedFleetFilter || 'Todas';
        
        doc.text(`Filtros -> Rango: ${startDate} al ${endDate} | Colaborador: ${textoUsuario} | Flotilla: ${textoFlotilla}`, 14, 40);
      }

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
        startY: isAdvancedFilter ? 46 : 40,
        head: [columns],
        body: rows,
        theme: "striped",
        headStyles: { fillColor: [67, 118, 199] } 
      });

      const nombreArchivo = isAdvancedFilter 
        ? `Filtracion_Avanzada_${startDate}_al_${endDate}.pdf` 
        : "Historial_General_Asistencias.pdf";

      doc.save(nombreArchivo);
    } catch (error) {
      console.error("Error generando PDF:", error);
    }
  };

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
                <p className="plan-tag">Rol: {currentUser.rol}</p>
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

            <div className="date-filter-box">
              <div className="date-filter-header">
                <label className="date-filter-label">
                  <input 
                    type="checkbox" 
                    checked={isFilterEnabled} 
                    onChange={(e) => {
                      setIsFilterEnabled(e.target.checked);
                      if(!e.target.checked) {
                        setIsDropdownOpen(false);
                        setSelectedUser("");
                        setSelectedFleetFilter("");
                      } 
                    }}
                  />
                  Habilitar filtros avanzados
                </label>
              </div>

              {isFilterEnabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Desde:</span>
                      <input 
                        type="date" 
                        className="date-input-native"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setIsDropdownOpen(true); 
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Hasta:</span>
                      <input 
                        type="date" 
                        className="date-input-native"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          setIsDropdownOpen(true); 
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Colaborador:</span>
                    <select 
                      value={selectedUser} 
                      onChange={(e) => {
                        setSelectedUser(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#fff' }}
                    >
                      <option value="">Todos los colaboradores</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Flotilla:</span>
                    <select 
                      value={selectedFleetFilter} 
                      onChange={(e) => {
                        setSelectedFleetFilter(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#fff' }}
                    >
                      <option value="">Todas las flotillas</option>
                      {[...new Set(employees.map(emp => emp.flotilla).filter(f => f))].map((fleet, idx) => (
                        <option key={idx} value={fleet}>{fleet}</option>
                      ))}
                    </select>
                  </div>

                </div>
              )}

              {isFilterEnabled && (
                <div className="date-filter-header" style={{ marginTop: '14px', backgroundColor: '#f2f2f2', padding: '6px 10px', borderRadius: '6px' }}>
                  <div className="dropdown-trigger-bar" onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{ flex: 1, border: 'none', margin: 0, padding: 0 }}>
                    <span className="dropdown-trigger-text">
                      Resultados del rango: <strong>({filteredAttendance.length})</strong>
                    </span>
                    <IonIcon icon={isDropdownOpen ? chevronDownOutline : chevronForwardOutline} style={{ marginLeft: '6px' }} />
                  </div>
                  
                 
                  <IonButton 
                    fill="clear" 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      generatePDF(filteredAttendance, true);
                    }}
                    style={{ '--color': '#4376c7', margin: 0, padding: 0 }}
                  >
                    <IonIcon slot="icon-only" icon={downloadOutline} />
                  </IonButton>
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
                            <strong>Flotilla:</strong> {empleado?.flotilla || "Sin asignar"} | <strong>Fecha:</strong> {item.date} <br />
                            <strong>Entrada:</strong> {item.entryTime} hrs {item.exitTime && `| Salida: ${item.exitTime} hrs`}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="dropdown-trigger-text" style={{ fontStyle: 'italic', textAlign: 'center', margin: '8px 0' }}>
                      No hay asistencias en este rango con los filtros seleccionados.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="date-filter-header" style={{ marginTop: '24px', marginBottom: '12px' }}>
              <h6 style={{ margin: 0 }}>Historial de Asistencias en Pantalla</h6>
              <IonButton 
                fill="clear" 
                size="small" 
                onClick={() => generatePDF(filteredAttendance, isFilterEnabled)}
                style={{ '--color': '#4376c7', margin: 0, padding: 0 }}
              >
                <IonIcon slot="icon-only" icon={downloadOutline} />
              </IonButton>
            </div>
          </div>

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
                      borderLeft: item.status === 'Completa' ? '4px solid #2dd36f' : '4px solid #3880ff',
                      marginBottom: '8px'
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
                No hay asistencias registradas con esos criterios.
              </p>
            )}
          </div>
        </div>
      </IonContent >
      
       <IonTabBar slot="bottom" className="custom-tab-bar">
          <IonTabButton tab="home" onClick={() => history.push("/supervisor")} className="custom-tab-btn">
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