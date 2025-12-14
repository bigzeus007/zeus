// import React, { useEffect, useState } from "react";
// import { useRef } from "react";
// import { db, storage, auth } from "../../firebase";

// import {
//   updateDoc,
//   doc,

//   setDoc,
//   serverTimestamp,
//   collection,

// } from "firebase/firestore";
// import {
//   Button,
//   Image,
//   Text,
//   Card,
//   Container,
//   Grid,
//   Input,
//   Radio,
//   Loading,
//   Spacer,
// } from "@nextui-org/react";

// export default function AttenteLavageList({attenteLavageList}) {

//   const carWCard = ({ car }) => {

//     return (
//       <Col span={2}>

//         <MiniBadge
//           enableShadow
//           disableOutline

//           horizontalOffset="10%"
//           verticalOffset="80%"
//           content={`${
//             myContent.rdv == true
//               ? "R"
//               : "S"
//           }`}
//           isSquared
//           color={`${myContent.rdv == true ? "success" : ""}`}

//           size="xs"
//           css={{
//             display: `${myContent.rdv == "ND" ? "none" : "flex"}`,
//           }}

//         >
//           <Card
//             isPressable
//             onPress={() => {
//               setEditMode(num);
//               setEditModeCarStatus(myContent);
//             }}
//           >
//             <Grid>
//               <Avatar
//                 text={`${num}`}
//                 color={""}
//                 size="sm"
//                 textColor="white"

//                 css={{
//                   position: "absolute",
//                   backgroundColor: `${csBadgeColor(myContent.csSelected)}`,
//                 }}
//               />
//             </Grid>

//             <MiniBadge
//               content={`${
//                 myContent.basy == false
//                   ? "lavé"
//                   : ""
//               }`}
//               isSquared
//               color={`${myContent.basy == true ? "warning" : (myContent.rdv ==false ?"error":"success")}`}
//               variant={`${myContent.basy == true ? "points" : ""}`}
//               size="xs"
//               horizontalOffset="15%"
//               verticalOffset="10%"
//               css={{
//                 display: `${myContent.lavage == "sans" ? "none" : "flex"}`,
//               }}
//             >
//               <Image
//                 width="15vw"
//                 height="12vh"
//                 src={`${myContent.imageUrl}`}
//                 alt={`Image of car in place ${myContent.place}`}
//                 objectFit="cover"
//               />
//             </MiniBadge>
//           </Card>
//         </MiniBadge>

//       </Col>
//     );
//   };

//   return (
//     <Grid.Container gap={2} justify="center">

//   </Grid.Container>
//   );
// }
