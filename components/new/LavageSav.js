import React from "react";
import { Button, Grid, Text } from "@nextui-org/react";
import NextLavage from "./NextLavage";

export default function LavageSav({
  setWashingArea,
  cars,
  setEditMode,
  setEditModeCarStatus,
  washingArea,
  washingDashboardData,
  setWashingDashboardData,
}) {
  const listAttenteLavage = cars.filter(
    (car) => car.basy === true && car.lavage !== "sans"
  );

  const listCarsWashed = cars.filter(
    (car) =>
      car.basy === false && (car.lavage === "simple" || car.lavage === "complet")
  );

  // ✅ "annuler" (pas "annulé")
  const listCanceledWashing = cars.filter((car) => car.lavage === "annuler");

  return washingArea === 1 ? (
    <Grid.Container gap={2} justify="center">
      <Grid>
        <Text size="$xl" color="secondary">
          En attente de Lavage
        </Text>
      </Grid>

      <NextLavage
        listAttenteLavage={listAttenteLavage}
        setEditMode={setEditMode}
        setEditModeCarStatus={setEditModeCarStatus}
        setWashingArea={setWashingArea}
        washingArea={washingArea}
        setWashingDashboardData={setWashingDashboardData}
        washingDashboardData={washingDashboardData}
      />

      <Grid>
        <Button
          color="primary"
          onPress={() => {
            setWashingArea(0);
            setEditMode(0);
          }}
        >
          Retour
        </Button>
      </Grid>
    </Grid.Container>
  ) : null;
}
