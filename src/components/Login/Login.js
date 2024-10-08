import React, { useEffect, useState } from "react";
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
import { auth, signInWithPopup, googleProvider } from "../../firebase";

const Login = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Function to handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User Info:", result.user);
      navigate("/");
    } catch (error) {
      console.error("Error during sign in:", error);
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
      {/* Card for the login content */}
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
          {/* Logo at the center */}
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
            Welcome to Sweekar
          </Typography>
          <Typography variant="body1" gutterBottom>
            Please sign in to continue
          </Typography>
        </CardContent>

        {/* Google Sign-In Button */}
        <CardActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoogleLogin}
            sx={{ width: "200px", height: "50px" }}
          >
            Sign in with Google
          </Button>
        </CardActions>
      </Card>

      {/* Install PWA Button */}
      {showInstallButton && (
        <Button
          variant="outlined"
          color="success"
          onClick={handleInstallClick}
          sx={{ mt: 3 }}
        >
          Install App
        </Button>
      )}
    </Box>
  );
};

export default Login;
