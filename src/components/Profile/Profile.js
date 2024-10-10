import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import { auth } from "../../firebase";
import { getDatabase, ref, onValue } from "firebase/database";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";

const Profile = () => {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [likedResources, setLikedResources] = useState([]);

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const likesRef = ref(db, "likes");

      const unsubscribe = onValue(
        likesRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const userLikedResources = Object.entries(data)
              .filter(
                ([_, resourceData]) =>
                  resourceData.users && resourceData.users.includes(user.uid)
              )
              .map(([resourceName, _]) => resourceName);
            setLikedResources(userLikedResources);
          } else {
            setLikedResources([]);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching liked resources:", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <Box sx={{ padding: { xs: "16px", sm: "32px" } }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card
            sx={{
              overflow: "hidden",
              borderRadius: "10px",
              backgroundColor: "rgba(243, 239, 230, 1)",
              boxShadow: "0 4px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                color: "white",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar
                alt={user.displayName || user.email}
                src={user.photoURL}
                sx={{
                  width: "120px",
                  height: "120px",
                  border: "4px solid white",
                  boxShadow: "0 4px 4px rgba(0, 0, 0, 0.5)",
                }}
              />
              <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold" }}>
                {user.displayName || "Anonymous User"}
              </Typography>
            </Box>
            <CardContent>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        color: "#8e24aa",
                        backgroundColor: "rgba(243, 239, 230, 1)",
                        border: "2px solid #8e24aa",
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Name"
                    secondary={user.displayName || "Not set"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        color: "#8e24aa",
                        backgroundColor: "rgba(243, 239, 230, 1)",
                        border: "2px solid #8e24aa",
                      }}
                    >
                      <EmailIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Email" secondary={user.email} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card
            sx={{
              overflow: "hidden",
              borderRadius: "10px",
              backgroundColor: "rgba(243, 239, 230, 1)",
              boxShadow: "0 4px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Liked Resources
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : likedResources.length > 0 ? (
                <List>
                  {likedResources.map((resource, index) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#f50057" }}>
                          <FavoriteIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText color="#f50057"
                        primary={resource}
                        secondary={`Liked Resource (${index + 1})`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Paper elevation={0} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                  >
                    You Haven't Liked Any Resources Yet.
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
