import React from "react";
import MiniBadge from "./MiniBadge";

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

export default function ParkingSlot({ num, car, onClick }) {
  const isEmpty = !car?.placeStatus;
  const csColor = csBadgeColor(car?.csSelected);

  const rdvBadge = car?.rdv === "ND" ? "" : car?.rdv === true ? "R" : "S";

  const rdvColor = car?.rdv === true ? "success" : "error";

  // Lavage badge (haut droite)
  const lavageHidden = car?.lavage === "sans" || car?.lavage === "ND";
  const lavageText =
    car?.lavage === "annuler" ? "X" : car?.basy === false ? "lavé" : "";

  const lavageColor =
    car?.basy === true
      ? "warning"
      : car?.lavage === "annuler"
      ? "error"
      : "success";

  const lavageVariant = car?.basy === true ? "points" : "solid";

  return (
    <div className="slotWrap" onClick={onClick} role="button" tabIndex={0}>
      {/* Badge RDV/Sans RDV (bas centre) */}
      <MiniBadge
        content={rdvBadge}
        color={rdvBadge ? rdvColor : "default"}
        size="xs"
        isSquared
        placement="bottom-left"
        horizontalOffset="50%"
        verticalOffset="88%"
        css={{ display: rdvBadge ? "flex" : "none" }}
      >
        {/* Badge lavage (haut droite) */}
        <MiniBadge
          content={lavageText}
          color={lavageColor}
          variant={lavageVariant}
          size="xs"
          isSquared
          placement="top-right"
          horizontalOffset="92%"
          verticalOffset="10%"
          css={{ display: lavageHidden ? "none" : "flex" }}
        >
          {/* Carte slot */}
          <div className={`slot ${isEmpty ? "slotEmpty" : "slotFull"}`}>
            {/* Num + CS color (petit cercle en haut gauche) */}
            <div className="slotNum" style={{ backgroundColor: csColor }}>
              {num}
            </div>

            {/* Image ou placeholder */}
            {isEmpty ? (
              <div className="slotPlaceholder">
                <span className="slotPlus">＋</span>
              </div>
            ) : (
              <img
                className="slotImg"
                src={car?.imageUrl || ""}
                alt={`Place ${num}`}
                onError={(e) => {
                  // fallback si URL cassée
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
        </MiniBadge>
      </MiniBadge>
    </div>
  );
}
