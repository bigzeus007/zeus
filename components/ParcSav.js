import React, { useEffect, useMemo, useState } from "react";
import { db, storage } from "../firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { Card, Grid, Row, Col, Text, Button } from "@nextui-org/react";
import MiniBadge from "./MiniBadge";
import CarCard from "./CarCard";

import Livrer from "./Livrer";
import Immobiliser from "./Immobiliser";
import Retour from "./Retour";
import EditCar from "./EditCar";

export default function ParcSav() {
  const [editMode, setEditMode] = useState(0);
  const [carSlected, setCarSelected] = useState({});

  const list = [
    {
      ass: "2023-02-11",
      carStory: "",
      createdAt: "",
      id: "2A5EqufmXx9NX99qm8wV",
      km: "56.74086.",
      marque: "SKODA",
      mec: "2023-02-10",
      vin: "fgaafga",
    },
  ];

  const parcListRef = useMemo(() => collection(db, "cars"), []);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    getDocs(parcListRef)
      .then((querySnapshot) => {
        const carsData = [];
        querySnapshot.forEach((doc) => {
          carsData.push(doc.data());
        });
        setCars(carsData);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [parcListRef]);

  return editMode == 0 ? (
    <Grid.Container gap={1} justify="flex-start">
      {cars.map((item, index) => (
        <Grid xs={6} sm={3} key={index}>
          <Card
            isPressable
            onPress={() => {
              setCarSelected(item);
              setEditMode(item.availability ? "Livrer" : "Retour");
            }}
            css={{ backgroundImage: `${item.carImage}` }}
          >
            <Card.Header
              css={{ position: "absolute", justifyItems: "flex-start" }}
            >
              <Row justify="space-between" align="center">
                <Text
                  css={{
                    display: "flex",
                    color: "white",
                    fontWeight: "$semibold",
                    fontSize: "$sm",
                  }}
                  b
                >
                  {item.marque}
                </Text>

                <Text
                  css={{
                    display: "flex",
                    color: "white",
                    fontWeight: "$semibold",
                    fontSize: "$sm",
                  }}
                >
                  {item.service}
                </Text>
              </Row>
            </Card.Header>

            <CarCard props={item} />

            <Card.Footer
              css={{
                justifyItems: "flex-start",
                position: "absolute",
                bottom: "0px",
              }}
            >
              <Row wrap="wrap" justify="space-between" align="center">
                <Text color="white" b>
                  {item.model}
                </Text>

                <Text color="white" b>
                  {item.km + "km"}
                </Text>
              </Row>
            </Card.Footer>
          </Card>
        </Grid>
      ))}
    </Grid.Container>
  ) : (
    <Grid.Container justify="center">
      <EditCar car={carSlected} setEditMode={setEditMode}></EditCar>
    </Grid.Container>
  );
}
