import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadScript } from "@react-google-maps/api";
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
  CardHeader,
  Avatar,
  IconButton,
} from "@mui/material";
import DirectionsIcon from "@mui/icons-material/Directions";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
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
      const locationTimeout = setTimeout(() => {
        // Fallback if location takes too long
        setUserLocation(defaultCenter);
        fetchResources(defaultCenter);
      }, 5000); // Timeout after 5 seconds

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(locationTimeout); // Clear timeout if location is fetched
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("User location fetched successfully:", userPos);
          setUserLocation(userPos);
          fetchResources(userPos);
        },
        (error) => {
          console.error("Error getting user location:", error);
          clearTimeout(locationTimeout); // Ensure timeout is cleared
          setUserLocation(defaultCenter); // Fallback to default center
          fetchResources(defaultCenter);
        }
      );
    } else if (isLoaded) {
      setUserLocation(defaultCenter); // Fallback if geolocation isn't supported
      fetchResources(defaultCenter);
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

    const resourceRequests = placeTypes.map((place) => {
      return new Promise((resolve) => {
        const request = {
          location,
          radius: "10000", // Increased radius to 10 km
          type: place.type,
        };

        service.nearbySearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            console.log(`Results for ${place.name}:`, results);
            resolve({ [place.name]: results?.length > 0 ? results[0] : null });
          } else {
            resolve({ [place.name]: null });
          }
        });
      });
    });

    Promise.all(resourceRequests)
      .then((results) => {
        const fetchedResources = results.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {});
        setResources(fetchedResources);
        setLoading(false); // Ensure loading stops after fetching resources
      })
      .catch((error) => {
        console.error("Error fetching resources:", error);
        setLoading(false);
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

  // Handle loading and error cases
  if (loadError) return <div>Error loading maps</div>;
  if (loading || !isLoaded || !userLocation) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: { xs: "1rem", sm: "2rem" },
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ marginTop: 2, color: "#6A1B9A" }}
      >
        Welcome To Sweekar
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ marginBottom: 4 }}>
        Empowering Communities With Valuable Resources
      </Typography>

      <Grid
        container
        justifyContent="center"
        spacing={2}
        sx={{ marginBottom: { xs: 8, sm: 14 } }}
      >
        <Grid item>
          <Card
            onClick={() => navigate("/women-resources")}
            sx={{
              width: "150px",
              height: "150px",
              backgroundColor: "#EC407A",
              boxShadow: "0 4px 4px rgba(0, 0, 0, 0.5)",
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
        </Grid>

        <Grid item>
          <Card
            onClick={() => navigate("/lgbtqia-resources")}
            sx={{
              width: "150px",
              height: "150px",
              backgroundColor: "#FFA726",
              boxShadow: "0 4px 4px rgba(0, 0, 0, 0.5)",
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
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
        sx={{ justifyContent: "center", flexWrap: "wrap" }}
      >
        {Object.entries(resources).map(([resourceType, resource], index) =>
          resource ? (
            <Grid item key={index} xs={12} sm={6} md={2}>
              <Card
                sx={{
                  maxWidth: 345,
                  margin: "auto",
                  borderRadius: "10px",
                  backgroundColor: "rgba(243, 239, 230, 1)",
                  boxShadow: "0 4px 4px rgba(0, 0, 0, 0.5)",
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "0.3s",
                  },
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar aria-label="resource" sx={{ bgcolor: "#8e24aa" }}>
                      {resource.name?.charAt(0)}
                    </Avatar>
                  }
                  title={resource?.name}
                />
                <CardMedia
                  component="img"
                  height="194"
                  image={
                    resource.photos
                      ? resource.photos[0].getUrl()
                      : "https://via.placeholder.com/400x300.png?text=No+Image+Available"
                  }
                  alt={resource.name}
                />
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
                    <IconButton
                      color="primary"
                      onClick={() => handleDirections(resource)}
                    >
                      <DirectionsIcon />
                    </IconButton>
                    <PhoneIcon />
                    <Typography variant="body2">
                      {resource.formatted_phone_number || "Not Available"}
                    </Typography>
                  </Box>

                  <Button
                    onClick={() => toggleExpand(index)}
                    endIcon={
                      expanded[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />
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
                      <strong>Full Address: </strong> {resource.vicinity}
                    </Typography>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ) : null
        )}
      </Grid>
    </Box>
  );
};

export default Home;
