// Modern Firebase v9+ imports
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyC7TCVFqoPLlc7hsiZKFqrBZyT19zpeG5I",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "clone-34c58.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "clone-34c58",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "clone-34c58.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "435374009295",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:435374009295:web:9ddc8b828673595c1000ba",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
