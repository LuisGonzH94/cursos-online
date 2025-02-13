import { useState, useEffect } from "react";

const slides = [
  {
    image: "/imagenes/desarrollo-aplicaciones-web.png",
    title: "Explora Nuevas Dimensiones",
    description: "Imagina lo imposible y hazlo realidad con diseño innovador.",
  },
  {
    image: "/imagenes/teclado-codigo.png",
    title: "La Belleza del Concepto",
    description: "El arte conceptual es la esencia de cada proyecto creativo.",
  },
  {
    image: "/imagenes/mobile-cloud.png",
    title: "Tecnología y Creatividad",
    description: "Cuando la tecnología se une con la creatividad, el futuro es ilimitado.",
  },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotación automática del carrusel cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, []);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 px-4 sm:px-6 md:px-12 lg:px-16 rounded-lg shadow-2xl overflow-hidden">
      {/* Contenedor del slide */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-6 sm:p-8 md:p-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold">{slide.title}</h2>
              <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Botones de navegación manual */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-6 md:left-8">
        <button
          onClick={goToPrevious}
          className="p-2 sm:p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-6 md:right-8">
        <button
          onClick={goToNext}
          className="p-2 sm:p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Carousel;
