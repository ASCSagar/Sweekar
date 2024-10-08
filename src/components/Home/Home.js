import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  CardMedia,
  Grid,
  Collapse,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DirectionsIcon from "@mui/icons-material/Directions";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

const placeTypes = [
  { name: "Police Station", type: "police" },
  { name: "Private Hospital", type: "hospital" },
  { name: "Government Hospital", type: "hospital" },
  { name: "Blood Bank", type: "blood_bank" },
  { name: "Bus Stop", type: "bus_station" },
];

const Home = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [resources, setResources] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({}); // Track expansion state for each card
  const navigate = useNavigate();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (navigator.geolocation && isLoaded) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          fetchResources(userPos);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setUserLocation(defaultCenter);
          fetchResources(defaultCenter);
        }
      );
    }
  }, [isLoaded]);

  const fetchResources = (location) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps library is not loaded!");
      setLoading(false);
      return;
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    const fetchedResources = {};

    placeTypes.forEach((place) => {
      const request = {
        location,
        radius: "10000", // Increased radius to 10 km
        type: place.type,
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          fetchedResources[place.name] = results.length > 0 ? results[0] : null; // Store the nearest result
        }
        if (Object.keys(fetchedResources).length === placeTypes.length) {
          setResources(fetchedResources);
          setLoading(false);
        }
      });
    });
  };

  const handleDirections = (resource) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${
      userLocation.lat
    },${
      userLocation.lng
    }&destination=${resource.geometry.location.lat()},${resource.geometry.location.lng()}`;
    window.open(url, "_blank");
  };

  const toggleExpand = (index) => {
    setExpanded((prevState) => ({ ...prevState, [index]: !prevState[index] }));
  };

  if (loadError) return <div>Error loading maps</div>;
  if (loading || !isLoaded)
    return (
      <Box sx={{ textAlign: "center", marginTop: 5 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "2rem",
        backgroundColor: "#f5f5f5",
        height: "100vh",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ marginTop: 4, color: "#6A1B9A" }}
      >
        Welcome to Sweekar
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ marginBottom: 4 }}>
        Empowering communities with valuable resources
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: 14,
        }}
      >
        <Card
          onClick={() => navigate("/women-resources")}
          sx={{
            width: "150px",
            height: "150px",
            backgroundColor: "#EC407A",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              transform: "scale(1.05)",
              transition: "0.3s",
            },
          }}
        >
          <CardContent>
            <Typography variant="h5">Women</Typography>
          </CardContent>
        </Card>

        <Card
          onClick={() => navigate("/lgbtqia-resources")}
          sx={{
            width: "150px",
            height: "150px",
            backgroundColor: "#FFA726",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              transform: "scale(1.05)",
              transition: "0.3s",
            },
          }}
        >
          <CardContent>
            <Typography variant="h5">LGBTQIA+</Typography>
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={2} justifyContent="center">
        {Object.entries(resources).map(
          ([resourceType, resource], index) =>
            resource && (
              <Grid item key={index}>
                <Card
                  sx={{
                    width: { xs: "200px", md: "300px" },
                    height: "auto",
                    borderRadius: "16px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "0.3s",
                    },
                  }}
                >
                  {resource.photos ? (
                    <CardMedia
                      component="img"
                      height="140"
                      image={`${resource.photos[0].getUrl({
                        maxHeight: 300,
                        maxWidth: 400,
                      })}`}
                      alt={resource.name}
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      height="140"
                      image="https://via.placeholder.com/400x300.png?text=No+Image+Available"
                      alt={resource.name}
                    />
                  )}
                  <CardContent>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {resourceType}
                      </Typography>
                      <Typography variant="body2">{resource.name}</Typography>
                    </Box>

                    <Divider />
                    <Box
                      sx={{
                        mt: 1,
                        gap: "10px",
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <PlaceIcon sx={{ color: "red" }} />
                      <DirectionsIcon
                        color="primary"
                        onClick={() => handleDirections(resource)}
                      />
                      <PhoneIcon />{" "}
                      {resource.formatted_phone_number
                        ? `${resource.formatted_phone_number}`
                        : "Not Available"}
                    </Box>

                    <Button
                      onClick={() => toggleExpand(index)}
                      endIcon={
                        expanded[index] ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )
                      }
                      sx={{ mt: 2, color: "#6A1B9A" }}
                    >
                      {expanded[index] ? "Show Less" : "More Details"}
                    </Button>

                    <Collapse in={expanded[index]} timeout="auto" unmountOnExit>
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, textAlign: "left" }}
                      >
                        <strong>Full Address : </strong> {resource.vicinity}
                      </Typography>
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            )
        )}
      </Grid>

      <GoogleMap center={userLocation || defaultCenter} zoom={14} />
    </Box>
  );
};

export default Home;
