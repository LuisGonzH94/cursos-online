import { createContext, useContext, useState, useEffect } from "react";
import { getDatabase, ref, update } from "firebase/database";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedLoginState = localStorage.getItem("isLoggedIn") === "true";
    const storedUserName = localStorage.getItem("userName") || "";
    setIsLoggedIn(storedLoginState);
    setUserName(storedUserName);
  }, []);

  const updateConnectionStatus = (userId, status) => {
    const db = getDatabase();
    console.log("Actualizando conexión para:", userId);
    const userRef = ref(db, `${userId}/conectado`);
    update(userRef, { conectado: status })
      .then(() => {
        console.log(`Estado de conexión actualizado a ${status} para ${userId}`);
      })
      .catch((error) => {
        console.error("Error al actualizar el estado de conexión:", error);
      });
  };

  const login = (user, userId) => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", user);
    setUserName(user);
    updateConnectionStatus(userId, true);
  };

  const logout = (userId) => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    updateConnectionStatus(userId, false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
