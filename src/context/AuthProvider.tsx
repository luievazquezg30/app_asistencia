import { ReactNode, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { User } from "../models/User";
import AuthService from "../services/AuthService";
import storage from "../storages/Storage";

interface Props {
  children: ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    cargarSesion();
  }, []);

  const cargarSesion = async () => {
    const usuarioGuardado = await storage.get("user");

    if (usuarioGuardado) {
      setUser(usuarioGuardado);
    }
  };

  const login = async (
    usuario: string,
    password: string
): Promise<User | null> => {


    const usuarioEncontrado = AuthService.login(
        usuario,
        password
    );


    if (!usuarioEncontrado) {

        return null;

    }


    setUser(usuarioEncontrado);


    await storage.set(
        "user",
        usuarioEncontrado
    );


    return usuarioEncontrado;

};

  const logout = async () => {
    setUser(null);

    await storage.remove("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;