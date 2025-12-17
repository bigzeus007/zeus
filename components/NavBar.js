import { useEffect, useState } from "react";
import Image from "next/image";

import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

import TakePicture from "./AddCar";
import ParcSav from "./ParcSav";
import CustomerParking from "./CustomerParking";

export default function NavBar() {
  const currentUser = auth.currentUser;

  const photoProfil =
    currentUser?.photoURL ||
    "https://firebasestorage.googleapis.com/v0/b/terminal00.appspot.com/o/cars%2Fanonymous.png?alt=media";

  const [toggle, setToggle] = useState("close");
  const [rubrique, setRubrique] = useState(null);
  const [darkMode, setDarkMode] = useState("");
  const [user, setUser] = useState({ job: "ND" });

  useEffect(() => {
    if (!currentUser?.email) return;

    const fetchUser = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("email", "==", currentUser.email)
        );
        const snap = await getDocs(q);
        if (!snap.empty) setUser(snap.docs[0].data());
      } catch (e) {
        console.error("fetchUser error:", e);
      }
    };

    fetchUser();
  }, [currentUser?.email]);

  if (!currentUser) return null;

  return (
    <div className={darkMode}>
      <nav className={`sidebar ${toggle}`}>
        <header>
          <div className="image-text">
            <div className="text logo-text">
              <span className="name">Tarhi Said</span>
              <span className="profession">{user.job}</span>
            </div>
          </div>
        </header>

        <ul className="menu-links">
          <li onClick={() => setRubrique("Parc")}>Ajouter</li>
          <li onClick={() => setRubrique("ParcSav")}>Courtoisie</li>
          <li onClick={() => setRubrique("ParkingCustomer")}>
            Parking Clients
          </li>
        </ul>

        <button onClick={() => auth.signOut()}>Logout</button>
      </nav>

      <section className="home">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>User : {currentUser.displayName}</p>
          <Image src={photoProfil} width={48} height={48} alt="profil" />
        </div>

        {rubrique === "Parc" && <TakePicture />}
        {rubrique === "ParcSav" && <ParcSav />}
        {rubrique === "ParkingCustomer" && (
          <CustomerParking user={user} />
        )}
      </section>
    </div>
  );
}
