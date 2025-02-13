import Register from "../network/RegisterVal";

const RegisterDialog = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm transform transition-all duration-300 scale-100 hover:scale-105">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Regístrate</h2>
        <Register onClose={onClose} />
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 text-gray-500 font-medium hover:underline"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default RegisterDialog;
