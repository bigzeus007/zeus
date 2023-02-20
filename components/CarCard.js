import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { db, storage} from '@/firebase';
import { collection, getDocs } from "firebase/firestore";   
import { Card, Grid, Row, Text } from "@nextui-org/react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default function CarCard(car) {
console.log(car.props.id)
  const [carImage, setCarImage] = useState("");    
  
  
  const spaceRef = ref(storage, `cars/${car.props.id}`);

  useEffect(()=>{
    getDownloadURL(spaceRef)
    .then((url) => setCarImage(url))
    .catch((err) =>console.log(err))

  },[])
  console.log(car)
  return (
   
      <Card.Image
                src={carImage}
                objectFit="cover"
                width="60%"
                height={140}
                alt={"https://firebasestorage.googleapis.com/v0/b/terminal00.appspot.com/o/cars%2Fimages%20(2).png?alt=media&token=ee40db8e-ca88-4a23-85dc-55676a59120d"}
              />
   
  );
}

