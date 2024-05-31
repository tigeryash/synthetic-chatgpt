import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbwq_cvQ-gu6YD5zxypvepCbGyuMX3D_k",
  authDomain: "synthetic-eb92e.firebaseapp.com",
  projectId: "synthetic-eb92e",
  storageBucket: "synthetic-eb92e.appspot.com",
  messagingSenderId: "245265457714",
  appId: "1:245265457714:web:cc4a85552bc3609098d22b",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
