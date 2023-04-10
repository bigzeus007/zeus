import Head from "next/head";
import styles from "../styles/Button.module.css";
import { Button, Card, Grid, Loading, Text } from "@nextui-org/react";
import { GoogleOutlined } from "@ant-design/icons";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithRedirect } from "firebase/auth";
import { auth } from "../firebase";
import firebase from "firebase/compat/app";
import React, { useState } from "react";

const provider = new GoogleAuthProvider();

const EntrerButton = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const handleGoogleSignIn = async () => {
      try {
        setLoading(true);
        await signInWithRedirect(auth, provider);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }  };
    return (
        <div className={styles.body}>
            {loading ? (
        <div className={styles.container}>
        <div className={styles.btn}>
          <a href="#">Loading...</a>
        </div>
      </div>):(<div className={styles.container}>

        <Grid.Container >
            <Grid justify="center">
        <Text color="white" size="$lg" css={{position:"absolute",top:"10%",left:"10%"}}>Welcome to Babel</Text>
              {error && <Text>{error}</Text>}</Grid>
              </Grid.Container>
        <div  className={styles.btn}>
        
          <a onClick={() => handleGoogleSignIn()}  href="#">Accès Gmail</a>
        </div>
      </div>)}

      </div>
    );
  };
      

export default EntrerButton;