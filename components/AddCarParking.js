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
  getDoc,
  updateDoc,
  doc,
  addDoc,
  onSnapshot,
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
  Avatar,
} from "@nextui-org/react";

export default function AddCarParking({
  washingDashboardData,
  setWashingDashboardData,
  setWashingArea,
  washingArea,
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
  const [basy, setBasy] = useState(false);
  const [rdv, setRdv] = useState(false);
  const [washing, setWashing] = useState(false);
  const inputRef = useRef(null);
  const [confirm, setConfirnm] = useState(0);

  const [loading, setLoading] = useState(0);

  const userName = auth.currentUser ? auth.currentUser.displayName : "Unknown";

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

      const imageCaptured = photo.toDataURL("image/jpeg", 0.1);

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
  const lavageCollectionRef = collection(db, "lavage");

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
  
 
  

 
  
  const handleCancelWashing = async (car) => {
    try {
      const carRef = doc(db, "parkingCustomer", `${car.id}`);
      
      const washingDashboardSubcollectionRef = doc(db, "washingDashboard",`${car.date}`);
      
      const washingDashboardDoc = await getDoc(washingDashboardSubcollectionRef);
  
      if (washingDashboardDoc.exists()) {
        const washingDashboardData = washingDashboardDoc.data();
    
        let annuler = washingDashboardData.annuler?washingDashboardData.annuler:0;
        annuler++;
        
        await setDoc(washingDashboardSubcollectionRef, {
          annuler: annuler,
        },{merge:true});
      } else {
        // You can create a new document with annuler set to 1 if it doesn't exist
        console.log("washingDashboardDoc doesnt exist");
       
      }
      
      await setDoc(carRef, {
        basy: false, 
        lavage: "annuler",
      },{merge:true});
  
      setEditMode(0);
      setLoading(0);
      setConfirnm(0)
    } catch (error) {
      console.log(error);
    }
  };
  




  

  const workingDate = new Date().toISOString().substring(0, 10);
  const handleSubmit = async (image, bS, lvg) => {
    try {
      const docRef = await addDoc(carsCollectionRef, {
        createdAt: serverTimestamp(),
        time: new Date().toISOString().substring(0, 16),
        date: workingDate,
        
        place: place,
        rdv: rdv,
        lavage: lvg,
        basy: bS,
        csSelected: csSelected,
        note: "Vide",
        placeStatus: true,
        carStory: [
          {
            qui: userName,
            quoi: "MAJ place",
            quand: workingDate,
          },
        ],
      });
  
      await submitMyCarPhoto(image, docRef.id);
  
      await setDoc(doc(db, "parkingCustomer", docRef.id), {
        id: docRef.id,
      }, {
        merge: true
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleWashing = async (car) => {
    const washingDashboardRef = doc(db, "washingDashboard", `${workingDate}`);
      const washingDashboardDoc = await getDoc(washingDashboardRef);
   
      try {
      
      let washingDashboardData = washingDashboardDoc.exists() ? washingDashboardDoc.data() : {
        complet: 0,
        simple: 0,
        annuler: 0,
      };
  
      const carType = car.lavage == 'complet' ? 'complet' : car.lavage == 'simple' ? 'simple' : 'annuler';
      const washingCount = Number(washingDashboardData[carType] + 1);
  
      await setDoc(washingDashboardRef, {
        ...washingDashboardData,
        [carType]: washingCount,
      }, {
        merge: true,
      });
    
      const carRef = doc(db, "parkingCustomer", `${car.id}`);
      await setDoc(carRef, {
        basy: false,
      }, {
        merge: true,
      });
  
      setEditMode(0);
      setLoading(0);
    } catch (error) {
      console.log(error);
      
     
    }
  };
  return laboZone ? (
    <Grid.Container justify="center">
      <Card
        css={{
          display: `${hasPhoto ? "flex" : "none"}`,
          width: "100vw",
          maxWidth: "600px",
          backgroundColor: "transparent",
        }}
      >
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
              {washing ? (
                <Grid>
                  <Button
                    auto
                    shadow={true}
                    color="gradient"
                    css={{
                      height: "10vh",
                      width: "20vw",
                      maxWidth: "200px",
                      minWidth: "70px",
                      borderRadius: "100%",
                    }}
                    onPress={() => {
                      
                      setLoading(1);
                      
                      handleSubmit(image, true,"complet");
                    }}
                  >
                    {loading == 0 ? <Text>Complet</Text> : <Loading size="xl" />}
                  </Button>
                  <Button
                auto
                color="success"
                css={{height:"10vh",width:"20vw",maxWidth:"200px",minWidth:"70px",borderRadius:"100%"}}
                onPress={() => {
                  
                  setLoading(1);
                  
                  handleSubmit(image, true,"simple");
                }}
              >
                {loading == 0 ? (
                  <Text >Simple</Text>
                ) : (
                  <Loading size="xl" />
                )}
              </Button>
              <Button
                auto
                color="warning"
                css={{height:"10vh",width:"20vw",maxWidth:"200px",minWidth:"70px",borderRadius:"100%"}}
                onPress={() => {
                
                  setLoading(1);
                 
                  handleSubmit(image, false,"sans");
                }}
              >
                {loading == 0 ? (
                  <Text >Sans</Text>
                ) : (
                  <Loading size="xl" />
                )}
              </Button>
                </Grid>
              ) : (
                <Grid>
                  <Button
                    auto
                    color="success"
                    css={{
                      height: "10vh",
                      width: "20vw",
                      maxWidth: "200px",
                      minWidth: "70px",
                      borderRadius: "100%",
                    }}
                    onPress={() => {
                      setRdv(true);
                      setWashing(true);
                    }}
                  >
                    RDV
                  </Button>
                  <Spacer y={1}></Spacer>
                  <Button
                    color="secondary"
                    auto
                    css={{
                      height: "10vh",
                      width: "20vw",
                      maxWidth: "200px",
                      minWidth: "70px",
                      borderRadius: "100%",
                    }}
                    onPress={() => {
                      setRdv(false);
                      setWashing(true);
                    }}
                  >
                    SANS RDV
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </Card.Header>
        <Card.Body>
          {!csSelected && (
            <Grid.Container justify="center">
              <Radio.Group
                css={{ fontSize: "22px" }}
                label="Conseillers de service"
                onChange={(e) => setCsSelected(e)}
                defaultValue={false}
              >
                <Radio value="AZIZ" css={{ size: "10px" }} isSquared>
                  AZIZ
                </Radio>
                <Radio value="ABDELALI" css={{ size: "10px" }} isSquared>
                  ABDELALI
                </Radio>
                <Radio value="BADR" css={{ size: "10px" }} isSquared>
                  BADR
                </Radio>
                <Radio value="MOHAMMED" css={{ size: "10px" }} isSquared>
                  MOHAMMED
                </Radio>
                <Radio value="ND" css={{ size: "10px" }} isSquared>
                  ND
                </Radio>
              </Radio.Group>
            </Grid.Container>
          )}
        </Card.Body>
        <Card.Footer>
          <Grid.Container gap={1} justify="space-evenly">
            <Grid>
              <Button
                css={{ width: "25vw" }}
                color="primary"
                onPress={() => {
                  closePhoto();
                }}
              >
                Annuler
              </Button>
            </Grid>

            
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
            {editModeCarStatus.basy == true && (
                <Card.Header >
                  <Grid.Container gap={1} justify="space-evenly">
                  <Button
                    auto
                    color="warning"
                    rounded
                   
                    size={"md"}
                    onPress={() => {
                      setLoading(1);
                      handleWashing(editModeCarStatus);
                    }}
                  >
                    {loading == 0 ? "Lavage terminé" : <Loading size="xs" />}
                  </Button>
                  <Spacer y={1}></Spacer>
                  <Button
                    auto
                    color={confirm==0?"":"error"}
                    rounded
                   
                    size={"md"}
                    onPress={() => {confirm==0?setConfirnm(1):handleCancelWashing(editModeCarStatus)
                      
                      
                    }}
                  >
                    {confirm==0? loading == 0 ? "Annulation" : <Loading size="xs" />:"Confirmation"}
                  </Button>
                  </Grid.Container>
                </Card.Header>
              )}
            <Card
              css={{
                width: "70vw",
                height: "40vh",
                maxWidth: "600px",
                justifyContent: "center",
                backgroundColor: "transparent",
              }}
            >
              

              <Card.Body
                css={{
                  backgroundColor: "transparent",
                  justifyContent: "center",
                  borderRadius: "22%",
                }}
              >
                <Grid>
        <Avatar 
          text={editModeCarStatus.rdv==true?"RV":"SR"}
          color={editModeCarStatus.rdv==true?"success":"warning"}
          css={{position:"absolute",top:"50%"}}
          size="md"
          textColor="white" />
      </Grid>
                <Badge
                  enableShadow
                  disableOutline
                  color="secondary"
                  horizontalOffset="45%"
                  verticalOffset="80%"
                  size="xl"
                  content={editModeCarStatus.time}
                >
                 
                    <Badge
                    enableShadow
                    disableOutline
                    color="primary"
                    horizontalOffset="85%"
                    verticalOffset="10%"
                    size="xl"
                    content={place}
                  >
                    <Badge
                      enableShadow
                      disableOutline
                      color="success"
                      horizontalOffset="10%"
                      verticalOffset="10%"
                      size="lg"
                      content={editModeCarStatus.csSelected}
                    >
                      <Badge
                      enableShadow
                      disableOutline
                      color="success"
                      horizontalOffset="50%"
                      verticalOffset="10%"
                      size="lg"
                      content={editModeCarStatus.lavage}
                    >

                      <Grid.Container
                        css={{
                          width: "70vw",
                          maxWidth: "550px",
                         
                          
                        }}
                      >
                        <Card.Image
                          width="100%"
                          height="40vh"
                          css={{ maxWidth: "580px", borderRadius: "100%" }}
                          src={`${editModeCarStatus.imageUrl}`}
                          alt={`Image of car in place ${place}`}
                          objectFit="cover"
                        />
                      </Grid.Container>
                    </Badge>
                    </Badge>
                  </Badge>
                  </Badge>
                
              </Card.Body>
                      
            </Card>
            <Grid.Container gap={1}  justify="center" > 
                      
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
              <Spacer y={2}></Spacer>
              <Button
                rounded
                auto
               
                size={"xl"}
                onPress={() => {
                  washingArea==2?setWashingArea(1):setEditMode(0); ;
                }}
              >
                Annuler
              </Button>
             
              </Grid.Container> 
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
