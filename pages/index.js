import React from "react";
import "firebase/firestore";
import { Grid, Loading, Text } from "@nextui-org/react";
import Login from "./Login";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import NavBar from "./NavBar";
import EntrerButton from "@/components/EntrerButton";
import styles from "../styles/Button.module.css";

export default function Home() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      
      <div className={styles.body}>
           
        <div className={styles.container}>
        <div className={styles.btn}>
        <Grid>
        <a href="#"><Loading textColor="white" size="md" type="points-opacity" >Loading</Loading></a>
      </Grid>
        </div>
      </div></div>
    );
  }

  return (
    <>
      {/* Render the NavBar if the user is authenticated */}
      {user ? <NavBar /> : <EntrerButton loading={loading} />}
    </>
  );
}
