// src/lib/firebase.js
import { initializeApp } from "firebase/app"; // Inicializa Firebase
import { getDatabase } from "firebase/database"; // Importa Realtime Database

// Configuración de tu proyecto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA_UM1-r_LHEzLJW15iBgmPCyjXY0-GGlI",
    authDomain: "dam2team.firebaseapp.com",
    databaseURL: "https://dam2team-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "dam2team",
    storageBucket: "dam2team.firebasestorage.app",
    messagingSenderId: "1056566925602",
    appId: "1:1056566925602:web:7af7bd3b34c317dd806d7b",
    measurementId: "G-SRQ8R94V1F"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta la instancia de la base de datos
const database = getDatabase(app);
export { database };