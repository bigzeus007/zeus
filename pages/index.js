import React, { useEffect, useState } from "react";
import { Grid, Loading } from "@nextui-org/react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getRedirectResult } from "firebase/auth";
import NavBar from "./NavBar";
import EntrerButton from "@/components/EntrerButton";
import styles from "../styles/Button.module.css";

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  const [bootMsg, setBootMsg] = useState("");

  // Sécurité: consommer redirect ici aussi
  useEffect(() => {
    (async () => {
      try {
        const res = await getRedirectResult(auth);
        if (res?.user) setBootMsg(`✅ Connecté: ${res.user?.email || ""}`);
      } catch (e) {
        // pas bloquant
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className={styles.body}>
        <div className={styles.container}>
          <div className={styles.btn}>
            <Grid>
              <Loading textColor="white" size="md" type="points-opacity">
                Loading
              </Loading>
            </Grid>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.body}>
        <div className={styles.container} style={{ color: "white", maxWidth: 680 }}>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Erreur Auth</div>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(error?.message || error)}</pre>
          <div style={{ marginTop: 12 }}>{bootMsg}</div>
          <EntrerButton />
        </div>
      </div>
    );
  }

  return <>{user ? <NavBar /> : <EntrerButton />}</>;
}
