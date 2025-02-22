import { useState, useEffect } from "react";
import { getDatabase, ref, update } from "firebase/database"; //Se restauró esta importación
import UseCurrency from "../hook/UseCurrency"; //Hook para la moneda actual

const symbolMap = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const CarritoDialog = ({ userId, onClose }) => {
  const [carrito, setCarrito] = useState([]);
  const { currency } = UseCurrency(); //Detectamos la moneda actual

  useEffect(() => {
    const storedCarrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    setCarrito(storedCarrito);
  }, []);

  //Función para eliminar un curso del carrito
  const handleEliminarCurso = (slug) => {
    const nuevoCarrito = carrito.filter((curso) => curso.slug !== slug);
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  //Función para comprar cursos y guardarlos en Firebase
  const handleCompra = async () => {
    if (!userId) {
      alert("Debes iniciar sesión para realizar la compra.");
      return;
    }

    const db = getDatabase();

    try {
      await Promise.all(
        carrito.map((curso) => {
          const inscripcionRef = ref(db, `usuarios/${userId}/cursos_inscritos/${curso.slug}`);
          return update(inscripcionRef, {
            fecha_inscripcion: new Date().toISOString().split("T")[0],
            progreso: "0%",
            titulo: curso.titulo,
            descripcion_corta: curso.descripcion_corta || "Sin descripción corta",
            descripcion_detallada: curso.descripcion_detallada || "Sin detalles",
            duracion: curso.duracion,
            imagen: curso.imagen,
            precio: curso.precio, //Guardamos el precio con la moneda actual
            videoPath: curso.videoPath || "ruta_por_defecto.mp4",
          });
        })
      );

      alert("¡Compra realizada con éxito!");

      //Vaciar el carrito después de la compra
      localStorage.removeItem("carrito");
      setCarrito([]);

      //Notificar a "Mis Cursos" para actualizarse
      window.dispatchEvent(new Event("cursosActualizados"));

      //Cerrar el diálogo automáticamente después de 500ms
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error("Error al realizar la compra:", error);
      alert("Hubo un problema al procesar la compra. Inténtalo nuevamente.");
    }
  };

  //Función para obtener el precio en la moneda actual
  const obtenerPrecioCurso = (curso) => {
    if (currency === "EUR" && curso.precioEUR !== undefined) return curso.precioEUR;
    if (currency === "GBP" && curso.precioGBP !== undefined) return curso.precioGBP;
    return curso.precioUSD ?? 0; //Fallback a USD si no hay otra moneda
  };

  //Calcular el total con la moneda actual
  const totalPrecio = carrito.reduce((total, curso) => {
    const precio = obtenerPrecioCurso(curso);
    return total + (isNaN(precio) ? 0 : precio);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Compra Ya!</h2>

        {carrito.length === 0 ? (
          <p className="text-red-900 text-center">No hay cursos en el carrito.</p>
        ) : (
          <div className="max-h-60 overflow-auto space-y-4">
            {carrito.map((curso, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-4">
                  <img src={curso.imagen} alt={curso.titulo} className="w-14 h-14 rounded-md object-cover" />
                  <div>
                    <p className="text-gray-900 font-semibold">{curso.titulo}</p>
                    <p className="text-gray-600">
                      {symbolMap[currency]}{obtenerPrecioCurso(curso).toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleEliminarCurso(curso.slug)}
                  className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-md transition duration-200 ease-in-out transform hover:scale-110 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="w-5 h-5 fill-current"
                  >
                    <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/*Mostrar el total en la moneda correcta */}
        <p className="text-xl font-bold text-gray-900 text-right mt-4">
          Total: {symbolMap[currency]}{totalPrecio.toFixed(2)}
        </p>

        <div className="mt-6 flex flex-col md:flex-row justify-between gap-4">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md w-full md:w-auto transition duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            Cerrar
          </button>
          {carrito.length > 0 && (
            <button
              onClick={handleCompra}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md w-full md:w-auto transition duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              Comprar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarritoDialog;
