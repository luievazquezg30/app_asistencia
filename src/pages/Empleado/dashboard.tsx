import React, { useEffect, useState } from "react";

import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";

import { useAuth } from "../../hooks/useAuth";
import AttendanceService from "../../services/AsistenciaService";
import AttendanceCard from "../../components/showAsistencia";
import RegisterAttendanceModal from "../../components/registrarAsistenciaModal";
import { Attendance } from "../../models/Asistencia";

const Dashboard: React.FC = () => {

  const { user } = useAuth();

  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {

    if (user) {

      const data = AttendanceService.getAttendanceByEmployee(user.id);

      setAttendance(data);

    }

  }, [user]);

  const handleSaveAttendance = (
    photo: string,
    latitude: number,
    longitude: number
  ) => {

    console.log("Foto:", photo);
    console.log("Latitud:", latitude);
    console.log("Longitud:", longitude);

    // Aquí después guardarás la asistencia

    setShowModal(false);

  };

  return (

    <IonPage>

      <IonHeader>

        <IonToolbar>

          <IonTitle>
            Dashboard Empleado
          </IonTitle>

        </IonToolbar>

      </IonHeader>

      <IonContent className="ion-padding">

        <h1>
          Hola {user?.nombre}
        </h1>

        <p>
          Panel del empleado
        </p>

        <IonButton
          expand="block"
          onClick={() => setShowModal(true)}
        >
          Registrar Entrada
        </IonButton>

        <IonButton
          expand="block"
          color="danger"
          onClick={() => setShowModal(true)}
        >
          Registrar Salida
        </IonButton>

        <hr />

        <h2>
          Historial de asistencias
        </h2>

        {
          attendance.length > 0 ? (

            attendance.map((item) => (

              <AttendanceCard
                key={item.id}
                attendance={item}
              />

            ))

          ) : (

            <p>
              No hay asistencias registradas.
            </p>

          )
        }

        <RegisterAttendanceModal

          isOpen={showModal}

          onClose={() => setShowModal(false)}

          onSave={handleSaveAttendance}

        />

      </IonContent>

    </IonPage>

  );

};

export default Dashboard;