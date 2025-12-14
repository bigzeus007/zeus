import React, { useEffect, useState } from "react";
import styles from "../../styles/Parking.module.css";
import {
  Grid,
  Container,
  Image,
  Card,
  Spacer,
  Text,
  Row,
  Col,
  Button,
  Avatar,
} from "@nextui-org/react";
import MiniBadge from "../MiniBadge";
import { db, storage } from "../../firebase";
import { collection, getDocs, orderBy, onSnapshot } from "firebase/firestore";

const CarCardParkingCustomer = ({
  myContent,
  setEditMode,
  setEditModeCarStatus,
  setWashingArea,
  washingArea,
}) => {
  function csBadgeColor(key) {
    let csCovert = "";
    switch (key) {
      case "AZIZ":
        csCovert = "purple";
        break;
      case "ABDELALI":
        csCovert = "green";
        break;
      case "BADR":
        csCovert = "orange";
        break;
      case "MOHAMMED":
        csCovert = "blue";
        break;
      case "ND":
        csCovert = "red";
        break;

      default:
        csCovert = "gray";
        break;
    }
    return csCovert;
  }

  return (
    <Grid>
      <Grid>
        <Avatar
          text="jjjj"
          color={""}
          size="sm"
          textColor="white"
          css={{
            position: "absolute",
            backgroundColor: `${csBadgeColor(myContent.csSelected)}`,
          }}
        />
      </Grid>
      <MiniBadge
        content={`${
          myContent.lavage == "annuler"
            ? "X"
            : myContent.basy == false
            ? "lavé"
            : ""
        }`}
        isSquared
        color={`${
          myContent.basy == true
            ? "warning"
            : myContent.rdv == true && myContent.lavage !== "annuler"
            ? "success"
            : "error"
        }`}
        variant={`${myContent.basy == true ? "points" : ""}`}
        size="xs"
        horizontalOffset="15%"
        verticalOffset="10%"
        css={{
          display: `${myContent.lavage == "sans" ? "none" : "flex"}`,
        }}
      >
        <MiniBadge
          enableShadow
          disableOutline
          horizontalOffset="10%"
          verticalOffset="80%"
          content={`${myContent.rdv == true ? "R" : "S"}`}
          isSquared
          color={`${myContent.rdv == true ? "success" : ""}`}
          size="xs"
          css={{
            display: `${myContent.rdv == "ND" ? "none" : "flex"}`,
          }}
        >
          <Button
            css={{ backgroundColor: "red" }}
            size={1}
            onPress={() => {
              setWashingArea(2);
              setEditMode(myContent.place);
              setEditModeCarStatus(myContent);
            }}
          >
            <Image
              showSkeleton
              css={{ width: "15vw", height: "10vh" }}
              src={`${myContent.imageUrl}`}
              alt={`Image of car in place ${myContent.place}`}
              objectFit="cover"
            />
          </Button>
        </MiniBadge>
      </MiniBadge>
    </Grid>
  );
};
export default CarCardParkingCustomer;
