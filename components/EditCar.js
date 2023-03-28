import { auth, db } from "@/firebase";
import {
  Button,
  Card,
  Grid,
  Input,
  Progress,
  Text,
  Textarea,
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
        availability: carStatus,
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
    <>
      <Grid.Container gap={1} justify="center">
        <Card>
          <Card.Header>
            <CarCard props={carToEdit} />
            <Grid.Container>
              <Grid xs={6}>
                <Text>{carToEdit.marque}</Text>
              </Grid>
              <Grid xs={6}>
                <Text>{carToEdit.model}</Text>
              </Grid>
              <Grid xs={6}>
                <Text>Km :{carToEdit.km}</Text>
              </Grid>
              <Progress
                value={diesel}
                color="success"
                status="error"
                size="lg"
              />
              <Grid xs={12}>
                <Text>Statut :{carToEdit.availability?"Libre":"Réservé"}</Text>
              </Grid>

              {!carToEdit.availability && (
                <Grid xs={6}>
                  <Text>
                    Retour Le : <br /> {carToEdit.returnDate}
                  </Text>
                </Grid>
              )}
            </Grid.Container>
          </Card.Header>
          <Card.Body>
            <Grid.Container gap={2} justify="center">
              <Grid xs={12}>
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
              {carToEdit.availability==carStatus&&<Grid xs={12}>
                <Textarea
                  label="Raisons, Téléphone, CLT"
                  placeholder={!carStatus?`${carToEdit.raison}`:""}
                  
                  clearable
                  onChange={(e) => setRaison(e.target.value)}
                  status="default"
                  fullWidth
                  disabled={!carStatus}
                />
              </Grid>}

              {carStatus&&<Grid xs={6}>
                <Input
                  label="Niveau Gasoil %"
                  type="number"
                  onChange={(e) => {
                    setDiesel(e.target.value);
                  }}
                />
              </Grid>}

              {carStatus&&<Grid xs={6}>
                <Input
                  label="Km"
                  type="number"
                  onChange={(e) => setKm(e.target.value)}
                />
              </Grid>}

              {carToEdit.availability&&<Grid xs={6}>
                <Input
                  label="Date de sortie"
                  type="date"
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
              </Grid>}

              {carStatus&&<Grid xs={6}>
                <Input
                  label="Date de retour Prevue"
                  type="date"
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </Grid>}
            </Grid.Container>
          </Card.Body>
          <Card.Footer>
          {!carStatus&&<Grid>
              <Button onPress={() => setCarStatus(true)} >Déverrouiller</Button>
            </Grid>}
            {carStatus&&<Grid>
              <Button onPress={() => handleSubmit()} >Enregistrer</Button>
            </Grid>}
            <Grid>
              <Button onPress={() => setEditMode(0)}>Retour</Button>
            </Grid>
          </Card.Footer>
        </Card>
      </Grid.Container>
    </>
  );
}
