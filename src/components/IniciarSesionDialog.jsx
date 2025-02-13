function IniciarSesionDialog({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">¡Inicia sesión o regístrate!</h2>
                <p className="mb-4">Debes iniciar sesión para inscribirte en el curso.</p>
                
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}

export default IniciarSesionDialog;
