import React from "react";
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { auth } from "../firebase";

export default function GoogleLoginButton() {
  const loginPopup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const res = await signInWithPopup(auth, provider);
      console.log("✅ Popup OK:", res.user?.email);
    } catch (e) {
      console.error("❌ Popup error:", e?.code, e?.message, e);

      // Fallback automatique si popup bloqué
      if (e?.code === "auth/popup-blocked" || e?.code === "auth/popup-closed-by-user") {
        try {
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({ prompt: "select_account" });
          await signInWithRedirect(auth, provider);
        } catch (e2) {
          console.error("❌ Redirect error:", e2?.code, e2?.message, e2);
          alert(`Redirect error: ${e2?.code || e2?.message}`);
        }
        return;
      }

      alert(`Auth error: ${e?.code || e?.message}`);
    }
  };

  return (
    <button
      onClick={loginPopup}
      style={{
        width: 240,
        padding: "14px 22px",
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,.35)",
        background: "rgba(255,255,255,.12)",
        color: "white",
        cursor: "pointer",
        fontWeight: 800,
      }}
    >
      Accès Gmail
    </button>
  );
}
