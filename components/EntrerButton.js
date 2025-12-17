import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/Button.module.css";
import { auth, db, storage } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

export default function EntrerButton() {
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const provider = useMemo(() => {
    const p = new GoogleAuthProvider();
    p.setCustomParameters({ prompt: "select_account" });
    p.addScope("email");
    p.addScope("profile");
    return p;
  }, []);

  // 1) Persistance + récupération redirect (au retour)
  useEffect(() => {
    (async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (e) {
        console.warn("setPersistence error:", e);
      }

      try {
        const res = await getRedirectResult(auth);
        if (res?.user) {
          console.log("✅ Redirect login OK:", res.user?.email);
        }
      } catch (e) {
        // pas bloquant
        console.warn("getRedirectResult error:", e);
      }
    })();
  }, []);

  async function login() {
    setErr("");
    setBusy(true);

    try {
      // 2) Popup en priorité
      const res = await signInWithPopup(auth, provider);
      console.log("✅ Popup login OK:", res.user?.email);
      setBusy(false);
      return;
    } catch (e) {
      const code = String(e?.code || "");
      const msg = String(e?.message || "");

      console.warn("Popup error:", code, msg);

      // 3) Popup bloqué → Redirect fallback
      const popupBlocked =
        code === "auth/popup-blocked" ||
        code === "auth/popup-closed-by-user" ||
        code.includes("popup") ||
        msg.toLowerCase().includes("popup");

      if (popupBlocked) {
        try {
          console.log("➡️ Popup blocked → redirect...");
          await signInWithRedirect(auth, provider);
          // IMPORTANT: après redirect, le navigateur quitte la page
          return;
        } catch (e2) {
          setErr(`Redirect error: ${String(e2?.code || "")} ${String(e2?.message || e2)}`);
          setBusy(false);
          return;
        }
      }

      setErr(`${code} ${msg}`);
      setBusy(false);
    }
  }

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <button className={styles.btn} type="button" onClick={login} disabled={busy}>
          {busy ? "Connexion..." : "Accès Gmail"}
        </button>

        {err && (
          <div style={{ marginTop: 10, color: "#fff", maxWidth: 520, whiteSpace: "pre-wrap" }}>
            {err}
          </div>
        )}
      </div>
    </div>
  );
}
