import React from "react";
import "firebase/firestore";
import Accueil  from "../components/Accueil";
import Login from "./Login";
import { auth } from "../firebase";

import { useAuthState } from "react-firebase-hooks/auth";
import NavBar from "./NavBar";

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  return (
    <>
  {user ? <NavBar /> : <Login />}
    </> 
  );
}

