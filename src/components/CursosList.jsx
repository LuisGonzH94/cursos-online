import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../lib/firebase";

const CursosList = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [escuelaSeleccionada, setEscuelaSeleccionada] = useState("");
  const [filtroPrecio, setFiltroPrecio] = useState("");

  useEffect(() => {
    const cursosRef = ref(database, "cursos");
    onValue(cursosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const cursosList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setCursos(cursosList);
      }
      setLoading(false);
    });
  }, []);

  const cursosFiltrados = cursos.filter((curso) => {
    const coincideCategoria = escuelaSeleccionada ? curso.escuela === escuelaSeleccionada : true;
    const coincidePrecio = filtroPrecio
      ? filtroPrecio === "gratis"
        ? curso.precio.toLowerCase() === "free"
        : curso.precio.toLowerCase() !== "free"
      : true;
    return coincideCategoria && coincidePrecio;
  });

  if (loading) {
    return <p className="text-center text-lg">Cargando cursos...</p>;
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {escuelaSeleccionada ? `Cursos de ${escuelaSeleccionada}` : ""}
      </h1>

      {/* Filtros */}
      <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
        <div className="flex flex-wrap justify-center gap-4">
          {["Programación y Desarrollo Web", "Desarrollo Backend", "Desarrollo Frontend", "Ciberseguridad"].map(
            (categoria) => (
              <button
                key={categoria}
                onClick={() => setEscuelaSeleccionada(categoria)}
                className={`px-4 py-2 rounded-md shadow ${
                  escuelaSeleccionada === categoria
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 hover:bg-red-500 hover:text-white transition"
                }`}
              >
                {categoria}
              </button>
            )
          )}
          <button
            onClick={() => setEscuelaSeleccionada("")}
            className="px-4 py-2 rounded-md shadow bg-gray-400 text-white hover:bg-gray-600 transition"
          >
            Ver Todos
          </button>
        </div>

        {/* Filtro por precios */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="precio"
              value="gratis"
              checked={filtroPrecio === "gratis"}
              onChange={() => setFiltroPrecio("gratis")}
              className="accent-red-500"
            />
            <span className="text-gray-700">Gratis</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="precio"
              value="pagado"
              checked={filtroPrecio === "pagado"}
              onChange={() => setFiltroPrecio("pagado")}
              className="accent-red-500"
            />
            <span className="text-gray-700">Pagados</span>
          </label>
          <button
            onClick={() => setFiltroPrecio("")}
            className="px-4 py-2 rounded-md shadow bg-gray-400 text-white hover:bg-gray-600 transition"
          >
            Todos
          </button>
        </div>
      </div>

      {/* Diseño responsivo de las cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {cursosFiltrados.map((curso) => (
          <div key={curso.id} className="bg-white p-6 shadow-lg rounded-lg border border-gray-300 flex flex-col h-full">
            <img
              src={curso.imagen}
              alt={curso.titulo}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">{curso.titulo}</h2>
            <p className="text-gray-600 flex-grow">{curso.descripcion_corta}</p>

            <div className="mt-auto">
              <p className="text-sm text-gray-500">Duración: {curso.duracion}</p>
              <p className="text-sm text-blue-600">Nivel: {curso.nivel}</p>
              <p className="text-red-500 font-semibold">
                {curso.precio === "free" ? "Gratis" : `${curso.precio}`}
              </p>

              {/* Botón de acción alineado abajo */}
              <a
                href={`/catalogo/${curso.slug}`}
                className="block mt-4 text-center bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
              >
                Ver más
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CursosList;
