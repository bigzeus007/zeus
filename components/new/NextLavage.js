import React from "react";
import { Avatar, Container, Grid, Spacer, Text } from "@nextui-org/react";
import MiniBadge from "../MiniBadge";
import CarCardParkingCustomer from "./carCardParkingCustomer";
import SemiCircleProgressBar from "./SemiCircleProgressBar";

function tsSeconds(createdAt) {
  // Firestore Timestamp => createdAt.seconds
  if (!createdAt) return 0;
  if (typeof createdAt?.seconds === "number") return createdAt.seconds;
  // Date => getTime
  if (createdAt instanceof Date) return Math.floor(createdAt.getTime() / 1000);
  return 0;
}

export default function NextLavage({
  listAttenteLavage,
  setEditMode,
  setEditModeCarStatus,
  setWashingArea,
  washingArea,
  washingDashboardData,
}) {
  const listLavageRdv = listAttenteLavage.filter((car) => car?.rdv === true);
  const listLavageSrdv = listAttenteLavage.filter((car) => car?.rdv === false);

  const orderedListLavageRdv = [...listLavageRdv].sort(
    (a, b) => tsSeconds(b.createdAt) - tsSeconds(a.createdAt)
  );
  const orderedListLavageSrdv = [...listLavageSrdv].sort(
    (a, b) => tsSeconds(b.createdAt) - tsSeconds(a.createdAt)
  );

  return (
    <Container css={{ display: "contents" }}>
      <Grid.Container justify="center">
        <Text size="md" color="primary">
          Liste Lavage Sans RDV
        </Text>
      </Grid.Container>

      <Grid.Container justify="space-evenly">
        {orderedListLavageSrdv.map((myContent) => (
          <CarCardParkingCustomer
            key={myContent.id}
            myContent={myContent}
            setEditMode={setEditMode}
            setEditModeCarStatus={setEditModeCarStatus}
            setWashingArea={setWashingArea}
            washingArea={washingArea}
          />
        ))}
      </Grid.Container>

      <Grid.Container justify="center">
        <Text size="md" color="primary">
          Liste Lavage RDV
        </Text>
      </Grid.Container>

      <Grid.Container justify="space-evenly">
        {orderedListLavageRdv.map((myContent) => (
          <CarCardParkingCustomer
            key={myContent.id}
            myContent={myContent}
            setEditMode={setEditMode}
            setEditModeCarStatus={setEditModeCarStatus}
            setWashingArea={setWashingArea}
            washingArea={washingArea}
          />
        ))}
      </Grid.Container>

      <Grid.Container justify="center">
        <Text size="md" color="primary">
          Réalisations
        </Text>
      </Grid.Container>

      <Spacer y={0.5} />

      {washingDashboardData && (
        <Grid.Container justify="center" gap={2}>
          <Grid>
            <MiniBadge color="error" content={washingDashboardData.complet ?? 0} shape="rectangle" size="md">
              <Avatar squared size="lg" text="C" />
            </MiniBadge>
          </Grid>
          <Grid>
            <MiniBadge color="error" content={washingDashboardData.simple ?? 0} shape="circle" size="md">
              <Avatar size="lg" text="S" />
            </MiniBadge>
          </Grid>
          <Grid>
            <MiniBadge color="error" content={washingDashboardData.annuler ?? 0} shape="circle" size="md">
              <Avatar size="lg" text="X" />
            </MiniBadge>
          </Grid>

          <Grid css={{ width: "30vw", maxWidth: "100px" }}>
            <SemiCircleProgressBar washingDashboardData={washingDashboardData} />
          </Grid>
        </Grid.Container>
      )}
    </Container>
  );
}
