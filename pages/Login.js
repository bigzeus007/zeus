
import styles from "../styles/Login.module.css";
import { GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import firebase from "firebase/compat/app";
import { auth } from "../firebase";
import { signInWithRedirect } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

const Login = () => {
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
    }
  };
  
  const handleFacebookSignIn = async () => {
    try {
      setLoading(true);
      await signInWithRedirect(
        new firebase.auth.FacebookAuthProvider()
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div id="login-page" className={styles["login-page"]}>
      <div id="login-card" className={styles["login-card"]}>
        <h2>Welcome to One Touch</h2>
        {error && <p className={styles.error}>{error}</p>}
        <button
          className={styles["login-button"]}
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <GoogleOutlined /> Sign In with Google
        </button>
        <br />
        <br />
        <button
          className={styles["login-button"]}
          onClick={handleFacebookSignIn}
          disabled={loading}
        >
          <FacebookOutlined /> Sign In with Facebook
        </button>
        {loading && <p className={styles.loading}>Loading...</p>}
      </div>
    </div>
  );
};

export default Login;
