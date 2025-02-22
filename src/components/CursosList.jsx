import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../lib/firebase";
import UseCurrency from "../hook/useCurrency";

const symbolMap = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const CursosList = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currency } = UseCurrency();

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

  // 🔥 **Nuevo efecto: Escucha cambios en la moneda y fuerza un re-render**
  useEffect(() => {
    const handleCurrencyChange = () => {
      console.log("Moneda cambiada a:", currency); //Verifica que el cambio se detecta
      setCursos((prevCursos) => [...prevCursos]); //Forzar re-render
    };

    window.addEventListener("currencyChange", handleCurrencyChange);
    return () => {
      window.removeEventListener("currencyChange", handleCurrencyChange);
    };
  }, [currency]);

  if (loading) {
    return <p className="text-center text-lg">Cargando cursos...</p>;
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Catálogo de Cursos
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {cursos.map((curso) => {
          const displayedPrice =
            curso.precio === "Free"
              ? "Gratis"
              : currency === "EUR"
              ? `${symbolMap["EUR"]}${curso.precioEUR ?? "N/A"}`
              : currency === "GBP"
              ? `${symbolMap["GBP"]}${curso.precioGBP ?? "N/A"}`
              : `${symbolMap["USD"]}${curso.precioUSD ?? "N/A"}`;

          return (
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
                <p className="text-red-500 font-semibold">{displayedPrice}</p>

                <a
                  href={`/catalogo/${curso.slug}`}
                  className="block mt-4 text-center bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
                >
                  Ver más
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CursosList;
