import { useState, useEffect } from "react";
import CompraDialog from "./CompraDialog";
import ContenidoCurso from "../curso/ContenidoCurso";
import IniciarSesionDialog from "./IniciarSesionDialog";
import { getDatabase, ref, get } from "firebase/database";

const DetalleCurso = ({ curso }) => {
  const [userId, setUserId] = useState("");
  const [mostrarDialogoCompra, setMostrarDialogoCompra] = useState(false);
  const [mostrarDialogoSesion, setMostrarDialogoSesion] = useState(false);
  const [yaInscrito, setYaInscrito] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [mostrarContenido, setMostrarContenido] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("currentUserId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
    const storedCarrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    setCarrito(storedCarrito);
  }, []);

  const handleInscripcion = () => {
    if (!userId) {
      setMostrarDialogoSesion(true);
      return;
    }

    if (curso.precio === "Free") {
      setMostrarDialogoCompra(true);
    } else {
      // agregar el curso de pago al carrito, sin abrir el diálogo de compra
      const nuevoCarrito = [
        ...carrito,
        {
          slug: curso.slug,
          titulo: curso.titulo,
          descripcion_corta: curso.descripcion_corta || curso.descripcion || "Sin descripción corta",
          descripcion_detallada: curso.descripcion_detallada || curso.descripcion || "Sin detalles",
          duracion: curso.duracion || "Duración no especificada",
          imagen: curso.imagen || "/imagenes/default.png",
          nivel: curso.nivel || "Nivel no especificado",
          videoPath: curso.videoPath || "",
          precio: curso.precio || "0 USD",
        },
      ];

      setCarrito(nuevoCarrito);
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
      window.dispatchEvent(new Event("carritoActualizado"));

      // ✅ Mostrar alerta de éxito para cursos de pago
      alert("¡Curso agregado al carrito!");
    }
  };

  // 🔥 Nueva función para actualizar `yaInscrito` al inscribirse
  const handleCompraExitosa = () => {
    setYaInscrito(true);
    setMostrarDialogoCompra(false);
  };

  return (
    <div className="bg-gradient-to-b from-yellow-100 via-orange-50 to-white min-h-screen px-6 pt-32 md:pt-40 lg:pt-48">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-2xl rounded-lg border border-gray-200">
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
          <span className="text-3xl font-bold text-red-600">
            {curso.precio === "Free" ? "Gratis" : `${curso.precio} USD`}
          </span>

          {yaInscrito ? (
            <button
              onClick={() => setMostrarContenido(true)}
              className="mt-4 md:mt-0 bg-green-500 text-white px-6 py-3 rounded-lg shadow-md"
            >
              Ver contenido
            </button>
          ) : (
            <button
              onClick={handleInscripcion}
              className="mt-4 md:mt-0 bg-red-500 text-white px-6 py-3 rounded-lg shadow-md"
            >
              {curso.precio === "Free" ? "Inscribirme" : "Agregar al carrito"}
            </button>
          )}
        </div>

        {/* Dialogo de Compra */}
        {mostrarDialogoCompra && (
          <CompraDialog 
            curso={curso} 
            userId={userId} 
            onClose={() => setMostrarDialogoCompra(false)} 
            onCompraExitosa={handleCompraExitosa} 
          />
        )}

        {/* Dialogo de Iniciar Sesión */}
        {mostrarDialogoSesion && (
          <IniciarSesionDialog onClose={() => setMostrarDialogoSesion(false)} />
        )}

        {/*Ahora se renderiza `ContenidoCurso` cuando se da clic en "Ver contenido" */}
        {mostrarContenido && (
          <ContenidoCurso
            userId={userId}
            cursoId={curso.slug}
            videoPath={curso.videoPath}
            onClose={() => setMostrarContenido(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DetalleCurso;
