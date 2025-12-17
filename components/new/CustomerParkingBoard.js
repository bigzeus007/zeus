import React, { useMemo } from "react";
import styles from "../../styles/Parking.module.css";
import CarCardParkingCustomer from "./carCardParkingCustomer";

/**
 * cars = liste depuis Firestore parkingCustomer
 * onSelectSlot(placeOrCar) :
 *   - si place vide => { place: 12 }
 *   - si occupé => doc complet (car)
 */
export default function CustomerParkingBoard({ cars = [], onSelectSlot }) {
  const carsByPlace = useMemo(() => {
    const map = new Map();
    cars.forEach((c) => {
      if (typeof c?.place === "number") map.set(c.place, c);
    });
    return map;
  }, [cars]);

  const zone1 = useMemo(() => Array.from({ length: 10 }, (_, i) => 11 + i), []);
  const zone2 = useMemo(() => Array.from({ length: 7 }, (_, i) => 21 + i), []);
  const zone3 = useMemo(() => Array.from({ length: 6 }, (_, i) => 28 + i), []);

  const renderZone = (places) =>
    places.map((p) => (
      <CarCardParkingCustomer
        key={p}
        placeNumber={p}
        myContent={carsByPlace.get(p) || null}
        onSelect={onSelectSlot}
      />
    ));

  return (
    <div className={styles.board}>
      <div className={`${styles.zone} ${styles.zone1}`}>
        <div className={styles.zoneTitleRow}>
          <div className={styles.zoneTitle}>Zone 1</div>
          <div className={styles.zoneRange}>11 → 20</div>
        </div>
        <div className={styles.zoneGrid}>{renderZone(zone1)}</div>
      </div>

      <div className={`${styles.zone} ${styles.zone2}`}>
        <div className={styles.zoneTitleRow}>
          <div className={styles.zoneTitle}>Zone 2</div>
          <div className={styles.zoneRange}>21 → 27</div>
        </div>
        <div className={styles.zoneGrid}>{renderZone(zone2)}</div>
      </div>

      <div className={`${styles.zone} ${styles.zone3}`}>
        <div className={styles.zoneTitleRow}>
          <div className={styles.zoneTitle}>Zone 3</div>
          <div className={styles.zoneRange}>28 → 33</div>
        </div>
        <div className={styles.zoneGrid}>{renderZone(zone3)}</div>
      </div>

      {/* Ici tu peux remettre ta barre des CS (badges + compteur) */}
      {/* Exemple: tu l’injectes depuis le parent, ou tu la reconstruis ici */}
      {/* <div className={styles.csBar}>...</div> */}
    </div>
  );
}
