import { useState, useEffect } from "react";
import { getDatabase, ref, get, update } from "firebase/database";

function ContenidoCurso({ userId, cursoId, videoPath, onClose }) {
  const [isInscrito, setIsInscrito] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    const verificarInscripcion = async () => {
      const db = getDatabase();
      const userRef = ref(db, `usuarios/${userId}/cursos_inscritos/${cursoId}`);

      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setIsInscrito(true);
          setProgreso(parseInt(snapshot.val().progreso || "0", 10));
        } else {
          setIsInscrito(false);
        }
      } catch (error) {
        console.error("Error al verificar la inscripción:", error);
        setIsInscrito(false);
      } finally {
        setLoading(false);
      }
    };

    verificarInscripcion();
  }, [userId, cursoId]);

  const actualizarProgreso = () => {
    if (progreso < 100) {
      const nuevoProgreso = Math.min(progreso + 10, 100);  // Aumenta el progreso hasta un máximo de 100%
      setProgreso(nuevoProgreso);

      const db = getDatabase();
      const progresoRef = ref(db, `usuarios/${userId}/cursos_inscritos/${cursoId}`);
      update(progresoRef, { progreso: `${nuevoProgreso}%` })
        .then(() => console.log("Progreso actualizado a:", nuevoProgreso))
        .catch((error) => console.error("Error al actualizar el progreso:", error));
    }
  };

  if (loading) {
    return <div className="text-white">Verificando inscripción...</div>;
  }

  if (!isInscrito) {
    return (
      <div className="text-red-500">
        No estás inscrito en este curso. Por favor, inscríbete para acceder al contenido.
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <h2 className="text-2xl font-bold mb-4">Contenido del Curso</h2>
        <video
          controls
          className="w-full rounded-md shadow-md"
          onPlay={actualizarProgreso}
        >
          <source src={videoPath} type="video/mp4" />
          Tu navegador no soporta la reproducción de este video.
        </video>
        <p className="mt-4 text-gray-700">Progreso actual: {progreso}%</p>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default ContenidoCurso;
