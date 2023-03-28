import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { db, storage } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card, Grid, Image, Row, Text } from "@nextui-org/react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default function CarCard(car) {
  

  const availabilityColor = () => {
    switch (car.props.availability) {
      case true:
        return "green";

      case false:
        return "yellow";


      default:
        return "white";
    }
  };
  console.log(availabilityColor())

  const [carImage, setCarImage] = useState("");

  const spaceRef = ref(storage, `cars/${car.props.id}`);

  useEffect(() => {
    getDownloadURL(spaceRef)
      .then((url) => setCarImage(url))
      .catch((err) => console.log(err));
  }, []);
  console.log(car);
  return (
    <Image
      src={carImage}
      css={{ backgroundColor: `${availabilityColor()}` }}
      objectFit="contain"
      width="100%"
      height={160}
      alt={"loading.."}
    />
  );
}
