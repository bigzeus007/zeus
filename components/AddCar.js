import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { db,storage } from "../firebase";
import { ref, uploadString } from "firebase/storage";
import {
  doc,
  addDoc,
  setDoc,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import { TakePitureButton } from "../styles/TakePitureButton.styled";
import NewButtonColored from "../styles/NewButtonColored.styled";
import {
  CarCsSelection,
  CarInfos,

} from "../styles/ChooseRdvStatus.style";

export default function TakePicture() {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [laboZone, setLaboZone] = useState(false);
  const [image, setImage] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const inputRef = useRef(null);

 const [vin, setVin]=useState("")
 const [marque, setMarque]=useState("")
 const [km, setKm]=useState("")
 const [model, setModel]=useState("")
 const [mec, setMec]=useState("")
 const [ass, setAss]=useState("")
 const [service, setService]=useState("")

  

  const submitMyCarPhot = (photo, photoId) => {
    const storageRef = ref(storage, `cars/${photoId}`);
    uploadString(storageRef, photo, "data_url").then(closePhoto);
  };


  const getVideo = () => {
    const constraints = {
      audio: false,
      video: {
        facingMode: "environment",
      },
    };

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
  };

  const emptyInput = () => {
    let myInput = inputRef.current;
    myInput.value = null;
    
  };

  // STOP CAMERA

  const stopStreamedVideo = (videoElem) => {
    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(function(track) {
      track.stop();
    });

    videoElem.srcObject = null;
  };

  const takePhoto = () => {
    const picTime = Date.now(); // old one = new Date()
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
    setCreatedAt(picTime);
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

  const handleSubmit = async (image) => {
    const docRef = await addDoc(collection(db, "cars"), {
   
      createdAt: serverTimestamp(),
  
      whereIsTheCar: "Parking-E",

      isItInGoodPlace: true,
      basyCar: false,


      workingTeam: ["CRV", "CA", "Pisteur"],
      carStory: [
        {
          who: "Pisteur",
          when: new Date().toISOString().substring(0, 16),
          what: "CarAdded",
        },
      ],

      historyComments: [{ initiator: "", time: "", text: "" }],
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
          <input
            className="customerName"
            ref={inputRef}
            type="text"
            onChange={(e) => {}}
            placeholder="NOM CLIENT"
          ></input>
          <div className="rdvSet">
            <button className="SRDV" onClick={() => handlReturn()}>
              SANS RDV
            </button>
            <button className="RDV" onClick={() => {}}>
              AVEC RDV
            </button>
          </div>

          <CarCsSelection>
            <input
              className="rdvTime"
              type="time"
              onChange={(e) => setRdvTime(e.target.value)}
              value={""}
            ></input>
            <br />
           
          </CarCsSelection>

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
