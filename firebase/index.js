import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: "terminal00.firebaseapp.com",
  projectId: "terminal00",
  storageBucket: "terminal00.appspot.com",
  messagingSenderId: "927945366317",
  appId: "1:927945366317:web:b99dbfbb2bd509549811a4",
  measurementId: "G-8RCP8C0098",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
