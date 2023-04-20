import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { db, storage, auth } from "../../firebase";

import {
  updateDoc,
  doc,setDoc,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import {
  Avatar,
  Button,
  Image,
  Text,
  Card,
  Container,
  Grid,
  Input,
  Radio,
  Loading,
  Spacer,
  Badge,
  Row,
} from "@nextui-org/react";
import CarCardParkingCustomer from "./carCardParkingCustomer";
import SemiCircleProgressBar from "./SemiCircleProgressBar";

export default function NextLavage({listAttenteLavage,setEditMode,setEditModeCarStatus,setWashingArea,washingArea,setWashingDashboardData,washingDashboardData}) {

  const listLavageRdv= listAttenteLavage.filter((car)=>{if(car.rdv==true){return car}});
  const listLavageSrdv= listAttenteLavage.filter((car)=>{if(car.rdv==false){return car}});

  const orderedListLavageRdv = listLavageRdv.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
  const orderedListLavageSrdv = listLavageSrdv.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
 
  return (
   <Container  css={{display:"contents",}}>
    <Grid.Container  justify="center" css={{backgroundColor:"orange"}} >
    <Text size="md" color="primary" >Liste Lavage Sans RDV</Text>
    </Grid.Container>
     
      <Grid.Container  justify="space-evenly" css={{backgroundColor:"pink"}} >
      {orderedListLavageSrdv.map((myContent,index) => (
      
        <CarCardParkingCustomer myContent={myContent} key={index} setEditMode={setEditMode} setEditModeCarStatus={setEditModeCarStatus} setWashingArea={setWashingArea} washingArea={washingArea}/>
      
      ))}
      </Grid.Container>
      <Grid.Container  justify="center" css={{backgroundColor:"orange"}} >
      <Text size="md" color="primary" >Liste Lavage RDV</Text>
      </Grid.Container>
      

      <Grid.Container justify="space-evenly" css={{backgroundColor:"pink"}} >

      {orderedListLavageRdv.map((myContent,index) => (
      
      <CarCardParkingCustomer myContent={myContent} key={index} setEditMode={setEditMode} setEditModeCarStatus={setEditModeCarStatus} setWashingArea={setWashingArea} washingArea={washingArea}/>
    
    ))}
    </Grid.Container >
    <Grid.Container  justify="center" css={{backgroundColor:"orange"}} >
      <Text size="md" color="primary" >Realisations</Text>
      </Grid.Container>
      <Spacer y={0.5}></Spacer>

   
    {washingDashboardData&&<Grid.Container justify="center" gap={2}>
      <Grid>
        <Badge color="error" content={washingDashboardData.complet} shape="rectangle" size="md">
          <Avatar
            squared
            size="lg"
            text="C"
          />
        </Badge>
      </Grid>
      <Grid>
        <Badge disableOutline color="error" content={washingDashboardData.simple} shape="circle" size="md">
          <Avatar
            size="lg"
            text="S"
          />
        </Badge>
      </Grid>
      <Grid>
        <Badge disableOutline color="error" content={washingDashboardData.annuler} shape="circle" size="md">
          <Avatar
            size="lg"
            text="X"
          />
        </Badge>
      </Grid>
      <Grid css={{width:"30vw",maxWidth:"100px"}} >
        <SemiCircleProgressBar washingDashboardData={washingDashboardData}></SemiCircleProgressBar>
      </Grid>
     
    </Grid.Container>}

   </Container>
  );
}

