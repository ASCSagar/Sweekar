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
import useMediaQuery from "@mui/material/useMediaQuery";
import logo from "../../images/logo.png";
import logo1 from "../../images/MCSLogo.png";
import { auth } from "../../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = () => {
  // Initialize Google Provider
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
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
        textAlign: "center",
        padding: isMobile ? 2 : 4,
      }}
    >
      <Avatar
        alt="Logo"
        src={logo1}
        sx={{
          width: isMobile ? 100 : 150,
          height: isMobile ? 100 : 150,
          border: "5px solid #e0e0e0",
          backgroundColor: "white",
          boxShadow: "0 4px 4px rgba(0, 0, 0, 0.5)",
        }}
      />
      <Typography
        variant="h5"
        component="div"
        sx={{ flexGrow: 1, mt: 2, mb: 2 }}
      >
        Initiative by Shree Maharani Chimnabai Stree Udyogalaya
      </Typography>
      <Card
        sx={{
          width: isMobile ? 300 : 400,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: isMobile ? 2 : 4,
          boxShadow: "0 4px 4px rgba(0, 0, 0, 0.5)",
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
              width: isMobile ? 100 : 150,
              height: isMobile ? 100 : 150,
              marginBottom: 3,
              border: "5px solid #e0e0e0",
              backgroundColor: "white",
              boxShadow: "0 4px 4px rgba(0, 0, 0, 0.5)",
            }}
          />

          <Typography variant="h5" gutterBottom>
            Welcome To Sweekar
          </Typography>
        </CardContent>

        <CardActions sx={{ justifyContent: "center" }}>
          <Button
            color="primary"
            variant="outlined"
            onClick={handleGoogleSignIn}
          >
            Sign In With Google
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
