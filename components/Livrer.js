import { auth, db } from "@/firebase";
import { Button, Grid, Input, Progress, Text, Textarea } from "@nextui-org/react";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";

export default function Livrer({car,setEditMode}) {
  const carToEdit = car;
 
  
  const [diesel, setDiesel] = useState(carToEdit.carburant);
  const[nom,setNom]=useState("");
  const[raison,setRaison]=useState("");
  const[departureDate,setDepartureDate]=useState("");
  const[returnDate,setReturnDate]=useState("");
  const userName = auth.currentUser.displayName;
  const[km,setKm]=useState(0);

  const carRef = doc(db, "cars",`${carToEdit.id}`);
  const handleSubmit = async () => {
    await setDoc(carRef, {
      customer:nom,
      raison:raison,
      departureDate:departureDate,
      returnDate:returnDate,


      
      km: km,
      availability:"Prete",
      carburant:diesel,
      carStory: [
        {
          creator: userName,
          action:"Pret",
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
          <Input
            label="Nom Client"
            type="text"
            onChange={(e) => {
              setNom(e.target.value);
            }}
            
          />
        </Grid>
        <Grid xs={12} sm={12}>
        <Textarea labelPlaceholder="Raisons, identifications" onChange={(e)=>setRaison(e.target.value)} status="default" fullWidth/>
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
          <Input label="Date de sortie" type="date" onChange={(e)=>setDepartureDate(e.target.value)}/>
          
        </Grid>

        <Grid xs={6} sm={6}>
          <Input label="Date de retour Prevue" type="date" onChange={(e)=>setReturnDate(e.target.value)}/>
          
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
