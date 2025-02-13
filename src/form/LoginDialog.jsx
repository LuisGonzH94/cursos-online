import { useState } from "react";
import { getDatabase, ref, get, child } from "firebase/database";

const LoginDialog = ({ show, onClose, handleLogin }) => {
  const [formData, setFormData] = useState({ email: "", contrasena: "" });
  const [errores, setErrores] = useState({});

  if (!show) return null;

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrores({ ...errores, [name]: "" });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (formData.email.trim() === "") nuevosErrores.email = "El email es requerido";
    if (!formData.email.includes("@")) nuevosErrores.email = "Formato de email inválido";
    if (formData.contrasena.trim() === "") nuevosErrores.contrasena = "La contraseña es requerida";
    return nuevosErrores;
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validar();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      const dbRef = ref(getDatabase());
      const snapshot = await get(child(dbRef, "usuarios"));

      if (snapshot.exists()) {
        console.log("Datos de usuarios en Firebase:", snapshot.val());
        const usuarios = snapshot.val();
        const [userId, usuarioEncontrado] = Object.entries(usuarios).find(
          ([key, u]) => u.email === formData.email && u.contrasena === formData.contrasena
        ) || [];

        if (usuarioEncontrado) {
          handleLogin(usuarioEncontrado.nombre_usuario, userId);  // Pasa el userId y el nombre de usuario
          onClose();
        } else {
          setErrores({ email: "Credenciales incorrectas" });
        }
        
      } else {
        setErrores({ email: "No se encontraron usuarios" });
      }
    } catch (error) {
      console.error("Error al autenticar:", error);
      setErrores({ email: `Error de conexión: ${error.message}` });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Iniciar sesión</h2>
        <form onSubmit={manejarSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={manejarCambio}
              placeholder="Ingresa tu correo"
              className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {errores.email && <span className="text-red-500 text-sm">{errores.email}</span>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Contraseña</label>
            <input
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={manejarCambio}
              placeholder="Ingresa tu contraseña"
              className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {errores.contrasena && <span className="text-red-500 text-sm">{errores.contrasena}</span>}
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600"
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-4 py-3 text-gray-500 font-medium hover:underline"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginDialog;
