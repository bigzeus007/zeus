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
import { Button, Card, Container, Grid, Input, Radio,Loading } from "@nextui-org/react";
import { TakePitureButton } from "../styles/TakePitureButton.styled";
import NewButtonColored from "../styles/NewButtonColored.styled";
import { MiseEnCirculation, CarInfos } from "../styles/ChooseRdvStatus.style";

export default function TakePicture() {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [laboZone, setLaboZone] = useState(false);
  const [image, setImage] = useState(null);
  const [playingVideo,setPlayingVideo]=useState(false)

  const inputRef = useRef(null);

  const [loading, setLoading]=useState(0)

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

  const getVideo = async() => {
    const constraints = {
      audio: false,
      video: {
        facingMode: "environment",
      },
    };

  
    if (videoRef.current && !videoRef.current.srcObject) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = videoRef.current;

        video.srcObject = stream;
        video.play();
        setPlayingVideo(true);
      } catch (err) {
        console.error(err);
      }
    }
     
  };

  const emptyInput = () => {
    let myInput = inputRef.current;
    myInput.value = null;
  };

  // STOP CAMERA

  const stopStreamedVideo = (video) => {

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    setPlayingVideo(false);
      
    }
    
    
  };

  const takePhoto = () => {
    if (photoRef.current && playingVideo) {
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
      
    }
    
  };

  const closePhoto = () => {
    let photo = photoRef.current;

    let ctx = photo.getContext("2d");
    ctx.clearRect(0, 0, photo.width, photo.height);

    setHasPhoto(false);
    setLaboZone(false);
    setLoading(0);
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
      availability:true,
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
    <Grid.Container css={{position:"relative",}}>
      
      <Card css={{display: `${hasPhoto ? "flex" : "none"}`,}} >
        <Card.Header>
        <canvas
          style={{
            display: `${takePictureSwitch}`,
            // margin: "auto",
            width:"20vw",
            height:"20vh",
          }}
          ref={photoRef}
        />
       
       <Grid.Container >
          <Radio.Group label="Marque" onChange={(e)=>setMarque(e)} defaultValue="1">
            <Radio size="sm"
              value="AUDI"
           
              isSquared
            >
              AUDI
            </Radio>
            <Radio value="SKODA"  size="sm" isSquared>
              SKODA
            </Radio>
          </Radio.Group>
          
          <Radio.Group label="Service" onChange={(e) => setService(e)} defaultValue="1">
            <Radio
              value="Commercial"
              size="sm"
              isSquared
            >
              Commercial
            </Radio>
            <Radio value="SAV" size="sm" isSquared>
              SAV
            </Radio>
          </Radio.Group>
          </Grid.Container>
          </Card.Header>

          <Card.Body>

          <Input
            
            ref={inputRef}
            type="text"
            onChange={(e) => setModel(e.target.value)}
            placeholder="Model"
          ></Input>

          
            
            <Input label="Date Mise en circulation"
              
              type="date"
              onChange={(e) => setMec(e.target.value)}
            ></Input>
            <br />
         
          
           
            <Input
            label="Date fin assurance"
              type="date"
              onChange={(e) => setAss(e.target.value)}
            ></Input>
            <br />
          
          <Input
            className="model"
            ref={inputRef}
            type="text"
            onChange={(e) => setKm(e.target.value)}
            placeholder="Km Actuel"
          ></Input>
          <Input
            className="vin"
            ref={inputRef}
            type="text"
            onChange={(e) => setVin(e.target.value)}
            placeholder="Numero de chassis"
          ></Input>
          <Input
            className="carburant"
            ref={inputRef}
            type="number"
            onChange={(e) => setCarburant(e.target.value)}
            placeholder="carburant %"
          ></Input>
          </Card.Body>
          <Card.Footer >
            <Button color="primary" onPress={() => {
                  closePhoto();
                }} >cancel</Button>

<Button color="success" onPress={() => {setLoading(1);handleSubmit(image);}} >{loading==0? "Save" : <Loading size="xs" />}</Button>


          {/* <NewButtonColored >
            <div className="subscribe">
             
              <a
                href="#"
                onClick={() => handleSubmit(image)}
                className="btn-3d-sub"
              >
                <span>submit</span>
              </a>
              <br />
            </div>
          </NewButtonColored> */}
          </Card.Footer>
      </Card>

      <div id="laboZone" style={{ display: "flex", borderRadius: "20%",display: `${hasPhoto ? "none" : "flex"}`, }}>
        <div
          onClick={()=>takePhoto()}
          style={{
            position: "relative",
            padding: "10% 10% 20% 15%",
            height: "80vh",
            width: "70vw",
            
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
    </Grid.Container>
  ) : (
    <Grid.Container  css={{position:"relative",justifyContent:"center",top:"40%"}}>
    <Button auto rounded size={"xl"}
      onPress={() => {
        setLaboZone(true), getVideo();
      }}
    > Prendre photo
      {/* <TakePitureButton props={"Demarrer"} /> */}
    </Button>
    </Grid.Container>
  );
}
