import { Grid, Loading } from "@nextui-org/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import NavBar from "@/components/NavBar";
import EntrerButton from "@/components/EntrerButton";
import styles from "@/styles/Button.module.css";

export default function HomeClient() {
  const [user, loading] = useAuthState(auth);

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

  return <>{user ? <NavBar /> : <EntrerButton />}</>;
}
