import React from "react";
import ReactCardFlip from "react-card-flip";
import Image from "next/image";

import { MainCarCard } from "../../../styles/MainCarCard";
import CardComponent from "../../../styles/CardComponent";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { useState } from "react";

import { initialTech } from "../flipCard/content";
import { initialCar } from "../flipCard/newContent";
import { auth } from "../../../firebase";

function MainCar({ props }, { techList = initialTech }) {
  const [carImage, setCarImage] = useState(
    "https://firebasestorage.googleapis.com/v0/b/one-touch-work.appspot.com/o/files%2Fimages%20(2).png?alt=media&token=c0ce54d8-4f47-4bd2-b997-776f8f6b65a9"
  );

  console.log(props);
  // user identification

  const storage = getStorage();
  const spaceRef = ref(storage, `cars/${props.customerName}`);

  getDownloadURL(spaceRef)
    .then((url) => setCarImage(url))
    .catch((err) =>
      setCarImage(
        "https://firebasestorage.googleapis.com/v0/b/one-touch-work.appspot.com/o/files%2Fimages%20(2).png?alt=media&token=c0ce54d8-4f47-4bd2-b997-776f8f6b65a9"
      )
    );

  const user = auth.currentUser;

  function checkProfilTech(checking) {
    return checking.email === user.email;
  }
  const userBdd = techList.find(checkProfilTech);

  // Drag and drop functions

  const [dragged, setDragged] = useState();
  const [isFlipped, setFlipped] = React.useState(false);

  function allowDrop(ev) {
    ev.preventDefault();
  }

  function drag(ev) {
    setDragged(props.id);

    ev.dataTransfer.setData("text", ev.target.id);
  }

  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    const myData = document.getElementById(data);

    //ev.target.appendChild(document.getElementById(data));
  }

  return (
    <CardComponent>
      <div className="" onDrop={(e) => drop(e)}>
        <div
          draggable="true"
          onDragStart={(e) => drag(e)}
          onDragOver={(e) => allowDrop(e)}
        >
          <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
            <MainCarCard
              className="CardFront"
              key={props.customerName}
              id={props.customerName}
              onClick={() => setFlipped((prev) => !prev)}
              onDrag={(e) => console.log(e.target.name)}
            >
              <div className="interventions">
                {props.express && (
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/one-touch-work.appspot.com/o/carServiceIcons%2FtechExpress.jpg?alt=media&token=bf4f24de-7902-4285-afe6-e3e965cf9ca8"
                    alt="alt"
                  />
                )}

                {props.diagnostic && (
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/one-touch-work.appspot.com/o/carServiceIcons%2FtechDiag.png?alt=media&token=a5bdaf9d-2345-4602-899b-0ced2aecb112"
                    alt="alt"
                  />
                )}
                {props.mecanique && (
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/one-touch-work.appspot.com/o/carServiceIcons%2FtechMecAlt.jpg?alt=media&token=0a2e1dc8-8309-4b19-841a-7582dde13481"
                    alt="alt"
                  />
                )}
                {props.carrosserie && (
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/one-touch-work.appspot.com/o/carServiceIcons%2FtechBody.png?alt=media&token=da893cc1-2903-4027-90dc-2d822e9a8c87"
                    alt="alt"
                  />
                )}
              </div>

              <Image
                alt={props.customerName}
                name={props.customerName}
                src={carImage}
                layout="fill"
                width={100}
                height={100}
                quality={10}
              />
              <div id="ventesAdd" className="ventesAdd">
                {props.pneus && (
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/one-touch-work.appspot.com/o/carServiceIcons%2FtechPneus.jpg?alt=media&token=23822ca7-c965-46cb-af3d-368b64cc97f1"
                    alt="alt"
                  />
                )}
                {props.plaquettes && (
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/one-touch-work.appspot.com/o/carServiceIcons%2Fplaquettes.png?alt=media&token=34a631ca-9487-4e38-a833-33b58616818b"
                    alt="alt"
                  />
                )}
                {props.batterie && (
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/one-touch-work.appspot.com/o/carServiceIcons%2FchargingBattery.png?alt=media&token=c5fb0fa1-5fd3-4c48-8504-5c896d7d9075"
                    alt="alt"
                  />
                )}
                {props.lavage && (
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/one-touch-work.appspot.com/o/carServiceIcons%2Flavage.jpg?alt=media&token=08d4e304-19c7-4e2e-a75d-40784c998c5b"
                    alt="alt"
                  />
                )}
              </div>
            </MainCarCard>

            <MainCarCard
              className="CardBack"
              key={props.customerName}
              id={props.customerName}
              onClick={() => setFlipped((prev) => !prev)}
            >
              <>
                {props.customerName}
                <br />

                {props.serviceAdvisor}

                <br />
                {props.rdvFixed ? "RDV" : "SANS RDV"}
                <br />
                {props.rdvFixed ? `Heure RDV :${props.rdvTimeFixed}` : null}
              </>
            </MainCarCard>
          </ReactCardFlip>
        </div>
      </div>
    </CardComponent>
  );
}

export default MainCar;
