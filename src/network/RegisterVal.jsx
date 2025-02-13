import { useState } from "react";
import { getDatabase, ref, get, set } from "firebase/database";

const Register = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    contrasena: "",
  });
  const [errores, setErrores] = useState({});
  const [status, setStatus] = useState("");

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrores({ ...errores, [name]: "" });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validarFormulario();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      const db = getDatabase();
      const usuariosRef = ref(db, "usuarios");

      // Verificar si el correo ya existe
      const snapshot = await get(usuariosRef);
      if (snapshot.exists()) {
        const usuarios = snapshot.val();
        const correoExistente = Object.values(usuarios).some(
          (usuario) => usuario.email === formData.email
        );

        if (correoExistente) {
          setStatus("Este correo ya está registrado.");
          return;
        }
      }

      // Generar el nuevo ID dinámico del usuario (user_002, user_003, etc.)
      const nuevoId = `user_${String(Object.keys(snapshot.val() || {}).length + 1).padStart(3, "0")}`;

      // Guardar el nuevo usuario en la base de datos
      await set(ref(db, `usuarios/${nuevoId}`), {
        conectado: false,
        contrasena: formData.contrasena,
        email: formData.email,
        nombre_usuario: formData.nombre,
        perfil: "cliente",
        ultima_sesion: "",
        cursos_inscritos: {},  // Sin cursos inicialmente
      });

      setStatus("¡Registro exitoso! Ahora puedes iniciar sesión.");
      setTimeout(() => {
        onClose();  // Cerrar el formulario de registro después de 2s
      }, 2000);
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      setStatus("Hubo un error al registrarte. Inténtalo de nuevo.");
    }
  };

  const validarFormulario = () => {
    const errores = {};
    if (formData.nombre.trim() === "") errores.nombre = "El nombre es requerido.";
    if (!formData.email.includes("@")) errores.email = "Formato de email inválido.";
    if (formData.contrasena.length < 6)
      errores.contrasena = "La contraseña debe tener al menos 6 caracteres.";
    return errores;
  };

  return (
    <form onSubmit={manejarSubmit}>
      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-2">Nombre de usuario</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={manejarCambio}
          placeholder="Ingresa tu nombre"
          className="text-gray-950 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        {errores.nombre && <span className="text-red-500 text-sm mt-1">{errores.nombre}</span>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-2">Correo Electrónico</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={manejarCambio}
          placeholder="Ingresa tu correo"
          className="text-gray-950 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        {errores.email && <span className="text-red-500 text-sm mt-1">{errores.email}</span>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-2">Contraseña</label>
        <input
          type="password"
          name="contrasena"
          value={formData.contrasena}
          onChange={manejarCambio}
          placeholder="Ingresa tu contraseña"
          className="text-gray-950 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        {errores.contrasena && <span className="text-red-500 text-sm mt-1">{errores.contrasena}</span>}
      </div>

      <button
        type="submit"
        className="w-full py-3 mt-4 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600"
      >
        Registrarse
      </button>

      {status && <p className="text-center mt-4 text-green-600 font-bold">{status}</p>}
    </form>
  );
};

export default Register;
