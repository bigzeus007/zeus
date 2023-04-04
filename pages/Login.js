
import styles from "../styles/Login.module.css";
import { GoogleOutlined,  } from "@ant-design/icons";
import React, { useState } from "react";
import firebase from "firebase/compat/app";
import { auth } from "../firebase";
import { signInWithRedirect } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { Button, Card, Grid, Loading, Text } from "@nextui-org/react";

const provider = new GoogleAuthProvider();

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithRedirect(auth, provider);
    } catch (error) {
      setError(error.message);
    } finally {
     
      setLoading(false);
    }
  };
  
 
  return !loading?(
    <Grid.Container css={{position:"absolute",backgroundColor:"LimeGreen",height:"100%"}}>
    <Card >
     <Card.Header css={{backgroundColor:"SkyBlue"}}>
        <Text>Welcome to Babel</Text>
        {error && <Text >{error}</Text>}
        </Card.Header>
        <Card.Body css={{backgroundColor:"Gold"}}>
        <Button
          
          onPress={()=>handleGoogleSignIn()}
          disabled={loading}
        >
          <GoogleOutlined /> Sign In with Google
        </Button>
        </Card.Body>
        <Card.Footer css={{backgroundColor:"black"}}>
        
        {loading && <Text color="white" >Loading...</Text>}
        </Card.Footer>
      </Card>
      </Grid.Container>
  ):(<Grid.Container justify="center" css={{position:"absolute",top:"40%"}}><Text>Loading</Text><Loading size="xl"  type="points-opacity"></Loading></Grid.Container>);
};

export default Login;
