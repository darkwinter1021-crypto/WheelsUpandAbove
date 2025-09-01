
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "wheelsup-9dvzz",
  "appId": "1:747903537053:web:bcc8559e59ba93e9a92974",
  "storageBucket": "wheelsup-9dvzz.firebasestorage.app",
  "apiKey": "AIzaSyC-AY-RsgCDjQojI2eeYTp6lA0zysl92YM",
  "authDomain": "wheelsup-9dvzz.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "747903537053"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
