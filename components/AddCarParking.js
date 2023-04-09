import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { db, storage, auth } from "../firebase";
import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import {
  updateDoc,
  doc,
  addDoc,
  setDoc,
  serverTimestamp,
  collection,
  deleteField,
  deleteDoc,
} from "firebase/firestore";
import {
  Button,
  Image,
  Text,
  Card,
  Container,
  Grid,
  Input,
  Radio,
  Loading,
  Spacer,
  Badge,
} from "@nextui-org/react";

export default function AddCarParking({
  place,
  setEditMode,
  editModeCarStatus,
}) {
  const [csSelected, setCsSelected] = useState(false);
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [laboZone, setLaboZone] = useState(false);
  const [image, setImage] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [lavage, setLavage] = useState(false);
  const [basy, setBasy] = useState("");

  const inputRef = useRef(null);

  const [loading, setLoading] = useState(0);

  const userName = auth.currentUser.displayName;

  const submitMyCarPhoto = async (photo, photoId) => {
    try {
      const storageRef = ref(storage, `parkingCustomer/${photoId}`);

      // Upload the photo to the storage reference
      await uploadString(storageRef, photo, "data_url");

      // Get the download URL of the uploaded photo
      const url = await getDownloadURL(storageRef);

      // Update the Firestore document with the image URL
      await setDoc(
        doc(db, "parkingCustomer", photoId),
        { imageUrl: url },
        { merge: true }
      );

      // Close the photo here or do something else
      closePhoto();
    } catch (error) {
      console.log(error);
      // handle the error here
    }
  };

  const getVideo = async () => {
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

      emptyInput;
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
    setCsSelected(false);
    setEditMode(0);
    setLoading(0);
  };
  useEffect(() => {
    if (laboZone) {
      getVideo();
    }
  }, [videoRef, laboZone]);

  const [carStatus, setCarStatus] = useState("none");
  const takePictureSwitch = hasPhoto ? "flex" : "none";

  const carsCollectionRef = collection(db, "parkingCustomer");

  const freePlace = async (car) => {
    try {
      const carRef = doc(db, "parkingCustomer", `${car.id}`);
      // Create a reference to the file to delete
      const imageCarRef = ref(storage, `parkingCustomer/${car.id}`);

      await updateDoc(carRef, {
        createdAt: deleteField(),
        place: deleteField(),
        basy: deleteField(),
        csSelected: deleteField(),
        note: deleteField(),
        placeStatus: deleteField(),
        lavage: deleteField(),
        carStory: deleteField(),
        imageUrl: deleteField(),
        id: deleteField(),
      });
      await deleteDoc(carRef);

      // Delete the file
      await deleteObject(imageCarRef);
      console.log("File deleted successfully");

      setLaboZone(false);
      setCsSelected(false);
      setEditMode(0);
      setLoading(0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleWasing = async (car) => {
    try {
      const carRef = doc(db, "parkingCustomer", `${car.id}`);
  

      await updateDoc(carRef, {
        
        basy: false,
       
        
        lavage: true,
       
      });
     
      
      setEditMode(0);
      setLoading(0);
    } catch (error) {
      console.log(error);
    }
  };


  const handleSubmit = async (image,bS) => {
    const docRef = await addDoc(carsCollectionRef, {
      createdAt: serverTimestamp(),
      time: new Date().toISOString().substring(0, 16),
      place: place,
      lavage: false,
      basy:bS,
      

      csSelected: csSelected,
      note: "Vide",

      placeStatus: true,

      carStory: [
        {
          qui: userName,
          quoi: "MAJ place",
          quand: new Date().toISOString().substring(0, 16),
        },
      ],
    });
    await submitMyCarPhoto(image, docRef.id);
    

    await setDoc(
      doc(db, "parkingCustomer", docRef.id),
      {
        id: docRef.id,
        
      },
      { merge: true }
    );
  };

 

  return laboZone ? (
    <Grid.Container>
      <Card css={{ display: `${hasPhoto ? "flex" : "none"}` }}>
        <Card.Header css={{ justifyContent: "space-around" }}>
          <Badge size="xl" color="primary" content={`P : ${place}`}>
            <Grid>
              <canvas
                style={{
                  display: `${takePictureSwitch}`,
                  // margin: "auto",
                  width: "25vw",
                  height: "30vh",
                  minWidth: "190px",
                }}
                ref={photoRef}
              />
              <Button
                css={{ width: "stretch" }}
                onPress={() => setCsSelected(false)}
              >
                {csSelected ? csSelected : "Conseiller"}
              </Button>
            </Grid>
          </Badge>
          {csSelected && (
            <Grid>
              <Button
                size=""
                css={{ borderRadius: "100%" }}
                onPress={() => {
                  setBasy(true);
                  setLoading(1);
                  handleSubmit(image,!basy);
                }}
              >
                {loading == 0 ? (
                  <Image
                    objectFit="fill"
                    height="100px"
                    src={
                      "https://firebasestorage.googleapis.com/v0/b/terminal00.appspot.com/o/parkingCustomer%2Flavage.jpg?alt=media&token=97009272-d998-4067-9b1e-d0e2c294d3ca"
                    }
                  ></Image>
                ) : (
                  <Loading size="xl" />
                )}
              </Button>
            </Grid>
          )}
        </Card.Header>
        <Card.Body>
          {!csSelected && (
            <Grid.Container justify="center">
              <Radio.Group
                label="Conseillers de service"
                onChange={(e) => setCsSelected(e)}
                defaultValue={false}
              >
                <Radio size="sm" value="AZIZ" isSquared>
                  AZIZ
                </Radio>
                <Radio value="ABDELALI" size="sm" isSquared>
                  ABDELALI
                </Radio>
                <Radio size="sm" value="BADR" isSquared>
                  BADR
                </Radio>
                <Radio value="MOHAMMED" size="sm" isSquared>
                  MOHAMMED
                </Radio>
                <Radio value="ND" size="sm" isSquared>
                  ND
                </Radio>
              </Radio.Group>
            </Grid.Container>
          )}
        </Card.Body>
        <Card.Footer>
          <Grid.Container wrap="wrap" justify="center">
            <Button
              css={{ width: "25vw" }}
              color="primary"
              onPress={() => {
                closePhoto();
              }}
            >
              Annuler
            </Button>
            <Spacer y={1} x={2}></Spacer>

            {csSelected && (
              <Button
                css={{ width: "25vw" }}
                color="success"
                onPress={() => {
                  setLoading(1);
                  handleSubmit(image,basy);
                }}
              >
                {loading == 0 ? "Véhicule Prêt" : <Loading size="xs" />}
              </Button>
            )}
          </Grid.Container>
        </Card.Footer>
      </Card>

      <div
        id="laboZone"
        style={{
          display: "flex",
          borderRadius: "20%",
          display: `${hasPhoto ? "none" : "flex"}`,
        }}
      >
        <div
          onClick={() => takePhoto()}
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
    <>
      <Grid.Container justify="center">
        {(editModeCarStatus.placeStatus && (
          <Grid.Container justify="center">
            <Card  css={{ width:"80vw",height:"80vh",maxWidth:"600px",justifyContent:"center",backgroundColor:"transparent", }}>
              {editModeCarStatus.basy==true&&<Card.Header>
              <Button
                auto
                color="warning"
                rounded
                css={{width:"100%"}}
                size={"xl"}
                onPress={() => {
                  setLoading(1);
                  handleWasing(editModeCarStatus);
                }}
              >
                {loading == 0 ? "Véhicule lavé " : <Loading size="xs" />}
              </Button>
              </Card.Header>}
              
              <Card.Body css={{backgroundColor:"transparent",justifyContent:"center",borderRadius:"22%" }}>
                <Badge enableShadow disableOutline color="error" horizontalOffset="45%" verticalOffset="80%" size="xl" content={editModeCarStatus.time}>
                <Badge enableShadow disableOutline color="error" horizontalOffset="85%" verticalOffset="10%" size="xl" content={place}>
                <Badge enableShadow disableOutline color="success" horizontalOffset="10%" verticalOffset="10%" size="lg" content={editModeCarStatus.csSelected}>
                  <Grid.Container   css={{backgroundColor:"green",width:"76vw",maxWidth:"580px" }}>
                <Image
                  
                  width="100vw"
                  height="55vh"

                  css={{maxWidth:"580px"}}
                 
                  src={`${editModeCarStatus.imageUrl}`}
                  alt={`Image of car in place ${place}`}
                  objectFit=""
                  
                /></Grid.Container></Badge></Badge></Badge>
                
                
              </Card.Body>

              <Button
                auto
                color={"success"}
                rounded
                size={"xl"}
                onPress={() => {
                  setLoading(1);
                  freePlace(editModeCarStatus);
                }}
              >
                {loading == 0 ? `Livrer : ${place}` : <Loading size="xs" />}
              </Button>

              <Button
                rounded
                size={"xl"}
                onPress={() => {
                  setEditMode(0);
                }}
              >
                Annuler
              </Button>
            </Card>
          </Grid.Container>
        )) || (
          <Grid.Container
            justify="center"
            css={{ position: "absolute", top: "40vh" }}
          >
            <Grid>
              <Button
                rounded
                color={"success"}
                size={"xl"}
                onPress={() => {
                  setLaboZone(true), getVideo();
                }}
              >
                {" "}
                Prendre photo : {place}
              </Button>
            </Grid>
            <Grid>
              <Button
                rounded
                size={"xl"}
                onPress={() => {
                  setEditMode(0);
                }}
              >
                Annuler
              </Button>
            </Grid>
          </Grid.Container>
        )}
      </Grid.Container>
    </>
  );
}
