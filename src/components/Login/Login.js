import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import logo from "../../images/logo.png";
import { auth } from "../../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = () => {
  // Initialize Google Provider
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Function to handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      console.log("----token---->", token);
      console.log("User Info:", result.user);
      toast.success("Login Successful");
      navigate("/");
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      console.error(
        "Error during Google Sign-In:",
        errorCode,
        errorMessage,
        email
      );
    }
  };

  // Listen for the 'beforeinstallprompt' event
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event); // Save the event for later use
      setShowInstallButton(true); // Show install button
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
  }, []);

  // Function to handle PWA installation
  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
        setShowInstallButton(false);
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        bgcolor: "#f5f5f5",
        padding: 2,
      }}
    >
      <Card
        sx={{
          width: 400,
          borderRadius: 3,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
          backgroundColor: "white",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            alt="Logo"
            src={logo}
            sx={{
              width: 150,
              height: 150,
              marginBottom: 3,
              border: "5px solid #e0e0e0",
              backgroundColor: "white",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            }}
          />

          <Typography variant="h4" gutterBottom>
            Welcome To Sweekar
          </Typography>
          <Typography variant="body1" gutterBottom>
            Please SignIn To Continue
          </Typography>
        </CardContent>

        <CardActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "200px", height: "50px" }}
            onClick={handleGoogleSignIn}
          >
            SignIn With Google
          </Button>
        </CardActions>
      </Card>

      {showInstallButton && (
        <Button
          variant="outlined"
          color="success"
          sx={{ mt: 3 }}
          onClick={handleInstallClick}
        >
          Install App
        </Button>
      )}
    </Box>
  );
};

export default Login;
