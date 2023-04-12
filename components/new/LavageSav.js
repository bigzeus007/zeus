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
  Grid,
  Input,
  Radio,
  Loading,
  Spacer,
  Badge,
} from "@nextui-org/react";

import LavageEncours from "./LavageEncours";
import WashingDashbord from "./WashingDashbord";
import NextLavage from "./NextLavage";

export default function LavageSav() {
  return (
    <Grid.Container gap={2} justify="center">
      <Grid xs={12} sm={4}>
        <NextLavage />
      </Grid>

      <Grid xs={12} sm={4}>
        <LavageEncours />
      </Grid>

      <Grid xs={12} sm={4}>
        <WashingDashbord />
      </Grid>
    </Grid.Container>
  );
}
