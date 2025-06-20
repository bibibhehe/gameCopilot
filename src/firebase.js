// Firebase config for Pikachu game
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB21Av_D4_B3c7IkDtUCIWVWzOP3H5O6Bw",
  authDomain: "gamepikachucopilot.firebaseapp.com",
  projectId: "gamepikachucopilot",
  storageBucket: "gamepikachucopilot.firebasestorage.app",
  messagingSenderId: "305795418140",
  appId: "1:305795418140:web:19f4a9e264ba7eb313b7d9",
  measurementId: "G-4FN5BYQ0QK"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
