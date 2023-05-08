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
import "firebase/firestore";
import { db, storage } from "../firebase";
import { collection, getDocs, orderBy, onSnapshot,doc } from "firebase/firestore";
import AddCarParking from "./AddCarParking";
import LavageSav from "./new/LavageSav";

const CustomerParking = ({user}) => {
  const [editMode, setEditMode] = useState(0);
  const [editModeCarStatus, setEditModeCarStatus] = useState(false);

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

  const emptyPlace = {
    place: 0,
    placeStatus: false,
    csSelected: "",
    rdv:"ND",
    lavage:"ND",
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
  const parkingAa = [11, 12, 13, 14, 15];
  const parkingAb = [16, 17, 18, 19, 20];
  const parkingBa = [21, 22, 23, 24];
  const parkingBb = [25, 26, 27];
  const parkingC = [28, 29, 30, 31, 32, 33];

  
  const [cars, setCars] = useState([]);
  const [aziz, setAziz] = useState(0);
  const [badr, setBadr] = useState(0);
  const [abdelali, setAbdelali] = useState(0);
  const [mohammed, setMohammed] = useState(0);
  const [nd, setNd] = useState(0);
  const [washingArea,setWashingArea]=useState(0);
  const parcListRef = collection(db, "parkingCustomer");
  useEffect(() => {
    const unsubscribe = onSnapshot(parcListRef, (querySnapshot) => {
      const carsData = [];
      let azizC = 0;
      let badrC = 0;
      let abdelaliC = 0;
      let mohammedC = 0;
      let ndC = 0;

      querySnapshot.forEach((doc) => {
        doc.data().csSelected == "BADR" && badrC++;
        doc.data().csSelected == "AZIZ" && azizC++;
        doc.data().csSelected == "ABDELALI" && abdelaliC++;
        doc.data().csSelected == "MOHAMMED" && mohammedC++;
        doc.data().csSelected == "ND" && ndC++;
        carsData.push(doc.data());
      });
      setCars(carsData);
      setAziz(azizC);
      setBadr(badrC);
      setAbdelali(abdelaliC);
      setMohammed(mohammedC);
      setNd(ndC);
    });

    return unsubscribe; // cleanup function
  }, []);

  
  const [washingDashboardData, setWashingDashboardData] = useState({complet:0,simple:0,annuler:0,});
  
  useEffect(() => {
    const workingDate = new Date().toISOString().substring(0, 10);
    
  
   
      const unsubscribe = onSnapshot(
        doc(db, "washingDashboard", workingDate),
        (doc) => {
          
          const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
          
          
          setWashingDashboardData(doc.data());
          
          
        }
      );
      
      return unsubscribe; // cleanup function
   
  }, []);

  


  function findCar(num) {
    return cars.find((car) => car.place === num) || emptyPlace;
  }

  const PlaceContentC = ({ num }) => {
    const myContent = findCar(num);

    return (
      <Col span={2}>
        
        <Badge
          enableShadow
          disableOutline
         
          horizontalOffset="10%"
          verticalOffset="80%"
          content={`${
            myContent.rdv == true 
              ? "R"
              : "S"
          }`}
          isSquared
          color={`${myContent.rdv == true ? "success" : ""}`}
         
          size="xs"
          css={{
            display: `${myContent.rdv == "ND" ? "none" : "flex"}`,
          }}

        >
          <Card
            isPressable
            onPress={() => {
              setEditMode(num);
              setEditModeCarStatus(myContent);
            }}
          >
            <Grid>
              <Avatar
                text={`${num}`}
                color={""}
                size="sm"
                textColor="white"
              
                css={{
                  position: "absolute",
                  backgroundColor: `${csBadgeColor(myContent.csSelected)}`,
                }}
              />
            </Grid>

            <Badge
              content={`${
                myContent.lavage=="annuler"
                ?"X"
                :
                myContent.basy == false 
                  ? "lavé"
                  : ""

              }`}
              isSquared
              color={`${myContent.basy == true ? "warning" : (myContent.rdv ==true&&myContent.lavage !=="annuler" ?"success":"error")}`}
              variant={`${myContent.basy == true ? "points" : ""}`}
              size="xs"
              horizontalOffset="15%"
              verticalOffset="10%"
              css={{
                display: `${myContent.lavage == "sans" ? "none" : "flex"}`,
              }}
            >
              <Image
                width="15vw"
                height="12vh"
                src={`${myContent.imageUrl}`}
                alt={`Image of car in place ${myContent.place}`}
                objectFit="cover"
              />
            </Badge>
          </Card>
        </Badge>
       
      </Col>
    );
  };

  const PlaceContentR = ({ num }) => {
    const myContent = findCar(num);

    return (
      <Row span={1}>
      
        <Badge
          enableShadow
          disableOutline
         
          horizontalOffset="10%"
          verticalOffset="80%"
          content={`${
            myContent.rdv == true 
              ? "R"
              : "S"
          }`}
          isSquared
          color={`${myContent.rdv == true ? "success" : ""}`}
         
          size="xs"
          css={{
            display: `${myContent.rdv == "ND" ? "none" : "flex"}`,
          }}

        >
          <Card
            isPressable
            onPress={() => {
              setEditMode(num);
              setEditModeCarStatus(myContent);
            }}
          >
            <Grid>
              <Avatar
                text={`${num}`}
                color={""}
                size="sm"
                textColor="white"
              
                css={{
                  position: "absolute",
                  backgroundColor: `${csBadgeColor(myContent.csSelected)}`,
                }}
              />
            </Grid>

            <Badge
              content={`${
                myContent.lavage=="annuler"
                ?"X"
                :
                myContent.basy == false 
                  ? "lavé"
                  : ""
                  
              }`}
              isSquared
              color={`${myContent.basy == true ? "warning" : (myContent.rdv ==true&&myContent.lavage !=="annuler" ?"success":"error")}`}
              variant={`${myContent.basy == true ? "points" : ""}`}
              size="xs"
              horizontalOffset="15%"
              verticalOffset="10%"
              css={{
                display: `${myContent.lavage == "sans" ? "none" : "flex"}`,
              }}
            >
              <Image
                width="15vw"
                height="12vh"
                src={`${myContent.imageUrl}`}
                alt={`Image of car in place ${myContent.place}`}
                objectFit="cover"
              />
            </Badge>
          </Card>
        </Badge>
      
      </Row>
    );
  };

  return washingArea !== 1 ? (
  editMode == 0 ? (
    <Container gap={0}>
      <Row gap={0}>
        {parkingAa.map((parkingNum) => (
          <PlaceContentC num={parkingNum} key={parkingNum} />
        ))}
      </Row>
      <Spacer y={0.5} />
      <Row gap={0}>
        {parkingAb.map((parkingNum) => (
          <PlaceContentC num={parkingNum} key={parkingNum} />
        ))}
      </Row>
      <Spacer y={1} />
      <Row gap={0}>
        {parkingBa.map((parkingNum) => (
          <PlaceContentC num={parkingNum} key={parkingNum} />
        ))}
      </Row>
      <Spacer y={0.5} />
      <Row gap={0}>
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
      <Grid.Container css={{ width: "50vw" }} display={"flex"} gap={1}>
        <Grid>
          <Badge
            shape="rectangle"
            size="md"
            color="error"
            placement="top-right"
            content={aziz}
          >
            <Avatar
              text="Aziz"
              color=""
              css={{ backgroundColor: "purple" }}
              textColor="white"
              size={"lg"}
            />
          </Badge>
        </Grid>
        <Grid>
          <Badge
            shape="rectangle"
            size="md"
            color="error"
            placement="top-right"
            content={abdelali}
          >
            <Avatar
              text="Abdel"
              color=""
              css={{ backgroundColor: "green" }}
              textColor="white"
              size={"lg"}
            />
          </Badge>
        </Grid>
        <Grid>
          <Badge
            shape="rectangle"
            size="md"
            color="error"
            placement="top-right"
            content={badr}
          >
            <Avatar
              text="Badr"
              color=""
              css={{ backgroundColor: "orange" }}
              textColor="white"
              size={"lg"}
            />
          </Badge>
        </Grid>
        <Grid>
          <Badge
            shape="rectangle"
            size="md"
            color="error"
            placement="top-right"
            content={mohammed}
          >
            <Avatar
              text="Simo"
              color=""
              css={{ backgroundColor: "blue" }}
              textColor="white"
              size={"lg"}
            />
          </Badge>
        </Grid>
        <Grid>
          <Badge
            shape="rectangle"
            size="md"
            color="error"
            placement="top-right"
            content={nd}
          >
            <Avatar
              text="ND"
              color=""
              css={{ backgroundColor: "red" }}
              textColor="white"
              size={"lg"}
            />
          </Badge>
        </Grid>
      </Grid.Container>
      {user.job=="BETA"&&<Grid.Container justify="center" css={{ position:"absolute",size:"auto",bottom:"15vh",right:"15vw" }}>
        <Grid><Badge content="" variant="points" color="warning"><Button  auto size="lg" color="warning" onPress={()=>{setWashingArea(1)}}>?</Button></Badge></Grid>
      </Grid.Container>}
    </Container>
  ) : (
    <AddCarParking
      place={editMode}
      setEditMode={setEditMode}
      setWashingDashboardData={setWashingDashboardData}
      washingDashboardData={washingDashboardData}

      setWashingArea={setWashingArea}
      washingArea={washingArea} 
      editModeCarStatus={editModeCarStatus}
    />
  )):(<LavageSav cars={cars} setWashingArea={setWashingArea} setWashingDashboardData={setWashingDashboardData} washingDashboardData={washingDashboardData} setEditMode={setEditMode} setEditModeCarStatus={setEditModeCarStatus} washingArea={washingArea} />)
};

export default CustomerParking;
