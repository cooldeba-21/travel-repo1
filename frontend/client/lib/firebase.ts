import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxEboar4FsKz34f1__KyFjaiBLkI0_e58",
  authDomain: "trav-5b102.firebaseapp.com",
  projectId: "trav-5b102",
  storageBucket: "trav-5b102.firebasestorage.app",
  messagingSenderId: "277640300797",
  appId: "1:277640300797:web:fdbcc722a53be6d7c39694",
  measurementId: "G-NTYM7PC0ZK",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Firebase Auth
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
googleProvider.addScope("email");
googleProvider.addScope("profile");
