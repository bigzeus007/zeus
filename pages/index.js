import React, { useEffect, useState } from "react";
import "firebase/firestore";

import Login from "./Login";
import { auth } from "../firebase";

import { useAuthState } from "react-firebase-hooks/auth";
import NavBar from "./NavBar";
import { Grid, Loading, Text } from "@nextui-org/react";

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    if (!user && !loading) {
      setRedirectToLogin(true);
      setTimeout(() => {
        setRedirectToLogin(false);
      }, 2000); // delay of 2 seconds
    }
  }, [user, loading]);

  if (redirectToLogin) {
    return <Login />;
  }

  return <>{user ? <NavBar /> : <Grid.Container justify="center" css={{position:"absolute",top:"40%"}}><Text>Loading</Text><Loading size="xl"  type="points-opacity"></Loading></Grid.Container>}</>;
}
