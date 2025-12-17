import { auth, db, storage } from "../firebase";
import React from "react";

import Image from "next/image";


export default function SignOut() {

  const photoProfil = auth.currentUser.photoURL ? auth.currentUser.photoURL : false;

  return (
    auth.currentUser && (
      <>
    <Image
                width={50}
                height={50}
                src={photoProfil}
                alt="photo profil"
              ></Image>
      <div>{auth.currentUser ? auth.currentUser.displayName : "Unknown"}</div>
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button></>
    )
  );
}
