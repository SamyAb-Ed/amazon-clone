// Modern Firebase v9+ imports
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7TCVFqoPLlc7hsiZKFqrBZyT19zpeG5I",
  authDomain: "clone-34c58.firebaseapp.com",
  projectId: "clone-34c58",
  storageBucket: "clone-34c58.firebasestorage.app",
  messagingSenderId: "435374009295",
  appId: "1:435374009295:web:9ddc8b828673595c1000ba",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
