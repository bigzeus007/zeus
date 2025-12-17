import React from "react";
import styles from "../../styles/Parking.module.css";
import { Button } from "@nextui-org/react";

/**
 * myContent = doc parkingCustomer (occupé)
 * placeNumber = numéro de place (même pour les slots vides)
 * onSelect = callback quand on clique (vide => prendre photo, occupé => edit)
 *
 * IMPORTANT:
 * - imageUrl peut être null (si tu as supprimé les photos) => placeholder local
 */
export default function CarCardParkingCustomer({
  myContent,
  placeNumber,
  onSelect,
}) {
  const isOccupied = !!myContent?.placeStatus;
  const rdv = myContent?.rdv === true;
  const lavage = myContent?.lavage || "sans"; // complet | simple | sans | annuler
  const basy = myContent?.basy === true; // en cours ?
  const cs = myContent?.csSelected || "ND";

  function csBadgeColor(key) {
    switch (key) {
      case "AZIZ":
        return "#7c3aed"; // purple
      case "ABDELALI":
        return "#16a34a"; // green
      case "BADR":
        return "#f59e0b"; // orange
      case "MOHAMMED":
        return "#2563eb"; // blue
        case "MALAK":
        return "#EC4899"; // hotpink
      case "ND":
        return "#dc2626"; // red
      default:
        return "#6b7280"; // gray
    }
  }

  // Lavage badge logique (tu peux ajuster)
  const lavageLabel =
    lavage === "annuler" ? "X" : basy ? "..." : lavage === "sans" ? "" : "lavé";

  const lavageClass =
    lavage === "annuler"
      ? styles.lavageCancel
      : basy
      ? styles.lavageRunning
      : lavage === "sans"
      ? ""
      : styles.lavageOk;

  const showLavageBadge =
    isOccupied && (lavage === "annuler" || basy || lavage !== "sans");

  // Placeholder SVG inline (aucune requête réseau)
  const Placeholder = () => (
    <div className={styles.slotPlaceholder}>
      <svg
        className={styles.slotPlaceholderIcon}
        viewBox="0 0 64 64"
        fill="none"
      >
        <rect
          x="8"
          y="14"
          width="40"
          height="28"
          rx="6"
          stroke="#7dd3fc"
          strokeWidth="2"
        />
        <path
          d="M16 34l9-9 7 7 7-7 9 9"
          stroke="#7dd3fc"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="24" r="3" stroke="#7dd3fc" strokeWidth="2" />
        <path
          d="M50 38v12"
          stroke="#7dd3fc"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M44 44h12"
          stroke="#7dd3fc"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );

  return (
    <div className={styles.slot}>
      {/* badge place */}
      <div
        className={styles.placeBadge}
        style={{ backgroundColor: csBadgeColor(cs) }}
        title={`CS: ${cs}`}
      >
        {placeNumber}
      </div>

      {/* petit point top-right (optionnel: ex "lavage concerné") */}
      {isOccupied && lavage !== "sans" && (
        <div className={styles.dotTopRight} />
      )}

      {/* badge lavage */}
      {showLavageBadge && (
        <div className={`${styles.lavageBadge} ${lavageClass}`}>
          {lavageLabel}
        </div>
      )}

      <Button
        className={styles.slotButton}
        onPress={() =>
          onSelect?.(isOccupied ? myContent : { place: placeNumber })
        }
      >
        {myContent?.imageUrl ? (
          <img
            className={styles.slotMedia}
            src={myContent.imageUrl}
            alt={`Place ${placeNumber}`}
          />
        ) : (
          <Placeholder />
        )}
      </Button>

      {/* barre RDV / SANS RDV */}
      {isOccupied && (
        <div
          className={`${styles.rdvBar} ${
            rdv ? styles.rdvGreen : styles.rdvRed
          }`}
        >
          {rdv ? "R" : "S"}
        </div>
      )}
    </div>
  );
}
