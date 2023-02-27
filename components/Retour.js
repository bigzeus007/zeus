import { auth, db } from "@/firebase";
import { Button, Grid, Input, Progress, Text, Textarea } from "@nextui-org/react";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";

export default function Retour({car,setEditMode}) {
  const carToEdit = car;
  console.log(carToEdit);
  
  const [diesel, setDiesel] = useState(carToEdit.carburant);
 

 
  const[returnDate,setReturnDate]=useState("");
  const userName = auth.currentUser.displayName;
  const[km,setKm]=useState(0);

  const carRef = doc(db, "cars",`${carToEdit.id}`);
  const handleSubmit = async () => {
    await setDoc(carRef, {
      customer:"",
      intervention:"",
      raison:"",
      departureDate:"",
      returnDate:returnDate,
      km: km,
      availability:"Libre",
      carburant:diesel,
      carStory: [
        {
          creator: userName,
          action:"remise en stock",
          when: new Date().toISOString().substring(0, 16),
        },
      ],
    },
    { merge: true }
    );
    setEditMode(0);

  };

  return (
    <>
      <Grid.Container gap={2} justify="flex-start">
        <Grid xs={12} md={12}>
          <Text>{carToEdit.marque}</Text>
          
        </Grid>
        <Grid xs={12} sm={6}>
          <Text>{carToEdit.customer}</Text>
          <Text>{carToEdit.intervention}</Text>
        </Grid>
        <Grid xs={12} sm={12}>
        <Textarea labelPlaceholder={carToEdit.raison} status="default" fullWidth disabled/>
      </Grid>
        <Grid xs={12} sm={6}>
          <Input
            label="Niveau Gasoil %"
            type="number"
            onChange={(e) => {
              setDiesel(e.target.value);
            }}
            
          />
        </Grid>
        <Grid xs={12} sm={6} alignItems="center">
          <Progress value={diesel} color="success" status="error" size="lg"/>
        </Grid>
      

        <Grid xs={6} sm={6}>
          <Input label="Date de reparation" type="date" onChange={(e)=>setReturnDate(e.target.value)}/>
          
        </Grid>
        <Grid xs={4} sm={12}>
        <Input label="Km" type="number" onChange={(e)=>setKm(e.target.value)}/>
        </Grid>
        <Grid>
            <Button onPress={()=>handleSubmit()}>Enregistrer</Button>
           
        </Grid>
        <Grid>
           
            <Button onPress={()=>setEditMode(0)}>Retour</Button>
        </Grid>
      </Grid.Container>
    </>
  );
}
