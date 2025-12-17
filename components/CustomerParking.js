import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/Parking.module.css";
import { Text, Avatar, Modal, Button } from "@nextui-org/react";
import MiniBadge from "./MiniBadge";
import { auth, db, storage } from "../firebase";
import { collection, onSnapshot, doc } from "firebase/firestore";
import AddCarParking from "./AddCarParking";
import LavageSav from "./new/LavageSav";

// ✅ Placeholder local (ratio horizontal 16:9)
const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="g" x1="0" x2="1">
        <stop offset="0" stop-color="#4b5563" stop-opacity="0.25"/>
        <stop offset="1" stop-color="#94a3b8" stop-opacity="0.25"/>
      </linearGradient>
    </defs>
    <rect width="800" height="450" rx="34" fill="url(#g)"/>
    <g fill="none" stroke="#93c5fd" stroke-width="10" opacity="0.65">
      <rect x="160" y="110" width="300" height="180" rx="18"/>
      <path d="M185 260l65-75 70 80 55-55 85 90"/>
      <circle cx="255" cy="160" r="22"/>
      <path d="M520 135v190M455 230h190" stroke-linecap="round"/>
    </g>
  </svg>
`);

const CustomerParking = ({ user }) => {
  const [editMode, setEditMode] = useState(0);
  const [editModeCarStatus, setEditModeCarStatus] = useState(null);
  const [washingArea, setWashingArea] = useState(0);

  const [cars, setCars] = useState([]);

  const [aziz, setAziz] = useState(0);
  const [badr, setBadr] = useState(0);
  const [abdelali, setAbdelali] = useState(0);
  const [mohammed, setMohammed] = useState(0);
  const [malak, setMalak] = useState(0);
  const [nd, setNd] = useState(0);

  // Modal preview (place occupée)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewCar, setPreviewCar] = useState(null);

  const parcListRef = useMemo(() => collection(db, "parkingCustomer"), []);

  const zone1 = useMemo(() => [11, 12, 13, 14, 15, 16, 17, 18, 19, 20], []);
  const zone2 = useMemo(() => [21, 22, 23, 24, 25, 26, 27], []);
  const zone3 = useMemo(() => [28, 29, 30, 31, 32, 33], []);

  function csBadgeColor(key) {
    switch (key) {
      case "AZIZ":
        return "purple";
      case "ABDELALI":
        return "green";
      case "BADR":
        return "orange";
      case "MOHAMMED":
        return "blue";
      case "MALAK":
        return "hotpink";
      case "ND":
        return "red";
      default:
        return "gray";
    }
  }

  const emptyPlace = useMemo(
    () => ({
      place: 0,
      placeStatus: false,
      csSelected: "ND",
      rdv: "ND",
      lavage: "sans",
      basy: false,
      note: "",
      date: "",
      imageUrl: PLACEHOLDER_IMG,
      id: "",
    }),
    []
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(parcListRef, (querySnapshot) => {
      const carsData = [];
      let azizC = 0;
      let badrC = 0;
      let abdelaliC = 0;
      let mohammedC = 0;
      let malakC = 0;
      let ndC = 0;

      querySnapshot.forEach((d) => {
        const data = d.data();
        carsData.push(data);

        data.csSelected === "BADR" && badrC++;
        data.csSelected === "AZIZ" && azizC++;
        data.csSelected === "ABDELALI" && abdelaliC++;
        data.csSelected === "MOHAMMED" && mohammedC++;
        data.csSelected === "MALAK" && malakC++;
        data.csSelected === "ND" && ndC++;
      });

      setCars(carsData);
      setAziz(azizC);
      setBadr(badrC);
      setAbdelali(abdelaliC);
      setMohammed(mohammedC);
      setMalak(malakC);
      setNd(ndC);
    });

    return unsubscribe;
  }, [parcListRef]);

  const [washingDashboardData, setWashingDashboardData] = useState({
    complet: 0,
    simple: 0,
    annuler: 0,
  });

  useEffect(() => {
    const workingDate = new Date().toISOString().substring(0, 10);
    const unsubscribe = onSnapshot(
      doc(db, "washingDashboard", workingDate),
      (snap) => {
        setWashingDashboardData(
          snap.data() || { complet: 0, simple: 0, annuler: 0 }
        );
      }
    );
    return unsubscribe;
  }, []);

  function findCar(num) {
    return (
      cars.find((car) => Number(car.place) === Number(num)) || {
        ...emptyPlace,
        place: num,
      }
    );
  }

  // Badge lavage
  function lavageBadge(myContent) {
    // ✅ Jamais de badge lavage si la place est vide
    if (!myContent?.placeStatus) return { show: false };

    const lvg = (myContent?.lavage || "sans").toLowerCase();

    // ✅ "sans" ou "nd" => rien
    if (lvg === "sans" || lvg === "nd") return { show: false };

    if (lvg === "annuler" || lvg === "annulé")
      return { show: true, txt: "X", color: "error", variant: "solid" };

    // ✅ basy false => lavé
    if (myContent.basy === false)
      return { show: true, txt: "lavé", color: "success", variant: "solid" };

    // ✅ sinon => en cours (points)
    return { show: true, txt: "", color: "warning", variant: "points" };
  }

  const PlaceCard = ({ num }) => {
    const myContent = findCar(num);
    const hasCar = !!myContent?.placeStatus;

    const rdvShow = myContent.rdv !== "ND";
    const rdvIsTrue = myContent.rdv === true;

    const wash = lavageBadge(myContent);
    const imgSrc = myContent?.imageUrl ? myContent.imageUrl : PLACEHOLDER_IMG;

    const openAddOrPreview = () => {
      if (!hasCar) {
        // ✅ place vide → ajout direct
        setEditMode(num);
        setEditModeCarStatus(myContent);
        return;
      }
      // ✅ place occupée → preview (agrandir + actions)
      setPreviewCar({ ...myContent, place: num, imageUrl: imgSrc });
      setPreviewOpen(true);
    };

    return (
      <div className={styles.placeCard}>
        <div
          className={styles.placeInner}
          role="button"
          tabIndex={0}
          onClick={openAddOrPreview}
        >
          <div className={styles.photoWrap}>
            <img className={styles.photo} src={imgSrc} alt={`Place ${num}`} />
          </div>

          {/* Numéro place */}
          <div
            className={styles.badgePlace}
            style={{ backgroundColor: csBadgeColor(myContent.csSelected) }}
            title={myContent.csSelected || "ND"}
          >
            {num}
          </div>

          {/* RDV / Sans RDV */}
          {rdvShow && (
            <div
              className={`${styles.badgeRdv} ${
                rdvIsTrue ? styles.rdvOk : styles.rdvNo
              }`}
            >
              {rdvIsTrue ? "R" : "S"}
            </div>
          )}

          {/* Lavage */}
          {wash.show && (
            <div
              className={`${styles.badgeWash} ${
                wash.color === "success"
                  ? styles.wash_success
                  : wash.color === "warning"
                  ? styles.wash_warning
                  : styles.wash_error
              } ${wash.variant === "points" ? styles.washPoints : ""}`}
            >
              {wash.variant === "points" ? "" : wash.txt}
            </div>
          )}

          {/* vide: petit + */}
          {!hasCar && <div className={styles.plusHint}>+</div>}

          {/* place occupée: bouton actions "..." (optionnel mais UX top) */}
          {hasCar && (
            <button
              className={styles.moreBtn}
              onClick={(e) => {
                e.stopPropagation();
                setPreviewCar({ ...myContent, place: num, imageUrl: imgSrc });
                setPreviewOpen(true);
              }}
              title="Aperçu / actions"
            >
              +
            </button>
          )}
        </div>
      </div>
    );
  };

  const CsCounters = () => (
    <div className={styles.csBar}>
      {[
        { label: "Aziz", key: "AZIZ", color: "#7C3AED", count: aziz }, // violet
        { label: "Abd", key: "ABDELALI", color: "#16A34A", count: abdelali }, // vert
        { label: "Badr", key: "BADR", color: "#F59E0B", count: badr }, // orange
        { label: "Simo", key: "MOHAMMED", color: "#2563EB", count: mohammed }, // bleu
        { label: "Malak", key: "MALAK", color: "#EC4899", count: malak }, // rose (différent, lisible)
        { label: "ND", key: "ND", color: "#DC2626", count: nd }, // rouge
      ].map((c) => (
        <div key={c.key} className={styles.csItem}>
          <MiniBadge
            shape="rectangle"
            size="md"
            color="error"
            placement="top-right"
            content={c.count}
          >
            <MiniBadge
              shape="rectangle"
              size="md"
              color="error"
              placement="top-right"
              content={c.count}
            >
              <div
                className={styles.csCircle}
                style={{ backgroundColor: c.color }}
                title={c.key}
              >
                {c.label}
              </div>
            </MiniBadge>
          </MiniBadge>
        </div>
      ))}
    </div>
  );

  // Page “lavage”
  if (washingArea === 1) {
    return (
      <LavageSav
        cars={cars}
        setWashingArea={setWashingArea}
        setWashingDashboardData={setWashingDashboardData}
        washingDashboardData={washingDashboardData}
        setEditMode={setEditMode}
        setEditModeCarStatus={setEditModeCarStatus}
        washingArea={washingArea}
      />
    );
  }

  // Mode édition (Add / Edit)
  if (editMode !== 0) {
    return (
      <AddCarParking
        place={editMode}
        setEditMode={setEditMode}
        setWashingDashboardData={setWashingDashboardData}
        washingDashboardData={washingDashboardData}
        setWashingArea={setWashingArea}
        washingArea={washingArea}
        editModeCarStatus={editModeCarStatus}
      />
    );
  }

  return (
    <div className={styles.parkingRoot}>
      <div className={styles.parkingHeader}>
        <Text b className={styles.parkingTitle}>
          Parking Clients
        </Text>

        {user?.job === "BETA" && (
          <div className={styles.washShortcut}>
            <MiniBadge content="" variant="points" color="warning">
              <button
                className={styles.washBtn}
                onClick={() => setWashingArea(1)}
              >
                Lavage
              </button>
            </MiniBadge>
          </div>
        )}
      </div>

      <div className={styles.parkingLayout}>
        {/* LEFT: Zone1 + Zone2 + CS */}
        <div className={styles.leftCol}>
          <div className={styles.zoneBox}>
            <div className={styles.zoneHeader}>
              <span className={styles.zoneLabel}>Zone 1</span>
              <span className={styles.zoneRange}>11 → 20</span>
            </div>
            <div className={styles.zoneGrid}>
              {zone1.map((n) => (
                <PlaceCard num={n} key={n} />
              ))}
            </div>
          </div>

          <div className={styles.zoneBox}>
            <div className={styles.zoneHeader}>
              <span className={styles.zoneLabel}>Zone 2</span>
              <span className={styles.zoneRange}>21 → 27</span>
            </div>
            <div className={styles.zoneGrid}>
              {zone2.map((n) => (
                <PlaceCard num={n} key={n} />
              ))}
            </div>
          </div>

          <CsCounters />
        </div>

        {/* RIGHT: Zone3 (desktop) / en bas (mobile via CSS) */}
        <div className={styles.rightCol}>
          <div className={styles.zoneBox}>
            <div className={styles.zoneHeader}>
              <span className={styles.zoneLabel}>Zone 3</span>
              <span className={styles.zoneRange}>28 → 33</span>
            </div>
            <div className={styles.zoneGrid}>
              {zone3.map((n) => (
                <PlaceCard num={n} key={n} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal (places occupées) */}
      {/* Preview Modal (places occupées) */}
      <Modal
        closeButton
        aria-labelledby="preview-place"
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        width="900px"
        scroll
      >
        <Modal.Header>
          <Text b id="preview-place">
            Place {previewCar?.place}
          </Text>
        </Modal.Header>

        <Modal.Body css={{ padding: 0 }}>
          <div
            style={{
              maxHeight: "70vh", // 🔒 limite hauteur écran
              overflow: "auto", // scroll interne
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#f3f4f6",
            }}
          >
            <img
              src={previewCar?.imageUrl || PLACEHOLDER_IMG}
              alt="Aperçu véhicule"
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain", // 🔑 NE JAMAIS déborder
                display: "block",
              }}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            auto
            onClick={() => {
              if (!previewCar) return;
              setPreviewOpen(false);
              setEditMode(Number(previewCar.place));
              setEditModeCarStatus(previewCar);
            }}
          >
            Modifier / actions
          </Button>

          <Button auto flat onClick={() => setPreviewOpen(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerParking;
