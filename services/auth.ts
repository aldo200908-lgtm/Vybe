import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
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
 * Credenciales del proyecto 'vybe-247f2'.
 */
const firebaseConfig = {
  apiKey: "AIzaSyATQ9vvGrwkWQ9-rk7BYE5xKjrKBFo8AtU",
  authDomain: "vybe-247f2.firebaseapp.com",
  projectId: "vybe-247f2",
  storageBucket: "vybe-247f2.firebasestorage.app",
  messagingSenderId: "116209437083",
  appId: "1:116209437083:web:427b5576550c5abfa8393e",
  measurementId: "G-WNQRG2GGTN"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Analytics de manera silenciosa para no bloquear la app
// Usamos isSupported para evitar errores en entornos restringidos
isSupported().then(supported => {
  if (supported) {
    try {
      getAnalytics(app);
    } catch (e) {
      console.warn("Analytics no pudo iniciarse (no es crítico):", e);
    }
  }
}).catch(() => {
  // Ignoramos errores de soporte de analytics
});

// Inicializar Auth
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