import { useEffect, useState } from "react";
import Image from "next/image";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

import TakePicture from "@/components/AddCar";
import ParcSav from "@/components/ParcSav";
import CustomerParking from "@/components/CustomerParking";

export default function NavBar() {
  const currentUser = auth.currentUser;

  const photoProfil =
    currentUser?.photoURL ||
    "https://firebasestorage.googleapis.com/v0/b/terminal00.appspot.com/o/cars%2Fanonymous.png?alt=media&token=1bd43fc7-0820-445a-a4bf-33bf481a6c74";

  const [toggle, setToggle] = useState("close");
  const [rubrique, setRubrique] = useState(null);
  const [darkMode, setDarkMode] = useState("");

  const [user, setUser] = useState({ job: "ND" });

  useEffect(() => {
    if (!currentUser?.email) return;

    const fetchUser = async () => {
      try {
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", currentUser.email)
        );
        const snap = await getDocs(userQuery);
        if (!snap.empty) setUser(snap.docs[0].data());
      } catch (e) {
        console.log("fetchUser error:", e);
      }
    };

    fetchUser();
  }, [currentUser?.email]);

  const sideBarToggle = () => setToggle((t) => (t === "close" ? "" : "close"));
  const darkModeToggle = () => setDarkMode((m) => (m === "dark" ? "light" : "dark"));

  if (!currentUser) return null;

  return (
    <div className={darkMode}>
      <nav className={`sidebar ${toggle}`}>
        <header>
          <div className="image-text">
            <span className="image" />
            <div className="text logo-text">
              <span className="name">Tarhi Said</span>
              <span className="profession">{user?.job || "ND"}</span>
            </div>
          </div>

          <i onClick={sideBarToggle} className="bx bx-chevron-right toggle"></i>
        </header>

        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links">
              <li className="nav-link" onClick={() => setRubrique("Parc")}>
                <a href="#">
                  <i className="bx bx-image-add icon"></i>
                  <span className="text nav-text">Ajouter</span>
                </a>
              </li>

              <li className="nav-link" onClick={() => setRubrique("ParcSav")}>
                <a href="#">
                  <i className="bx bxs-parking icon"></i>
                  <span className="text nav-text">Courtoisie</span>
                </a>
              </li>

              <li className="nav-link" onClick={() => setRubrique("ParkingCustomer")}>
                <a href="#">
                  <i className="bx bxs-car-garage icon"></i>
                  <span className="text nav-text">Parking Clients</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="bottom-content">
            <li>
              <a href="#" onClick={() => auth.signOut()}>
                <i className="bx bx-log-out icon"></i>
                <span className="text nav-text">Logout</span>
              </a>
            </li>

            <li className="mode">
              <div className="sun-moon">
                <i className="bx bx-moon icon moon"></i>
                <i className="bx bx-sun icon sun"></i>
              </div>
              <span className="mode-text text">{darkMode} mode</span>

              <div className="toggle-switch" onClick={darkModeToggle}>
                <span className="switch"></span>
              </div>
            </li>
          </div>
        </div>
      </nav>

      <section className="home">
        <div
          style={{
            width: "100%",
            height: "5.5vw",
            color: "green",
            marginLeft: "20px",
            fontSize: "4vw",
          }}
        >
          Babel
          <div
            style={{
              position: "absolute",
              display: "flex",
              color: "black",
              width: "auto",
              top: "0vh",
              right: "0px",
              alignItems: "center",
              gap: 10,
            }}
          >
            <p style={{ fontSize: "3vw" }}>
              User : {currentUser.displayName || "Unknown"}
            </p>

            <Image width={50} height={50} src={photoProfil} alt="photo profil" />
          </div>
        </div>

        {rubrique === "Parc" && <TakePicture />}
        {rubrique === "ParcSav" && <ParcSav />}
        {rubrique === "ParkingCustomer" && <CustomerParking user={user} />}
      </section>
    </div>
  );
}
