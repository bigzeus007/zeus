import React, { useEffect, useState } from "react";
import styles from "../styles/Parking.module.css";
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
} from "@nextui-org/react";
import "firebase/firestore";
import { db, storage } from "../firebase";
import { collection, getDocs, onSnapshot, orderBy } from "firebase/firestore";
import AddCarParking from "./AddCarParking";

const CustomerParking = () => {
  const [editMode, setEditMode] = useState(0);
  const [editModeCarStatus, setEditModeCarStatus] = useState(false);
  const emptyPlace = {
    place: 0,
    placeStatus: false,
    cs: "",
    note: "",
    date: "",
    imageUrl: "https://via.placeholder.com/320x180",
    historyEdit: [
      {
        qui: "",
        quoi: "",
        quand: "",
      },
    ],
  };
  const parkingAa = [1, 2, 3, 4, 5];
  const parkingAb = [6, 7, 8, 9, 10];
  const parkingBa = [11, 12, 13, 14, 15];
  const parkingBb = [16, 17, 18, 19, 20];
  const parkingC = [21, 22, 23, 24, 25];

  const parcListRef = collection(db, "parkingCustomer");
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
  }, [editMode]);

  function findCar(num) {
    return cars.find((car) => car.place === num) || emptyPlace;
  }

  const PlaceContentC = ({ num }) => {
    const myContent = findCar(num);

    return (
      <Col span={2} css={{ height: "stretch" }}>
        <Card
          css={{ height: "stretch" }}
          isPressable
          onPress={() => {setEditMode(num);setEditModeCarStatus(myContent)}}
        >
          <Image
            width={320}
            height={180}
            src={`${myContent.imageUrl}`}
            alt={`Image of car in place ${myContent.place}`}
            objectFit="fill"
          />
          <Text color="white" size={"3vw"} css={{ position: "absolute", left: "10%" }}>
            {num}
          </Text>
          {myContent.csSelected && (
            <Text
            color="white"
              size={"1vw"}
              css={{ position: "absolute", bottom: "0%", border: "$border" }}
            >
              {myContent.csSelected}
            </Text>
          )}
        </Card>
      </Col>
    );
  };

  const PlaceContentR = ({ num }) => {
    const myContent = findCar(num);

    return (
      <Row span={1} >
        <Card
          
          isPressable
          onPress={(e) => {setEditMode(num);setEditModeCarStatus(myContent)}}
        >
  
            <Image
              width={320}
              height={90}
              src={`${myContent.imageUrl}`}
              alt={`Image of car in place ${myContent.place}`}
              objectFit="fill"
            />
             <Text color="white" size={"3vw"} css={{ position: "absolute", left: "10%" }}>
            {num}
          </Text>
          {myContent.csSelected && (
            <Text
            color="white"
              size={"1vw"}
              css={{ position: "absolute", bottom: "0%", border: "$border" }}
            >
              {myContent.csSelected}
            </Text>)}
            
          
        </Card>
      </Row>
    );
  };

  return editMode == 0 ? (
    <Container gap={1 }>
      <Row gap={0} css={{ height: "100px", width: "100%" }}>
        {parkingAa.map((parkingNum) => (
          <PlaceContentC num={parkingNum} key={parkingNum} />
        ))}
      </Row>
      <Row gap={0} css={{ height: "100px", width: "100%" }}>
        {parkingAb.map((parkingNum) => (
          <PlaceContentC num={parkingNum} key={parkingNum} />
        ))}
      </Row>
      <Spacer y={1} />
      <Row gap={0} css={{ height: "100px", width: "100%" }}>
        {parkingBa.map((parkingNum) => (
          <PlaceContentC num={parkingNum} key={parkingNum} />
        ))}
      </Row>
      <Row gap={0} css={{ height: "100px", width: "100%" }}>
        {parkingBb.map((parkingNum) => (
          <PlaceContentC num={parkingNum} key={parkingNum} />
        ))}
      </Row>
      <Spacer y={1} />
      <Container
        gap={0}
        css={{
          position: "absolute",
          top: "20%",
          right: "0%",
          height: "100px",
          width: "15%",
        }}
      >
        {parkingC.map((parkingNum) => (
          <PlaceContentR num={parkingNum} key={parkingNum} />
        ))}
      </Container>
    </Container>
  ) : (
    <AddCarParking place={editMode} setEditMode={setEditMode} editModeCarStatus={editModeCarStatus}/>
  );
};

export default CustomerParking;
