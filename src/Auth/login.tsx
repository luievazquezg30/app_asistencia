import React, { useState } from "react";
import { IonPage, IonContent, IonSpinner } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logoTecno from "../assets/img/Logo-C3uYQGLX.png";
import "./Login.css";

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const history = useHistory();

  const ingresar = async () => {
    setError("");

    if (password.length !== 4) {
      setError("La contraseña debe tener 4 caracteres");
      return;
    }

    setLoading(true);

    try {
      const usuarioLogueado = await login(usuario, password);

      if (!usuarioLogueado) {
        setError("Credenciales incorrectas");
        setLoading(false);
        return;
      }

      switch (usuarioLogueado.rol) {
        case "admin":
          history.replace("/admin");
          break;
        case "supervisor":
          history.replace("/supervisor");
          break;
        case "empleado":
          history.replace("/empleado");
          break;
        default:
          setError("Rol no válido");
          setLoading(false);
          break;
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent scrollY={false} className="login-page">
        <div className="login-wrapper">
          <div className="login-card">
            <div className="logo-container">
              <img src={logoTecno} alt="Logo" className="logo" />
            </div>

            <h2 className="title">Iniciar Sesión</h2>

            <input
              type="text"
              className="styled-input"
              placeholder="admin"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />

            <input
              type="password"
              className="styled-input"
              placeholder="••••"
              value={password}
              maxLength={4}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

            <button 
              className="login-button" 
              onClick={ingresar}
              disabled={loading}
            >
              {loading ? <IonSpinner name="crescent" /> : "Ingresar"}
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;