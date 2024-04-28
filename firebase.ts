import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcUi_u07LrgrIQv0D2SAdbhQiSm3coTVg",
  authDomain: "chatgpt-messenger-7b128.firebaseapp.com",
  projectId: "chatgpt-messenger-7b128",
  storageBucket: "chatgpt-messenger-7b128.appspot.com",
  messagingSenderId: "1015928634481",
  appId: "1:1015928634481:web:3aa02a1f2e7ae687f0efd0",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
