import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { db, storage, auth } from "../firebase";
import { ref, uploadString } from "firebase/storage";
import {
  doc,
  addDoc,
  setDoc,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import { Button, Grid, Radio } from "@nextui-org/react";
import { TakePitureButton } from "../styles/TakePitureButton.styled";
import NewButtonColored from "../styles/NewButtonColored.styled";
import { MiseEnCirculation, CarInfos } from "../styles/ChooseRdvStatus.style";

export default function TakePicture() {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [laboZone, setLaboZone] = useState(false);
  const [image, setImage] = useState(null);

  const inputRef = useRef(null);

  const [vin, setVin] = useState("");
  const [marque, setMarque] = useState("");
  const [km, setKm] = useState("");
  const [model, setModel] = useState("");
  const [mec, setMec] = useState("");
  const [ass, setAss] = useState("");
  const [service, setService] = useState("");
  const userName = auth.currentUser.displayName;
  const[carburant,setCarburant]=useState(0)

  const submitMyCarPhot = (photo, photoId) => {
    const storageRef = ref(storage, `cars/${photoId}`);
    uploadString(storageRef, image, "data_url").then(() => {
      closePhoto();
    });
  };

  const getVideo = () => {
    const constraints = {
      audio: false,
      video: {
        facingMode: "environment",
      },
    };

    // Request permission from the user
    navigator.permissions.query({ name: "camera" }).then((result) => {
      if (result.state === "granted") {
        // Check if the user has granted permission

        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            var video = videoRef.current;

            video.srcObject = stream;

            video.play();
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  };

  const emptyInput = () => {
    let myInput = inputRef.current;
    myInput.value = null;
  };

  // STOP CAMERA

  const stopStreamedVideo = (videoElem) => {
    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(function (track) {
      track.stop();
    });

    videoElem.srcObject = null;
  };

  const takePhoto = () => {
    const width = 250;
    const height = 480;
    let photo = photoRef.current;
    let video = videoRef.current;
    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext("2d");
    ctx.drawImage(video, 0, 0, photo.width, photo.height);

    const imageCaptured = photo.toDataURL();

    setImage(imageCaptured);

    emptyInput();
    setHasPhoto(true);
    stopStreamedVideo(video);
  };

  const closePhoto = () => {
    let photo = photoRef.current;

    let ctx = photo.getContext("2d");
    ctx.clearRect(0, 0, photo.width, photo.height);

    setHasPhoto(false);
    setLaboZone(false);
  };
  useEffect(() => {
    if (laboZone) {
      getVideo();
    }
  }, [videoRef, laboZone]);

  const [carStatus, setCarStatus] = useState("none");
  const takePictureSwitch = hasPhoto ? "flex" : "none";

  const carsCollectionRef = collection(db, "cars");
  const handleSubmit = async (image) => {
    const docRef = await addDoc(carsCollectionRef, {
      createdAt: serverTimestamp(),

      marque: marque,
      service: service,
      model: model,
      vin: vin,
      km: km,
      ass: ass,
      mec: mec,
      availability:"Libre",
      carburant:carburant,
      carStory: [
        {
          creator: userName,
          when: new Date().toISOString().substring(0, 16),
        },
      ],
    });
    await submitMyCarPhot(image, docRef.id);
    await setDoc(
      doc(db, "cars", docRef.id),
      {
        id: docRef.id,
      },
      { merge: true }
    );
  };

  const toggleButtonColor = () => (service == "SAV" ? "error" : "secondary");

  return laboZone ? (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <CarInfos pictureTooked={takePictureSwitch}>
        <canvas
          style={{
            display: `${takePictureSwitch}`,
          }}
          ref={photoRef}
        />
        <div>
          {/* <Grid>
            <Button.Group color="gradient" ghost>
              <Button onPress={(e) => setMarque("AUDI")}>AUDI</Button>
              <Button onPress={(e) => setMarque("SKODA")}>SKODA</Button>
            </Button.Group>
          </Grid> */}
          <Radio.Group label="Marque" onChange={(e)=>setMarque(e)} defaultValue="1">
            <Radio
              value="AUDI"
           
              isSquared
            >
              AUDI
            </Radio>
            <Radio value="SKODA"  isSquared>
              SKODA
            </Radio>
          </Radio.Group>
          
          <Radio.Group label="Service" onChange={(e) => setService(e)} defaultValue="1">
            <Radio
              value="Commercial"
              
              isSquared
            >
              Commercial
            </Radio>
            <Radio value="SAV"  isSquared>
              SAV
            </Radio>
          </Radio.Group>

          {/* <Grid>
            <Button.Group >
              <Button flat onPress={(e) => setService("SAV")} color={toggleButtonColor()}>SAV</Button>
              <Button onPress={(e) => setService("Sales")} color={service=="Commercial" ? "error":"success"}>Sales</Button>
            </Button.Group>
          </Grid> */}
          {/* <div className="marque">
            <button className="audi" onClick={(e) => setMarque("AUDI")}>
              AUDI
            </button>
            <button className="skoda" onClick={(e) => setMarque("SKODA")}>
              SKODA
            </button>
            <button className="audi" onClick={(e) => setService("SAV")}>
              SAV
            </button>
            <button className="skoda" onClick={(e) => setService("COMMERCIAL")}>
              Commercial
            </button>
          </div> */}
          <input
            className="model"
            ref={inputRef}
            type="text"
            onChange={(e) => setModel(e.target.value)}
            placeholder="Model"
          ></input>

          <MiseEnCirculation>
            <div>Date NMise en circulation</div>
            <input
              className="mec"
              type="date"
              onChange={(e) => setMec(e.target.value)}
            ></input>
            <br />
          </MiseEnCirculation>
          <MiseEnCirculation>
            <div>Date fin assurance</div>
            <input
              className="mec"
              type="date"
              onChange={(e) => setAss(e.target.value)}
            ></input>
            <br />
          </MiseEnCirculation>
          <input
            className="model"
            ref={inputRef}
            type="text"
            onChange={(e) => setKm(e.target.value)}
            placeholder="Km Actuel"
          ></input>
          <input
            className="vin"
            ref={inputRef}
            type="text"
            onChange={(e) => setVin(e.target.value)}
            placeholder="Numero de chassis"
          ></input>
          <input
            className="carburant"
            ref={inputRef}
            type="number"
            onChange={(e) => setCarburant(e.target.value)}
            placeholder="carburant %"
          ></input>

          <NewButtonColored>
            <div className="subscribe">
              <a
                href="#"
                onClick={() => {
                  closePhoto();
                }}
                className="btn-3d-can"
              >
                <span>cancel</span>
              </a>
              <a
                href="#"
                onClick={() => handleSubmit(image)}
                className="btn-3d-sub"
              >
                <span>submit</span>
              </a>
              <br />
            </div>
          </NewButtonColored>
        </div>
      </CarInfos>

      <div id="laboZone" style={{ display: "flex", borderRadius: "20%" }}>
        <div
          onClick={takePhoto}
          style={{
            position: "relative",
            padding: "10% 10% 20% 15%",
            height: "80vh",
            width: "70vw",
            display: `${hasPhoto ? "none" : "flex"}`,
          }}
        >
          <video
            ref={videoRef}
            style={{
              borderRadius: "20%",
              width: "100%",
              height: "100%",
              objectFit: "fill",
            }}
          />
        </div>
      </div>
    </div>
  ) : (
    <div
      onClick={() => {
        setLaboZone(true), getVideo();
      }}
    >
      <TakePitureButton props={"Demarrer"} />
    </div>
  );
}
