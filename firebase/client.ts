
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAxHOsDS9iFEann-iLrddvYL5yGUQvWvvU",
  authDomain: "prepwise-da7f8.firebaseapp.com",
  projectId: "prepwise-da7f8",
  storageBucket: "prepwise-da7f8.appspot.com",
  messagingSenderId: "615386399890",
  appId: "1:615386399890:web:5393acb8414909094ed24b",
  measurementId: "G-61ZYCETDW8"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig): getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);