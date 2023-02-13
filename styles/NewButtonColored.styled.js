import styled from "styled-components";

const NewButtonColored = styled.div`

* {
  margin: 0;
  padding: 0;
  font-size:17px;
  
}


.subscribe {
  position: absolute;
  display:flex;
  left: 40vw;
  bottom: -30vh;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 80vw;
  
}

input:focus {
  outline: 0;
}

a {
  text-decoration: none;
}

ul {
  list-style: none;
}

input[type="submit"]{
  display: block;
  margin: 0 auto;
  width: 50%;
  height: 50px;
  font-family: Helvetica;
  border-bottom: 5px solid steelblue;
  border-top: none;
  border-left: none;
  border-right: none;
  background: linear-gradient(#5FDDFF,#53ADDF);
  color: white;
  border-radius: 10px;
  box-shadow: 0px 2px 10px grey;
  transition: 150ms ease;
  font-weight: bold;
}

input[type="submit"]:active{
  border: none;
  border-bottom: 2px solid steelblue;
  box-shadow: 0px 1px 5px grey;
  background: linear-gradient(#53AFFF,#5FCDFF);
  color: #FFF;
}

.btn-3d-sub {
  display: block;
  margin: 0 auto;
  width: 50%;
  height: 50px;
  font-family: Helvetica;
  border-bottom: 5px solid #173814;
  border-top: none;
  border-left: none;
  border-right: none;
  background: linear-gradient(#469e3f,#255b20);
  color: white;
  border-radius: 10px;
  box-shadow: 0px 2px 10px grey;
  transition: 150ms ease;
  text-align: center;
  line-height: 50px;
  font-weight: bold;
}

.btn-3d-sub:active {
  border: none;
  border-bottom: 2px solid steelblue;
  box-shadow: 0px 1px 5px grey;
  background: linear-gradient(#255b20,#469e3f);
  color: #FFF;
}

.btn-3d-can {
  display: block;
  margin: 0 auto;
  width: 50%;
  height: 50px;
  font-family: Helvetica;
  border-bottom: 5px solid #2d0707;
  border-top: none;
  border-left: none;
  border-right: none;
  background: linear-gradient(#991b1b,#490e0e);
  color: white;
  border-radius: 10px;
  box-shadow: 0px 2px 10px grey;
  transition: 150ms ease;
  text-align: center;
  line-height: 50px;
  font-weight: bold;
}

.btn-3d-can:active {
  border: none;
  border-bottom: 2px solid #490e0e;
  box-shadow: 0px 1px 5px grey;
  background: linear-gradient(#490e0e,#991b1b);
  color: #FFF;
}





}

`

export default NewButtonColored;