import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { db, storage } from "../firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { Card, Grid, Row, Text } from "@nextui-org/react";
import CarCard from "./CarCard";

export default function ParcSav() {

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
    }
   
  ];

 
  const parcListRef = collection(db, "cars");
  const [cars, setCars] = useState([]);
  
  useEffect(()=>{
    getDocs(parcListRef).then((querySnapshot) => {
      const carsData = [];
      querySnapshot.forEach((doc) => {
        carsData.push(doc.data());
      });
      setCars(carsData);
    }).catch((error) => {
      console.log("Error getting documents: ", error);
    });
  },[])

  // cars? console.log(cars[0].id):{} ;

 

  return (
    <Grid.Container gap={2} justify="flex-start">
      {
      cars.map((item, index) => (
        <Grid xs={6} sm={3} key={index}>
          <Card isPressable>
            <Card.Body css={{ p: 0 }}>
              <CarCard props={item}
              />
            </Card.Body>
            <Card.Footer css={{ justifyItems: "flex-start" }}>
              <Row wrap="wrap" justify="space-between" align="center">
                <Text b>{item.marque}</Text>
                <Text
                  css={{
                    color: "$accents7",
                    fontWeight: "$semibold",
                    fontSize: "$sm",
                  }}
                >
                  {item.vin}
                </Text>
              </Row>
            </Card.Footer>
          </Card>
        </Grid>
      ))}
    </Grid.Container>
  );
}
