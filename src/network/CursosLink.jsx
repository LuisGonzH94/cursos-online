import { useState, useEffect } from "react";

function CursosLink() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUserId");
    setIsLoggedIn(!!currentUser);
  }, []);

  const handleCursosClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      window.location.href = "/cursosInscritos";  // Redirige sin recargar toda la aplicación
    } else {
      setMostrarDialogo(true);  // Muestra el diálogo si no está conectado
    }
  };

  return (
    <>
      <a href="#" onClick={handleCursosClick} className="hover:text-amber-400 transition">
        Cursos
      </a>

      {mostrarDialogo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-gray-950 text-2xl font-bold mb-4">¡Inicia sesión o regístrate!</h2>
            <p className="text-gray-950 mb-4">Debes iniciar sesión para ver los cursos inscritos.</p>
            <button
              onClick={() => setMostrarDialogo(false)}
              className="mt-4 w-full bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CursosLink;
