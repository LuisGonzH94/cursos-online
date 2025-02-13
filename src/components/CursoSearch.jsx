import { useState, useEffect, useRef } from "react";
import { fetchCursos } from "../lib/fetchCursos";

function CursoSearch() {
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [allCursos, setAllCursos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  // Obtener los cursos al montar el componente
  useEffect(() => {
    const getData = async () => {
      const cursos = await fetchCursos();
      setAllCursos(cursos);
    };
    getData();
  }, []);

  // Manejar los cambios en el input
  const handleOnSearch = (e) => {
    const valor = e.target.value;
    setQuery(valor);

    if (valor.trim() === "") {
      setFilteredResults([]);
      setIsModalOpen(false);
      return;
    }

    const lowerTerm = valor.toLowerCase();
    const filtrados = allCursos.filter((curso) =>
      curso.titulo.toLowerCase().includes(lowerTerm)
    );

    setFilteredResults(filtrados);
    setIsModalOpen(filtrados.length > 0);
  };

  // Cerrar modal manualmente
  const closeModal = () => {
    setIsModalOpen(false);
    setQuery("");
  };

  // Cerrar modal al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full md:w-64">
      {/* Input de búsqueda */}
      <input
        type="text"
        placeholder="Buscar cursos..."
        value={query}
        onChange={handleOnSearch}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
      />

      {/* Modal de resultados */}
      {isModalOpen && (
        <div
          ref={modalRef}
          className="absolute top-12 left-0 w-full md:w-96 bg-white rounded-lg shadow-lg p-4 max-h-60 overflow-y-auto z-50 transition-transform duration-300 ease-in-out border border-gray-200"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Resultados de búsqueda
          </h2>

          {/* Lista de resultados */}
          {filteredResults.length > 0 ? (
            <ul className="space-y-2">
              {filteredResults.map((curso) => (
                <li key={curso.slug} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md">
                  <img
                    src={curso.imagen}
                    alt={curso.titulo}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                  <a
                    href={`/catalogo/${curso.slug}`}
                    className="text-blue-700 hover:underline"
                    onClick={closeModal}
                  >
                    {curso.titulo}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No se encontraron resultados.</p>
          )}

          {/* Botón de cierre solo en pantallas grandes */}
          <button
            className="hidden md:block mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full"
            onClick={closeModal}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}

export default CursoSearch;
