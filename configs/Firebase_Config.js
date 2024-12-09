// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import Config from 'react-native-config';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:"AIzaSyA983SsOP5emYVNoFJfk6uSpz1C_kIzmgE",
  authDomain: "aitripplanner-3b773.firebaseapp.com",
  projectId: "aitripplanner-3b773",
  storageBucket: "aitripplanner-3b773.firebasestorage.app",
  messagingSenderId: "459630156196",
  appId: "1:459630156196:web:d97986a89f093c6e4a8931",
  measurementId: "G-9E87SWB8Z2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);