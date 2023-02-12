// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "firebase/compat/auth";
import { getFirestore} from 'firebase/firestore';
import { getStorage } from "firebase/storage";

    
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAh-m5DJvlcc_ccpYY9T3698typatRyZUY",
  authDomain: "terminal00.firebaseapp.com",
  projectId: "terminal00",
  storageBucket: "terminal00.appspot.com",
  messagingSenderId: "927945366317",
  appId: "1:927945366317:web:b99dbfbb2bd509549811a4",
  measurementId: "G-8RCP8C0098"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

