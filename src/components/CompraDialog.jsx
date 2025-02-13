import { useState } from "react";
import { getDatabase, ref, update } from "firebase/database";

function CompraDialog({ curso, userId, onClose, onCompraExitosa }) {
  const [status, setStatus] = useState("");

  const handleCompra = async () => {
    setStatus("Procesando...");
  
    setTimeout(async () => {
      // 🔥 Simular error aleatorio (1 de cada 3 veces)
      if (Math.floor(Math.random() * 2) === 0) {
        console.error("Simulación de error en inscripción.");
        setStatus("Error al procesar la inscripción. Inténtalo de nuevo.");
        return; // 🚨 Si hay error, no continuar con la inscripción
      }
  
      try {
        const db = getDatabase();
        const inscripcionRef = ref(db, `usuarios/${userId}/cursos_inscritos/${curso.slug}`);
  
        const cursoCompleto = {
          fecha_inscripcion: new Date().toISOString().split("T")[0],
          progreso: "0%",
          titulo: curso.titulo || "Sin título",
          descripcion_corta: curso.descripcion_corta || curso.descripcion || "Sin descripción corta",
          descripcion_detallada: curso.descripcion_detallada || curso.descripcion || "Sin detalles",
          duracion: curso.duracion || "Duración no especificada",
          imagen: curso.imagen || "/imagenes/default.png",
          nivel: curso.nivel || "Nivel no especificado",
          videoPath: curso.videoPath || "",
          precio: curso.precio || "0 USD",
        };
  
        console.log("Intentando guardar en Firebase:", cursoCompleto);
  
        await update(inscripcionRef, cursoCompleto);
        console.log("✅ Curso guardado en Firebase con éxito");
  
        setStatus("¡Se ha inscrito al curso exitosamente!");
  
        if (onCompraExitosa) {
          onCompraExitosa();
        }
  
      } catch (error) {
        console.error("🔥 Error real en Firebase:", error);
        setStatus(`Error real: ${error.message}`);
      }
    }, 2000);
  };
  
  
  

  
  return (
    <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Confirmación de Compra</h2>
        <p className="mb-4">¿Deseas inscribirte en el curso <strong>{curso.titulo}</strong>?</p>

        {status ? (
          <>
            <p className="text-center font-semibold text-blue-600">{status}</p>
            <button onClick={onClose} className="mt-4 w-full bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition">
              Cerrar
            </button>
          </>
        ) : (
          <div className="flex justify-between">
            <button onClick={handleCompra} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
              Confirmar
            </button>
            <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompraDialog;
