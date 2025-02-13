import { useState, useEffect } from "react";
import CarritoDialog from "./CarritoDialog";

const CarritoIcono = () => {
  const [carrito, setCarrito] = useState([]);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Obtener userId del localStorage
    const storedUserId = localStorage.getItem("currentUserId");
    setUserId(storedUserId);

    // Obtener carrito del localStorage
    const storedCarrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    setCarrito(storedCarrito);

    // Escuchar cambios en el carrito
    const actualizarCarrito = () => {
      const updatedCarrito = JSON.parse(localStorage.getItem("carrito") || "[]");
      setCarrito(updatedCarrito);
    };
    window.addEventListener("carritoActualizado", actualizarCarrito);
    return () => window.removeEventListener("carritoActualizado", actualizarCarrito);
  }, []);

  return (
    <div className="relative">
<button onClick={() => setMostrarDialogo(true)} className="relative">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 md:w-8 md:h-8 text-white"
    fill="currentColor"
    viewBox="0 0 576 512"
  >
    <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24z" />
  </svg>
  {carrito.length > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs md:text-sm px-2 py-0.5 rounded-full">
      {carrito.length}
    </span>
  )}
</button>


      {mostrarDialogo && <CarritoDialog userId={userId} onClose={() => setMostrarDialogo(false)} />}
    </div>
  );
};

export default CarritoIcono;
