import { useEffect, useState } from "react";
import { storage } from "@/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { Card } from "@nextui-org/react";
import MiniBadge from "./MiniBadge";

export default function CarCard({ props }) {
  const [carImage, setCarImage] = useState("");

  const badge = (() => {
    if (props?.availability === true) return { content: "Libre", color: "success" };
    if (props?.availability === false) return { content: "Occupé", color: "error" };
    return { content: "", color: "default" };
  })();

  useEffect(() => {
    if (!props?.id) return;

    const spaceRef = ref(storage, `cars/${props.id}`);
    getDownloadURL(spaceRef)
      .then((url) => setCarImage(url))
      .catch(() => {
        // fallback si image absente
        setCarImage(
          "https://firebasestorage.googleapis.com/v0/b/terminal00.appspot.com/o/cars%2Fanonymous.png?alt=media"
        );
      });
  }, [props?.id]);

  return (
    <MiniBadge
      color={badge.color}
      content={badge.content}
      variant="flat"
      placement="top-right"
      horizontalOffset="45%"
      verticalOffset="45%"
    >
      <Card.Image
        src={carImage}
        objectFit="cover"
        width="100%"
        height={200}
        alt="car"
      />
    </MiniBadge>
  );
}
