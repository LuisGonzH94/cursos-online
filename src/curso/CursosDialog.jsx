function CursosDialog({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">¡Inicia sesión o regístrate!</h2>
        <p className="mb-4">Debes iniciar sesión para ver los cursos inscritos.</p>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default CursosDialog;
