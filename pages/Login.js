import React, { useState } from "react";
import { Button, Card, Grid, Loading, Text } from "@nextui-org/react";
import { GoogleOutlined } from "@ant-design/icons";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth, db, storage } from "../firebase";

const provider = new GoogleAuthProvider();

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      await signInWithRedirect(auth, provider);
    } catch (e) {
      setError(e?.message || "Erreur connexion Google");
      setLoading(false);
    }
  };

  return loading ? (
    <Grid.Container justify="center" css={{ position: "absolute", top: "40%" }}>
      <Text>Loading</Text>
      <Loading size="xl" type="points-opacity" />
    </Grid.Container>
  ) : (
    <Grid.Container css={{ position: "absolute", height: "100%" }}>
      <Card css={{ margin: "auto", maxWidth: 520, width: "92%" }}>
        <Card.Header>
          <Text b>Welcome to Babel</Text>
        </Card.Header>
        <Card.Body>
          {error && <Text color="error">{error}</Text>}
          <Button onPress={handleGoogleSignIn}>
            <GoogleOutlined /> Sign In with Google
          </Button>
        </Card.Body>
      </Card>
    </Grid.Container>
  );
}
