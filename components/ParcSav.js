import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { db, storage } from "../firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import {
  Card,
  Grid,
  Row,
  Col,
  Text,
  Button,

} from "@nextui-org/react";
import CarCard from "./CarCard";

import Livrer from "./Livrer";
import Immobiliser from "./Immobiliser";
import Retour from "./Retour";

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

  const parcListRef = collection(db, "cars");
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
  }, []);

  // cars? console.log(cars[0].id):{} ;

  return editMode == 0 ? (
    <Grid.Container gap={1} justify="flex-start">
      {cars.map((item, index) => (
        <Grid xs={6} sm={3} key={index}>
          <Card isPressable>
            <Card.Header css={{ justifyItems: "flex-start" }}>
              <Row wrap="wrap" justify="space-between" align="center">
                <Text
                  css={{
                    display: "flex",
                    color: "$accents7",
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
                    color: "$accents9",
                    fontWeight: "$semibold",
                    fontSize: "$sm",
                  }}
                  b
                >
                  {item.availability}
                </Text>
                <Text
                  css={{
                    display: "flex",
                    color: "$accents7",
                    fontWeight: "$semibold",
                    fontSize: "$sm",
                  }}
                >
                  {item.service}
                </Text>
              </Row>
            </Card.Header>
            <Card.Body css={{ p: 0 }}>
              <CarCard props={item} />
            </Card.Body>
            <Card.Footer css={{ justifyItems: "flex-start" }}>
              <Row wrap="wrap" justify="space-between" align="center">
                <Text b>{item.model}</Text>

                <Text b>{item.km + "km"}</Text>
              </Row>
            </Card.Footer>
            {item.availability == "Libre" && (
              <Grid.Container justify="center">
              <Button.Group color="gradient" ghost>
                <Button
                  onPress={() => {
                    setCarSelected(item);
                    setEditMode("Livrer");
                  }}
                >
                  Livrer/R
                </Button>
                <Button
                  onPress={() => {
                    setCarSelected(item);
                    setEditMode("Arret");
                  }}
                >
                  En arret
                </Button>
              </Button.Group>
              </Grid.Container>
            )}
            {(item.availability == "Prete" ) && (

              <Button
                onPress={() => {
                  setCarSelected(item);
                  setEditMode("Retour");
                }}
              >
                Receptionner
              </Button>
            )}
             {(item.availability == "Arret" ) && (
              <Button
                onPress={() => {
                  setCarSelected(item);
                  setEditMode("Retour");
                }}
              >
                Receptionner
              </Button>
            )}
          </Card>
        </Grid>
      ))}
    </Grid.Container>
  ) : (
    <Grid.Container justify="center">
      <CarCard props={carSlected} />

      {editMode == "Livrer" && (
        <Livrer car={carSlected} setEditMode={setEditMode}></Livrer>
      )}
      {editMode == "Arret" && (
        <Immobiliser car={carSlected} setEditMode={setEditMode}></Immobiliser>
      )}
      {editMode == "Retour" && (
        <Retour car={carSlected} setEditMode={setEditMode}></Retour>
      )}


    </Grid.Container>
  );
}
