import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { db, storage } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Badge, Card, Grid, Image, Row, Text } from "@nextui-org/react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default function CarCard(car) {
  

  const availabilityColor = () => {
    switch (car.props.availability) {
      case true:
        return {content:"Libre",color:"success"};

      case false:
        return {content:"Occupé",color:"error"};


      default:
        return "white";
    }
  };
  

  const [carImage, setCarImage] = useState("");

  const spaceRef = ref(storage, `cars/${car.props.id}`);

  useEffect(() => {
    getDownloadURL(spaceRef)
      .then((url) => setCarImage(url))
      .catch((err) => console.log(err));
  }, [spaceRef]);

  
  return (
    
    
    <Badge 
   
    color={`${availabilityColor().color}`} content={`${availabilityColor().content}`}  variant="flat" css={{ p: "0" }}
    horizontalOffset="45%"
    verticalOffset="45%">
    <Card.Image
      src={carImage}
      
      objectFit="fill"
      width="100%"
      
      height={200}
      alt={"loading.."}
    />

    </Badge>

    
    
  );
}
