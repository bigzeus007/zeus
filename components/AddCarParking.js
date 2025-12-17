import React, { useEffect, useRef, useState } from "react";
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
  setDoc,
  serverTimestamp,
  collection,
  deleteField,
  deleteDoc,
} from "firebase/firestore";
import {
  Button,
  Text,
  Card,
  Grid,
  Radio,
  Loading,
  Spacer,
  Avatar,
} from "@nextui-org/react";
import MiniBadge from "./MiniBadge";

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
  const inputRef = useRef(null);

  const [hasPhoto, setHasPhoto] = useState(false);
  const [laboZone, setLaboZone] = useState(false);
  const [image, setImage] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(false);

  const [rdv, setRdv] = useState(false);
  const [washing, setWashing] = useState(false);

  const [confirm, setConfirnm] = useState(0);
  const [loading, setLoading] = useState(0);

  const userName = auth?.currentUser?.displayName || "Unknown";
  const workingDate = new Date().toISOString().substring(0, 10);

  const carsCollectionRef = collection(db, "parkingCustomer");

  const emptyInput = () => {
    if (inputRef.current) inputRef.current.value = "";
  };

  const stopStreamedVideo = () => {
    const video = videoRef.current;
    if (video?.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach((t) => t.stop());
      video.srcObject = null;
    }
    setPlayingVideo(false);
  };

  const getVideo = async () => {
    const constraints = { audio: false, video: { facingMode: "environment" } };
    try {
      const video = videoRef.current;
      if (!video) return;

      // évite doublon
      if (video.srcObject) return;

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
      await video.play();
      setPlayingVideo(true);
    } catch (err) {
      console.error(err);
      setPlayingVideo(false);
    }
  };

  const takePhoto = () => {
    if (!photoRef.current || !videoRef.current || !playingVideo) return;

    const width = 250;
    const height = 480;

    const canvas = photoRef.current;
    const video = videoRef.current;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageCaptured = canvas.toDataURL("image/jpeg", 0.1);
    setImage(imageCaptured);

    emptyInput(); // ✅ exécuter
    setHasPhoto(true);
    stopStreamedVideo();
  };

  const closePhoto = () => {
    const canvas = photoRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    stopStreamedVideo(); // ✅ clean caméra aussi

    setHasPhoto(false);
    setLaboZone(false);
    setCsSelected(false);
    setWashing(false);
    setRdv(false);
    setEditMode(0);
    setLoading(0);
  };

  useEffect(() => {
    if (laboZone) getVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [laboZone]);

  const submitMyCarPhoto = async (photo, photoId) => {
    const storageRef = ref(storage, `parkingCustomer/${photoId}`);
    await uploadString(storageRef, photo, "data_url");
    const url = await getDownloadURL(storageRef);

    await setDoc(
      doc(db, "parkingCustomer", photoId),
      { imageUrl: url },
      { merge: true }
    );
    closePhoto();
  };

  const freePlace = async (car) => {
    try {
      const carRef = doc(db, "parkingCustomer", `${car.id}`);
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

      try {
        await deleteObject(imageCarRef);
      } catch (e) {
        // si fichier absent, on ignore
      }

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
      const washingDashboardRef = doc(db, "washingDashboard", `${car.date}`);
      const washingDashboardDoc = await getDoc(washingDashboardRef);

      if (washingDashboardDoc.exists()) {
        const data = washingDashboardDoc.data();
        const annuler = (data?.annuler || 0) + 1;

        await setDoc(washingDashboardRef, { annuler }, { merge: true });
      }

      await setDoc(carRef, { basy: false, lavage: "annuler" }, { merge: true });

      setEditMode(0);
      setLoading(0);
      setConfirnm(0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (photoDataUrl, basyValue, lavageValue) => {
    try {
      const docRef = await addDoc(carsCollectionRef, {
        createdAt: serverTimestamp(),
        time: new Date().toISOString().substring(0, 16),
        date: workingDate,
        place,
        rdv,
        lavage: lavageValue,
        basy: basyValue,
        csSelected,
        note: "Vide",
        placeStatus: true,
        carStory: [{ qui: userName, quoi: "MAJ place", quand: workingDate }],
      });

      await submitMyCarPhoto(photoDataUrl, docRef.id);

      await setDoc(
        doc(db, "parkingCustomer", docRef.id),
        { id: docRef.id },
        { merge: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleWashing = async (car) => {
    try {
      const washingDashboardRef = doc(db, "washingDashboard", `${workingDate}`);
      const washingDashboardDoc = await getDoc(washingDashboardRef);

      const data = washingDashboardDoc.exists()
        ? washingDashboardDoc.data()
        : { complet: 0, simple: 0, annuler: 0 };

      const carType =
        car.lavage === "complet"
          ? "complet"
          : car.lavage === "simple"
          ? "simple"
          : "annuler";

      const washingCount = Number((data?.[carType] || 0) + 1);

      await setDoc(
        washingDashboardRef,
        { ...data, [carType]: washingCount },
        { merge: true }
      );

      const carRef = doc(db, "parkingCustomer", `${car.id}`);
      await setDoc(carRef, { basy: false }, { merge: true });

      setEditMode(0);
      setLoading(0);
    } catch (error) {
      console.log(error);
    }
  };

  const takePictureSwitch = hasPhoto ? "flex" : "none";

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
          <MiniBadge size="xl" color="primary" content={`P : ${place}`}>
            <Grid>
              <canvas
                style={{
                  display: `${takePictureSwitch}`,
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
          </MiniBadge>

          {csSelected && (
            <Grid>
              {washing ? (
                <Grid>
                  <Button
                    auto
                    shadow
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
                      handleSubmit(image, true, "complet");
                    }}
                  >
                    {loading === 0 ? (
                      <Text>Complet</Text>
                    ) : (
                      <Loading size="xl" />
                    )}
                  </Button>

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
                      setLoading(1);
                      handleSubmit(image, true, "simple");
                    }}
                  >
                    {loading === 0 ? (
                      <Text>Simple</Text>
                    ) : (
                      <Loading size="xl" />
                    )}
                  </Button>

                  <Button
                    auto
                    color="warning"
                    css={{
                      height: "10vh",
                      width: "20vw",
                      maxWidth: "200px",
                      minWidth: "70px",
                      borderRadius: "100%",
                    }}
                    onPress={() => {
                      setLoading(1);
                      handleSubmit(image, false, "sans");
                    }}
                  >
                    {loading === 0 ? <Text>Sans</Text> : <Loading size="xl" />}
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
                  <Spacer y={1} />
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
                <Radio value="AZIZ" isSquared>
                  AZIZ
                </Radio>
                <Radio value="ABDELALI" isSquared>
                  ABDELALI
                </Radio>
                <Radio value="BADR" isSquared>
                  BADR
                </Radio>
                <Radio value="MOHAMMED" isSquared>
                  MOHAMMED
                </Radio>
                <Radio value="MALAK" isSquared>
                  MALAK
                </Radio>
                <Radio value="ND" isSquared>
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
                onPress={closePhoto}
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
          borderRadius: "20%",
          display: `${hasPhoto ? "none" : "flex"}`,
        }}
      >
        <div
          onClick={takePhoto}
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
    <Grid.Container justify="center">
      {editModeCarStatus?.placeStatus ? (
        <Grid.Container justify="center" css={{ padding: "12px 0" }}>
          {/* Actions lavage si basy === true */}
          {editModeCarStatus?.basy === true && (
            <Card css={{ width: "min(920px, 96vw)", marginBottom: "12px" }}>
              <Card.Body>
                <Grid.Container
                  gap={1}
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid>
                    <Button
                      auto
                      color="warning"
                      rounded
                      size="md"
                      onPress={() => {
                        setLoading(1);
                        handleWashing(editModeCarStatus);
                      }}
                    >
                      {loading === 0 ? "Lavage terminé" : <Loading size="xs" />}
                    </Button>
                  </Grid>

                  <Grid>
                    <Button
                      auto
                      color={confirm === 0 ? "default" : "error"}
                      rounded
                      size="md"
                      onPress={() => {
                        confirm === 0
                          ? setConfirnm(1)
                          : handleCancelWashing(editModeCarStatus);
                      }}
                    >
                      {confirm === 0 ? "Annulation" : "Confirmation"}
                    </Button>
                  </Grid>
                </Grid.Container>
              </Card.Body>
            </Card>
          )}

          {/* Carte Aperçu (propre + responsive) */}
          <Card
            css={{
              width: "min(920px, 96vw)",
              backgroundColor: "transparent",
            }}
          >
            <Card.Header
              css={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Text b size={18}>
                Place {place}
              </Text>

              <Grid.Container
                gap={0.5}
                justify="flex-end"
                alignItems="center"
                css={{ width: "auto" }}
              >
                <Grid>
                  <Avatar
                    text={editModeCarStatus?.rdv === true ? "RV" : "SR"}
                    color={
                      editModeCarStatus?.rdv === true ? "success" : "warning"
                    }
                    size="sm"
                    textColor="white"
                  />
                </Grid>

                <Grid>
                  <Avatar
                    text={String(editModeCarStatus?.csSelected || "ND").slice(
                      0,
                      2
                    )}
                    color="primary"
                    size="sm"
                    textColor="white"
                  />
                </Grid>

                <Grid>
                  <Text size={12} css={{ opacity: 0.8 }}>
                    {editModeCarStatus?.time || ""}
                  </Text>
                </Grid>
              </Grid.Container>
            </Card.Header>

            <Card.Body css={{ paddingTop: 8 }}>
              {/* Image: jamais énorme, jamais hors écran */}
              <div
                style={{
                  width: "100%",
                  maxHeight: "62vh",
                  borderRadius: 18,
                  overflow: "hidden",
                  background: "rgba(255,255,255,.10)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <img
                  src={editModeCarStatus?.imageUrl}
                  alt={`Image place ${place}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    maxHeight: "62vh",
                    objectFit: "contain", // IMPORTANT : évite l'image énorme/coupée
                    display: "block",
                  }}
                />
              </div>

              {/* Infos rapides sous l'image */}
              <Grid.Container gap={0.5} css={{ marginTop: 10 }}>
                <Grid>
                  <MiniBadge color="primary" size="md" content={`P${place}`}>
                    <span />
                  </MiniBadge>
                </Grid>

                <Grid>
                  <MiniBadge
                    color="success"
                    size="md"
                    content={editModeCarStatus?.csSelected || "ND"}
                  >
                    <span />
                  </MiniBadge>
                </Grid>

                <Grid>
                  <MiniBadge
                    color={
                      editModeCarStatus?.lavage === "sans"
                        ? "default"
                        : "warning"
                    }
                    size="md"
                    content={editModeCarStatus?.lavage || "sans"}
                  >
                    <span />
                  </MiniBadge>
                </Grid>
              </Grid.Container>
            </Card.Body>

            <Card.Footer css={{ justifyContent: "space-between" }}>
              <Button
                auto
                color="success"
                rounded
                size="lg"
                onPress={() => {
                  setLoading(1);
                  freePlace(editModeCarStatus);
                }}
              >
                {loading === 0 ? `Livrer : ${place}` : <Loading size="xs" />}
              </Button>

              <Button
                rounded
                auto
                size="lg"
                onPress={() => {
                  washingArea === 2 ? setWashingArea(1) : setEditMode(0);
                }}
              >
                Fermer
              </Button>
            </Card.Footer>
          </Card>
        </Grid.Container>
      ) : (
        <Grid.Container justify="center" css={{ paddingTop: "18vh" }}>
          <Grid>
            <Button
              rounded
              color="success"
              size="xl"
              onPress={() => {
                setLaboZone(true);
              }}
            >
              Prendre photo : {place}
            </Button>
          </Grid>
          <Grid>
            <Button rounded size="xl" onPress={() => setEditMode(0)}>
              Annuler
            </Button>
          </Grid>
        </Grid.Container>
      )}
    </Grid.Container>
  );
}
