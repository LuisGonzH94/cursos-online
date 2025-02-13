import { useState, useEffect } from "react";
import { ref, get, remove } from "firebase/database";
import { database } from "../lib/firebase";
import ContenidoCurso from "./ContenidoCurso";

function CursoInscritoList() {
  const [cursosInscritos, setCursosInscritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  useEffect(() => {
    fetchCursosInscritos();
  }, []);

  const fetchCursosInscritos = async () => {
    const userId = localStorage.getItem("currentUserId");
    if (!userId) {
      console.error("No se encontró el ID de usuario.");
      setLoading(false);
      return;
    }

    try {
      const userRef = ref(database, `usuarios/${userId}/cursos_inscritos`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const cursosArray = Object.entries(snapshot.val()).map(([slug, data]) => ({
          slug,
          titulo: data.titulo || "Sin título",
          descripcion_corta: data.descripcion_corta || data.descripcion || "Descripción no disponible",
          duracion: data.duracion || "Duración no especificada",
          progreso: data.progreso || "0%",
          imagen: data.imagen || "/imagenes/default.png",
          videoPath: data.videoPath || "",
        }));

        localStorage.setItem("cursos_inscritos", JSON.stringify(cursosArray));
        setCursosInscritos(cursosArray);
      } else {
        localStorage.removeItem("cursos_inscritos");
      }
    } catch (error) {
      console.error("Error al obtener los cursos inscritos:", error);
    }
    setLoading(false);
  };

  const handleBajaCurso = async (slug) => {
    const userId = localStorage.getItem("currentUserId");
    const cursoRef = ref(database, `usuarios/${userId}/cursos_inscritos/${slug}`);

    try {
      await remove(cursoRef);
      setCursosInscritos(cursosInscritos.filter((curso) => curso.slug !== slug));
    } catch (error) {
      console.error("Error al dar de baja el curso:", error);
    }
  };

  const handleVerContenido = (curso) => {
    setCursoSeleccionado(curso);
  };

  const handleCloseContenido = () => {
    setCursoSeleccionado(null);
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold">Cargando cursos inscritos...</div>;
  }

  if (cursosInscritos.length === 0) {
    return <div className="text-center text-lg font-semibold">No estás inscrito en ningún curso.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cursosInscritos.map((curso) => (
        <div key={curso.slug} className="p-4 bg-white shadow-md rounded-lg border border-gray-300 flex flex-col h-auto min-h-[280px]">
          <img src={curso.imagen} alt={curso.titulo} className="w-full h-32 object-cover rounded-md mb-3" />
          
          <h2 className="text-lg font-semibold text-gray-800 truncate">{curso.titulo}</h2>
          <p className="text-gray-600 text-sm mt-1 truncate">{curso.descripcion_corta}</p>

          <div className="mt-2">
            <p className="text-xs text-gray-500">Duración: {curso.duracion}</p>
            <p className="text-xs text-green-600 font-semibold">Progreso: {curso.progreso}</p>
          </div>

          <div className="mt-auto flex gap-2">
            <button
              onClick={() => handleVerContenido(curso)}
              className="flex-1 bg-amber-500 text-white px-2 py-1 rounded-md hover:bg-amber-600 transition text-center text-sm"
            >
              Visualizar
            </button>
            <button
              onClick={() => handleBajaCurso(curso.slug)}
              className="flex-1 bg-gray-700 text-white px-2 py-1 rounded-md hover:bg-gray-800 transition text-center text-sm"
            >
              Terminar
            </button>
          </div>
        </div>
      ))}
      
      {cursoSeleccionado && (
        <ContenidoCurso
          userId={localStorage.getItem("currentUserId")}
          cursoId={cursoSeleccionado.slug}
          videoPath={cursoSeleccionado.videoPath}
          onClose={handleCloseContenido}
        />
      )}
    </div>
  );
}

export default CursoInscritoList;
