import { Button, Grid, Input, Progress, Text } from "@nextui-org/react";
import React, { useState } from "react";

export default function Reserver({car,setEditMode}) {
  const carToEdit = car;

  
  const [diesel, setDiesel] = useState(0);
  

  return (
    <>
      <Grid.Container gap={2} justify="flex-start">
        <Grid xs={12} md={12}>
          <Text>{carToEdit.marque}</Text>
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
          <Input label="Date de retour" type="date" />
          
        </Grid>
        <Grid xs={4} sm={12}>
        <Input label="Km" type="number" />
        </Grid>
        <Grid>
            <Button>Enregistrer</Button>
           
        </Grid>
        <Grid>
           
            <Button onPress={()=>setEditMode(0)}>Retour</Button>
        </Grid>
      </Grid.Container>
    </>
  );
}
