// Firebase v9+ modular SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEyHusvGcPY9-ShcF6V33F9Q9Zf0pxGNA",
  authDomain: "clone-aa27c.firebaseapp.com",
  projectId: "clone-aa27c",
  storageBucket: "clone-aa27c.firebasestorage.app",
  messagingSenderId: "955634583794",
  appId: "1:955634583794:web:ce719ece958497ccf5a86b",
  measurementId: "G-J8P0LV8HNB", // Optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
