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
  Badge,
  Avatar,
} from "@nextui-org/react";
import 'firebase/firestore';
import { db, storage } from "../firebase";
import { collection, getDocs, orderBy, onSnapshot } from "firebase/firestore";
import AddCarParking from "./AddCarParking";

const CustomerParking = () => {
  const [editMode, setEditMode] = useState(0);
  const [editModeCarStatus, setEditModeCarStatus] = useState(false);
  const emptyPlace = {
    place: 0,
    placeStatus: false,
    csSelected:"",
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
  const parkingBa = [11, 12, 13, 14];
  const parkingBb = [15, 16, 17, 18];
  const parkingC = [19, 20,21, 22, 23, 24, 25];

  const parcListRef = collection(db, "parkingCustomer");
  const [cars, setCars] = useState([]);
  const [aziz,setAziz]=useState(0);
  const [badr,setBadr]=useState(0);
  const [abdelali,setAbdelali]=useState(0);
  const [mohammed,setMohammed]=useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(parcListRef, (querySnapshot) => {
      const carsData = [];
      let azizC=0;
      let badrC=0;
      let abdelaliC=0;
      let mohammedC=0;

      querySnapshot.forEach((doc) => {
        doc.data().csSelected=="BADR"&&badrC++;
        doc.data().csSelected=="AZIZ"&&azizC++;
        doc.data().csSelected=="ABDELALI"&&abdelaliC++;
        doc.data().csSelected=="MOHAMMED"&&mohammedC++;
        carsData.push(doc.data());
      });
      setCars(carsData);
      setAziz(azizC);
      setBadr(badrC);
      setAbdelali(abdelaliC);
      setMohammed(mohammedC);


    });
    
    return unsubscribe; // cleanup function
  }, []);

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
              size={"2vw"}
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
      <Row span={1} css={{height:"80%"}}>
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
             <Text color="white" size={"3vw"} css={{ position: "absolute", left: "75%" }}>
            {num}
          </Text>
          {myContent.csSelected && (
            <Text
            color="white"
              size={"2vw"}
              css={{ position: "absolute", bottom: "10%", border: "$border" }}
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
          top: "13%",
          right: "0%",
          height: "100px",
          width: "15%",
        }}
      >
        {parkingC.map((parkingNum) => (
          <PlaceContentR num={parkingNum} key={parkingNum} />
        ))}
      </Container>
      <Grid.Container css={{width:"50vw"}} display={"flex"} gap={1}>
        <Grid><Badge shape="rectangle" size="md" color="error" placement="top-right" content={aziz} ><Avatar text="Aziz" color="gradient" textColor="white" size={"lg"}/></Badge></Grid>
        <Grid><Badge shape="rectangle" size="md" color="error" placement="top-right" content={abdelali} ><Avatar text="Abdel" color="gradient" textColor="white" size={"lg"}/></Badge></Grid>
        <Grid><Badge shape="rectangle" size="md" color="error" placement="top-right" content={badr} ><Avatar text="Badr" color="gradient" textColor="white" size={"lg"}/></Badge></Grid>
        <Grid><Badge shape="rectangle" size="md" color="error" placement="top-right" content={mohammed} ><Avatar text="Simo" color="gradient" textColor="white" size={"lg"}/></Badge></Grid>
        
      </Grid.Container>
    </Container>
  ) : (
    <AddCarParking place={editMode} setEditMode={setEditMode} editModeCarStatus={editModeCarStatus}/>
  );
};

export default CustomerParking;
