import styled from "styled-components";

export const CarInfos = styled.div`
  display: ${(props) => props.pictureTooked};
  flex-direction: row;
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
  .marque {
    display: flex;
  }
  button {
    border-radius: 20%;
    height: 10vh;
    width: 10vw;
  }
  .audi {
    background-color: steelblue;
  }
  .skoda {
    background-color: green;
  }
  .model {
    width: 20vw;
  }
  .vin {
    width: 30vw;
  }
  .mec {
    width: 20vw;
    height: 5vh;
  }
  @media screen and (max-width: 620px) {
    font-size: 5px;

    .model {
      top: 1vh;
      left: 0vw;
      width: 100px;
    }
    .vin {
      top: 1vh;
      left: 0vw;
      width: 100px;
    }
    .mec {
      left: 0vw;
      top: 5vh;
      width: 100px;
    }
  }
`;

export const MiseEnCirculation = styled.div`
  display: ${(props) => (props.rdvState == false ? "none" : "flex")};
  flex-direction: column;
  /* display:${(props) => (props.rdvSate == "--:-- --" ? "none" : "flex")}; */
`;

export const ChooseRdvStatus = styled.div``;

export const RdvInfo = styled.div`
  position: absolute;

  top: 15vh;
  left: 10vw;
  font-size: 1.7vw;
`;
