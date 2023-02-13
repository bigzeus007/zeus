import styled from "styled-components";

export const CarInfos=styled.div`
display:${props=>props.pictureTooked};
flex-direction:row;
position: absolute;
  
  top: 5vw;
  left: 2vw;
  justify-content: space-between;
canvas {
    border-radius: 20%;
    width: 30vw;
    height: 40vh;
    position: relative;

    
  }
  .rdvSet{
    display:flex;
  }
  button {
    border-radius: 20%;
    height: 10vh;
    width: 10vw;
  }
  .SRDV {
    background-color: steelblue;
  }
  .RDV {
    background-color: green;
  }
  .customerName {
    width: 20vw;
  }
  .rdvTime {
    
    
    
    width: 20vw;
    height:5vh
  }
  @media screen and (max-width: 620px) {
    font-size: 5px;

    .customerName {
      top: 1vh;
      left: 0vw;
      width: 100px;
    }
    .rdvTime {
      left: 0vw;
      top: 5vh;
      width: 100px;
    }
  }

`

export const CarCsSelection = styled.div`
display:${props=>props.rdvState==false? "none" : "flex"};
flex-direction:column;
/* display:${props=>props.rdvSate=='--:-- --'? "none" : "flex"}; */

`

export const ChooseRdvStatus = styled.div`
  
 
`;

export const RdvInfo = styled.div`
  position: absolute;

  top: 15vh;
  left: 10vw;
  font-size: 1.7vw;

  
`;
