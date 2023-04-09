import { auth, db } from "@/firebase";
import {
  Button,
  Card,
  Grid,
  Row,
  Input,
  Progress,
  Text,
  Textarea,
  Badge,
  Spacer,
  Image,
} from "@nextui-org/react";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import CarCard from "./CarCard";

export default function EditCar({ car, setEditMode }) {
  const carToEdit = car;

  const [diesel, setDiesel] = useState(carToEdit.carburant);
  const [carStatus, setCarStatus] = useState(carToEdit.availability);
  const [nom, setNom] = useState("");
  const [raison, setRaison] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const userName = auth.currentUser.displayName;
  const [km, setKm] = useState(0);

  const carRef = doc(db, "cars", `${carToEdit.id}`);
  const handleSubmit = async () => {
    await setDoc(
      carRef,
      {
        customer: nom,
        raison: raison,
        departureDate: departureDate,
        returnDate: returnDate,

        km: km,
        availability: !carToEdit.availability,
        carburant: diesel,
        carStory: [
          {
            creator: userName,
            action: "Pret",
            when: new Date().toISOString().substring(0, 16),
          },
        ],
      },
      { merge: true }
    );
    setEditMode(0);
  };

  return (
    <Card css={{ height:"auto", mw: "80vw" }}>
      <Card.Header>
        <Grid.Container gap={1} justify="center">
         {!carToEdit.availability && (
          <Grid x={18}>
            <Text>
              Retour Le : {carToEdit.returnDate}
            </Text>
          </Grid>
        )}
        <Grid css={{width:"40%", minWidth:"200px",}} >
          <Input
            label="Nom Client"
            type="text"
            placeholder={carToEdit.customer}
            disabled={!carStatus}
            onChange={(e) => {
              setNom(e.target.value);
            }}
          />
        </Grid>

        <Grid x={6} >
          <Badge
            content={<Text color="white">km : {carToEdit.km}</Text>}
            disableOutline
            color="transparent"
            horizontalOffset="65%"
            verticalOffset="90%"
          >
            <Badge
              content={<Text color="white">{carToEdit.marque}</Text>}
              color="transparent"
              disableOutline
              horizontalOffset="70%"
              verticalOffset="13%"
            >
              <Badge
                content={<Text color="white">{carToEdit.model}</Text>}
                color="transparent"
                disableOutline
                horizontalOffset="10%"
                verticalOffset="13%"
              >
                <Badge
                  placement="centre"
                  content={
                    <Progress
                      css={{ width: "90px" }}
                      value={diesel}
                      color="success"
                      status="error"
                    />
                  }
                >
                  <CarCard props={carToEdit} ></CarCard>
                  {/* <Image src={carToEdit.imageUrl} height={300} width={150}></Image> */}
                </Badge>
              </Badge>
            </Badge>
          </Badge>
        </Grid>
        </Grid.Container>
        </Card.Header>
      <Grid.Container gap={0} justify="center" >
       

        

     
        {carToEdit.availability == carStatus && (
          <Grid css={{width:"80%",minWidth:"200px"}}>
            <Textarea
              label="Raisons, Téléphone, CLT"
              placeholder={!carStatus ? `${carToEdit.raison}` : ""}
              clearable
              onChange={(e) => setRaison(e.target.value)}
              status="default"
              fullWidth
              disabled={!carStatus}
            />
          </Grid>
        )}
       

        {carStatus && (
          <Grid css={{width:"35%",minWidth:"150px"}}>
            <Input
              label="Niveau Gasoil %"
              type="number"
              onChange={(e) => {
                setDiesel(e.target.value);
              }}
            />
          </Grid>
        )}
        <Spacer x={1}></Spacer>

        {carStatus && (
          <Grid css={{width:"35%",minWidth:"150px"}}>
            <Input
              label="Km"
              type="number"
              onChange={(e) => setKm(e.target.value)}
            />
          </Grid>
        )}

        {carToEdit.availability && (
          <Grid css={{width:"35%",minWidth:"200px"}}>
            <Input
              label="Date de sortie"
              type="date"
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </Grid>
        )}

        {carStatus && (
          <Grid css={{width:"35%",minWidth:"200px"}}>
            <Input
              label="Date de retour Prevue"
              type="date"
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </Grid>
        )}
      </Grid.Container>
      
      <Card.Footer css={{ justifyContent: "center" }}>
        <Grid.Container gap={2} justify="center">
        {!carStatus && (
          <Grid >
            <Button onPress={() => setCarStatus(true)} size="lg" >
              Déverrouiller
            </Button>
          </Grid>
        )}
        {carStatus && (
          <Grid >
            <Button onPress={() => handleSubmit()} size="lg"  >
              Enregistrer
            </Button>
          </Grid>
        )}
        
        <Grid >
          <Button onPress={() => setEditMode(0)} size="lg" >
            Retour
          </Button>
        </Grid >
        </Grid.Container>
      </Card.Footer>
    </Card>
  );
}
