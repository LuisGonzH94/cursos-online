import { useState, useEffect } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import LoginDialog from "../form/LoginDialog";
import RegisterDialog from "../form/RegisterDialog";

function AuthHandler() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // verifico el localstorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("currentUserId") || "";
    if (storedUserId) {
      setUserId(storedUserId);
      setIsLoggedIn(true);  // Asumimos que está conectado si hay un userId
    }
    setIsLoading(false);  // Finalizamos la carga inicial
  }, []);

  // Escuchar los cambios en la base de datos para el usuario actual
  useEffect(() => {
    if (userId) {
      const db = getDatabase();
      const userRef = ref(db, `usuarios/${userId}`);

      onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setIsLoggedIn(userData.conectado);
          setUserName(userData.nombre_usuario || "");
        } else {
          setIsLoggedIn(false);
          setUserName("");
        }
      });
    }
  }, [userId]);

  const handleLogin = (userName, userId) => {
    setUserId(userId);
    localStorage.setItem("currentUserId", userId);
    setIsLoggedIn(true);
    setUserName(userName);
  
    const db = getDatabase();
    const userRef = ref(db, `usuarios/${userId}`);
    update(userRef, {
      conectado: true,
    })
      .then(() => {
        console.log("Usuario conectado correctamente.");
  
      window.location.href = "/cursosInscritos"
      })
      .catch((error) => {
        console.error("Error al actualizar el estado de conexión:", error);
      });
  };
  
  

  const handleLogout = async () => {
    if (userId) {
      try {
        const db = getDatabase();
        const userRef = ref(db, `usuarios/${userId}`);

        // Actualiza la última sesión y cambia el estado de conexión
        await update(userRef, {
          conectado: false,
          ultima_sesion: new Date().toISOString(),  // Guarda la fecha y hora actual
        });

        console.log("Última sesión registrada correctamente.");

        // Limpieza del estado local y del localStorage
        setIsLoggedIn(false);
        setUserName("");
        setUserId("");
        localStorage.removeItem("currentUserId");

        // Redirige automáticamente a la página de inicio
        window.location.href = "/";

      } catch (error) {
        console.error("Error al registrar la última sesión:", error);
      }
    }
  };

  if (isLoading) {
    return <div className="text-white">Cargando...</div>;  // Mensaje de carga temporal
  }

  return (
    <div>
      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          <span className="text-white">Bienvenido, {userName}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap">
  <button
    onClick={() => setShowLogin(true)}
    className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition w-full md:w-auto"
  >
    Entrar
  </button>
  <button
    onClick={() => setShowRegister(true)}
    className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition w-full md:w-auto"
  >
    Únete gratis
  </button>
</div>

      )}

      {showLogin && (
        <LoginDialog
          show={showLogin}
          onClose={() => setShowLogin(false)}
          handleLogin={handleLogin}
        />
      )}
      {showRegister && (
        <RegisterDialog show={showRegister} onClose={() => setShowRegister(false)} />
      )}
    </div>
  );
}

export default AuthHandler;
