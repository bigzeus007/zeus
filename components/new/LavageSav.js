import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { db, storage, auth } from "../../firebase";

import {
  updateDoc,
  doc,
  setDoc,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import {
  Button,
  Image,
  Text,
  Card,
  Container,
  Row,
  Grid,
  Input,
  Radio,
  Loading,
  Spacer,
} from "@nextui-org/react";
import MiniBadge from "../MiniBadge";



import NextLavage from "./NextLavage";

export default function LavageSav({setWashingArea,cars,setEditMode,setEditModeCarStatus,washingArea,washingDashboardData,setWashingDashboardData}) {
  
  const listAttenteLavage= cars.filter((car)=>{if(car.basy==true&&car.lavage!=="sans"){return car}});
  const listCarsWashed= cars.filter((car)=>{if(car.basy==false&&(car.lavage=="simple"||car.lavage=="complet")){return car}});
  const listCanceledWashing= cars.filter((car)=>{if(car.lavage=="annulé"){return car}});
 


  return (washingArea==1?(
    <Grid.Container gap={2} justify="center" >
      <Grid >
      <Text size="$xl" color="secondary">En attente de Lavage</Text>
      </Grid>
     
        <NextLavage listAttenteLavage={listAttenteLavage} setEditMode={setEditMode} setWashingDashboardData={setWashingDashboardData} washingDashboardData={washingDashboardData} setEditModeCarStatus={setEditModeCarStatus} setWashingArea={setWashingArea} washingArea={washingArea}/>
      

    
      <Grid >
        <Button color="primary" onPress={()=>{setWashingArea(0);setEditMode(0)}}>Retour</Button>
      </Grid>
    </Grid.Container>):""
  );
}
