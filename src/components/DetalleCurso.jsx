import { useState, useEffect } from "react";
import IniciarSesionDialog from "./IniciarSesionDialog";
import UseCurrency from "../hook/useCurrency"; // ✅ Hook de moneda

const symbolMap = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const DetalleCurso = ({ curso }) => {
  const { currency } = UseCurrency(); // ✅ Moneda seleccionada
  const [userId, setUserId] = useState("");
  const [mostrarDialogoSesion, setMostrarDialogoSesion] = useState(false);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("currentUserId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
    const storedCarrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    setCarrito(storedCarrito);
  }, []);

  //Ajuste de precios según la moneda
  const displayedPrice =
    curso.precio === "Free"
      ? "Gratis"
      : currency === "EUR"
        ? `${symbolMap["EUR"]}${curso.precioEUR ?? "0.00"}`
        : currency === "GBP"
          ? `${symbolMap["GBP"]}${curso.precioGBP ?? "0.00"}`
          : `${symbolMap["USD"]}${curso.precioUSD ?? "0.00"}`;

  const handleInscripcion = () => {
    if (!userId) {
      setMostrarDialogoSesion(true);
      return;
    }

    //Obtener carrito actualizado desde localStorage
    const storedCarrito = JSON.parse(localStorage.getItem("carrito") || "[]");

    //Comprobar si el curso ya está en el carrito
    const cursoYaEnCarrito = storedCarrito.some((item) => item.slug === curso.slug);

    if (cursoYaEnCarrito) {
      alert("Este curso ya está en el carrito.");
      return;
    }

    //Si el curso NO está en el carrito, lo agregamos
    const nuevoCarrito = [
      ...storedCarrito,
      {
        slug: curso.slug,
        titulo: curso.titulo,
        descripcion_corta: curso.descripcion_corta || "Sin descripción corta",
        descripcion_detallada: curso.descripcion_detallada || "Sin detalles",
        duracion: curso.duracion || "No especificado",
        imagen: curso.imagen || "/imagenes/default.png",
        nivel: curso.nivel || "No especificado",
        videoPath: curso.videoPath || "",
        precioUSD: curso.precioUSD ?? 0,  // Guardamos los tres precios
        precioEUR: curso.precioEUR ?? 0,
        precioGBP: curso.precioGBP ?? 0,
        precio: displayedPrice, //Guardamos el precio en la moneda seleccionada
      },
    ];

    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new Event("carritoActualizado"));
    alert("¡Curso agregado al carrito!");
  };

  return (
    <div className="bg-gradient-to-b from-yellow-100 via-orange-50 to-white min-h-screen px-6 pt-32">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-2xl rounded-lg border">
        <div className="relative overflow-hidden rounded-lg mb-8">
          <img src={curso.imagen} alt={curso.titulo} className="w-full h-80 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <h1 className="text-4xl font-bold text-white">{curso.titulo}</h1>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-lg text-gray-700"><strong>Nivel:</strong> {curso.nivel}</p>
          <p className="text-lg text-gray-700"><strong>Duración:</strong> {curso.duracion}</p>
          <p className="text-xl text-gray-600 mt-4">{curso.descripcion_larga}</p>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between">
          <span className="text-3xl font-bold text-red-600">{displayedPrice}</span>
            <button
              onClick={handleInscripcion}
              className="mt-4 md:mt-0 bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Agregar
            </button>
        </div>
        {/* Dialogo de Iniciar Sesión */}
        {mostrarDialogoSesion && (
          <IniciarSesionDialog onClose={() => setMostrarDialogoSesion(false)} />
        )}
      </div>
    </div>
  );
};

export default DetalleCurso;