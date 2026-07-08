import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonLabel
} from "@ionic/react";

import { Attendance } from "../models/Asistencia";

interface AttendanceCardProps {
  attendance: Attendance;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ attendance }) => {
  const getStatusColor = () => {
    switch (attendance.status) {
      case "Completa":
        return "success";

      case "En curso":
        return "warning";

      default:
        return "medium";
    }
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{attendance.date}</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <p>
          <strong>Entrada:</strong> {attendance.entryTime}
        </p>

        <p>
          <strong>Salida:</strong>{" "}
          {attendance.exitTime !== "" ? attendance.exitTime : "Pendiente"}
        </p>

        <IonChip color={getStatusColor()}>
          <IonLabel>{attendance.status}</IonLabel>
        </IonChip>
      </IonCardContent>
    </IonCard>
  );
};

export default AttendanceCard;