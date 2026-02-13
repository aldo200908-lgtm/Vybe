import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";

/**
 * CONFIGURACIÓN DE FIREBASE
 * En Vite, las variables de entorno deben comenzar con VITE_.
 * Ajuste: Usamos process.env en lugar de import.meta.env para compatibilidad con el entorno actual.
 */

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Inicialización defensiva. 
// initializeApp maneja internamente configs vacías lanzando errores descriptivos de Firebase si faltan keys,
// pero esto evita el crash de JS inmediato por intentar leer propiedades de undefined.
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configuración del proveedor de Google
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const authService = {
  signIn: async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  },
  signUp: async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  },
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Google Auth Error:", error);
      throw error;
    }
  },
  logout: async () => {
    await signOut(auth);
  },
  onAuthUpdate: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, (user) => {
      callback(user);
    });
  },
  getCurrentUser: () => {
    return auth.currentUser;
  }
};