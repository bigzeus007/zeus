import { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import Link from "next/link";
import TakePicture from "@/components/AddCar";
import ParcSav from "@/components/ParcSav";

export default function NavBar() {
  // const actualUser = auth.currentUser
  //   ? query(
  //       collection(db, "users"),
  //       where("email", "==", `${auth.currentUser.email}`)
  //     )
  //   : false;
  // const [user, setUser] = useState({});
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const userData = await getDocs(actualUser);
  //     userData.forEach((inUser) => setUser(inUser.data()));
  //   };
  //   fetchData();
  // }, []);

  const photoProfil = auth.currentUser.photoURL
    ? auth.currentUser.photoURL
    : false;

  const [toggle, setToggle] = useState("close");
  const [rubrique, setRubrique] = useState(null);
  const [darkMode, setDarkMode] = useState("");

  const sideBarToggle = (toggle) => {
    toggle === "close" ? setToggle("") : setToggle("close");
  };
  const darkModeToggle = (toggle) => {
    toggle === "dark" ? setDarkMode("light") : setDarkMode("dark");
  };

  return (
    <>
      <div className={darkMode}>
        <nav className={`sidebar ${toggle}`}>
          <header>
            <div className="image-text">
              <span className="image"></span>

              <div className="text logo-text">
                <span className="name">Tarhi said</span>
                <span className="profession">Web developer</span>
              </div>
            </div>

            <i
              onClick={() => {
                sideBarToggle(toggle);
              }}
              className="bx bx-chevron-right toggle"
            ></i>
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
                  <i className="bx bxs-parking icon"></i>
                  <span className="text nav-text">Courtoisie</span>
                </li>

                <li className="nav-link">
                  <a href="#">
                    <i className="bx bxs-car-garage icon"></i>
                    <span className="text nav-text">Notifications</span>
                  </a>
                </li>

                <li className="nav-link">
                  <a href="#">
                    <i className="bx bxs-car-mechanic icon"></i>
                    <span className="text nav-text">Analytics</span>
                  </a>
                </li>

                <li className="nav-link">
                  <a href="#">
                    <i className="bx bxs-car-wash icon"></i>
                    <span className="text nav-text">Likes</span>
                  </a>
                </li>

                <li className="nav-link">
                  <a href="#">
                    <i className="bx bxs-car-battery icon"></i>
                    <span
                      className="text nav-text"
                      onClick={() => auth.signOut()}
                    >
                      Wallets
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="bottom-content">
              <li className="">
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

                <div
                  className="toggle-switch "
                  onClick={() => {
                    darkModeToggle(darkMode);
                  }}
                >
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
            {" "}
            Babel{" "}
            <div
              style={{
                position: "absolute",
                display: "flex",
                color: "black",
                width: "auto",
                top: "1vh",
                right: "0px",
              }}
            >
              <p style={{ fontSize: "3vw" }}>Bonjour : {auth.currentUser.displayName}</p>

              <Image
                width={50}
                height={50}
                src={photoProfil}
                alt="photo profil"
              ></Image>
            </div>
          </div>
          {rubrique == "Parc" && <TakePicture />}
          {rubrique == "ParcSav" && <ParcSav />}
        </section>
      </div>
    </>
  );
}
