import { database } from "./firebase";
import { ref, get } from "firebase/database";

// Función para obtener los cursos de Firebase Realtime Database
export const fetchCursos = async () => {
  const cursosRef = ref(database, "cursos");
  const snapshot = await get(cursosRef);

  if (!snapshot.exists()) {
    console.error("No se encontraron datos en Firebase.");
    return [];
  }

  // Retorna los cursos en forma de array
  return Object.values(snapshot.val());
};
