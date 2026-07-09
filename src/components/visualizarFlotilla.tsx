import React, { useState, useEffect } from "react"; 
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
  chevronForwardOutline, 
  chevronDownOutline,
  downloadOutline, 
  homeOutline, 
  personOutline 
} from 'ionicons/icons';

// RUTAS RELATIVAS
import { attendanceMock } from "../data/asistencias";
import { employees } from "../data/cuadrillas"; 
import logoTecno from "../assets/img/Logo-C3uYQGLX.png";
import avatarBatman from "../assets/img/avatar-batman-comics-svgrepo-com.svg";

// 1. IMPORTACIÓN DEL MODAL INTEGRADO
import VisualizarImagenFlotillaModal from "../components/visualizarImagenFlotillaModal"; 

// RUTA DEL CSS ADAPTADA
import "../components/visualizarImagenFlotillaModal.css"; 

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const VisualizarFlotilla: React.FC = () => {
  // Cambia aquí la flotilla por defecto que quieres ver ("Tecnocom" o "CyberPuerta")
  const [currentFleet, setCurrentFleet] = useState<string>("Tecnocom");

  // Estados para filtros por fecha, menús e imagen Base64
  const [isFilterEnabled, setIsFilterEnabled] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [storedImage, setStoredImage] = useState<string | null>(null);
  
  // 2. NUEVO ESTADO PARA CONTROLAR LA APERTURA DEL MODAL
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Carga la foto guardada en localStorage
  useEffect(() => {
    const base64Image = localStorage.getItem("empleado_foto_base64");
    if (base64Image) {
      setStoredImage(base64Image);
    }
  }, []);

  // Buscamos a María López (ID: 2) para el encabezado
  const currentUser = employees?.find((emp) => emp.id === 2) || { 
    id: 999,
    nombre: "Usuario Temporal", 
    rol: "empleado", 
    flotilla: "" 
  };

  // 1. FILTRADO POR LA FLOTILLA SELECCIONADA (Tecnocom o CyberPuerta)
  const attendanceByFleet = attendanceMock.filter(item => {
    const emp = employees.find(e => e.id === item.employeeId);
    return emp?.flotilla?.toLowerCase() === currentFleet.toLowerCase();
  });

  // 2. FILTRADO ADICIONAL POR FECHA ESPECÍFICA (Si el checkbox está activo)
  const filteredAttendance = isFilterEnabled
    ? attendanceByFleet.filter(item => item.date === selectedDate)
    : attendanceByFleet;

  // Exportación a PDF de los registros
  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      const records = filteredAttendance;

      doc.setFontSize(16);
      const tituloReporte = isFilterEnabled 
        ? `Asistencias Flotilla ${currentFleet} - Día: ${selectedDate}` 
        : `Historial General - Flotilla: ${currentFleet}`;
        
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

      doc.save(`Asistencias_Flotilla_${currentFleet}.pdf`);
    } catch (error) {
      console.error("Error generando PDF:", error);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen={true}>
        
        {/* ENCABEZADO SUPERIOR */}
        <div className="header">
          <img src={logoTecno} alt="Logo" className="logo-superior-izq" />
          <div className="desc">
            <h2 className="ion-no-margin">Buen día,</h2>
            <h1 className="ion-no-margin">{currentUser.nombre}</h1>
            <div className="item-divider-replacer" />
            <p className="subtitle">Tu ID es: {currentUser.id}</p>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="footer-container"> 
          <div className="container">
            
            {/* BOTONES SELECTORES DE FLOTILLA */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <IonButton 
                fill={currentFleet === "Tecnocom" ? "solid" : "outline"} 
                size="small"
                onClick={() => setCurrentFleet("Tecnocom")}
                style={{ '--background': '#062b65' }}
              >
                Tecnocom
              </IonButton>
              <IonButton 
                fill={currentFleet === "CyberPuerta" ? "solid" : "outline"} 
                size="small"
                onClick={() => setCurrentFleet("CyberPuerta")}
                style={{ '--background': '#062b65', '--color': currentFleet === "CyberPuerta" ? '#fff' : '#4376c7' }}
              >
                CyberPuerta
              </IonButton>
            </div>

            {/* TARJETA: SOLO MUESTRA EL AVATAR Y LA FLOTILLA FILTRADA */}
            <IonCard className="plan-card ion-no-margin">
              <img 
                src={storedImage ? storedImage : avatarBatman} 
                alt="Foto del colaborador" 
                className="avatar-img" 
              />
              <div className="card-details">
                <p className="title" style={{ marginTop: '4px' }}>
                  Flotilla: {currentFleet}
                </p>
              </div>
            </IonCard>

            {/* SECCIÓN FILTRO POR FECHA */}
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

              {/* Selector del Desplegable */}
              {isFilterEnabled && (
                <div className="dropdown-trigger-bar" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <span className="dropdown-trigger-text">
                    Resultados para el: <strong>{selectedDate}</strong> ({filteredAttendance.length})
                  </span>
                  <IonIcon icon={isDropdownOpen ? chevronDownOutline : chevronForwardOutline} />
                </div>
              )}

              {/* Lista Desplegable */}
              {isFilterEnabled && isDropdownOpen && (
                <div className="dropdown-content-list">
                  {filteredAttendance.length > 0 ? (
                    filteredAttendance.map((item) => {
                      const empleado = employees.find(emp => emp.id === item.employeeId);
                      return (
                        <div 
                          key={item.id} 
                          className="dropdown-item-card" 
                          style={{ 
                            borderLeft: item.status === 'Completa' ? '4px solid #2dd36f' : '4px solid #3880ff',
                            cursor: 'pointer' 
                          }}
                          onClick={() => setIsModalOpen(true)} // 3. ACTIVA EL MODAL DESDE EL DESPLEGABLE
                        >
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

            <div className="date-filter-header" style={{ marginTop: '24px', marginBottom: '12px' }}>
              <h6 style={{ margin: 0 }}>
                {isFilterEnabled ? "Registros Filtrados" : `Historial General - ${currentFleet}`}
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

          {/* LISTADO DE ASISTENCIAS FILTRADAS */}
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
                      cursor: 'pointer' // Cambio estético para notar que es interactivo
                    }}
                    onClick={() => setIsModalOpen(true)} // 4. ACTIVA EL MODAL DESDE LA LISTA PRINCIPAL
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
                No hay asistencias registradas para la flotilla {currentFleet}.
              </p>
            )}
          </div>
        </div>
      </IonContent>

      {/* 5. ELEMENTO INYECTADO SIN RENDERIZAR INTERRUPCIONES VISUALES */}
      <VisualizarImagenFlotillaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <IonTabBar slot="bottom" className="custom-tab-bar">
        <IonTabButton tab="home" href="/home" className="custom-tab-btn">
          <IonIcon icon={homeOutline} className="tab-icon" />
        </IonTabButton>
        <IonTabButton tab="perfil" href="/perfil" className="custom-tab-btn">
          <IonIcon icon={personOutline} className="tab-icon" />
        </IonTabButton>
      </IonTabBar>
    </IonPage>
  );
};

export default VisualizarFlotilla;