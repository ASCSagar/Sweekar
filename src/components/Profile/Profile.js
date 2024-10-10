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
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { auth } from "../../firebase";
import { getDatabase, ref, onValue, set } from "firebase/database";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import WcIcon from "@mui/icons-material/Wc";
import CakeIcon from "@mui/icons-material/Cake";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const Profile = () => {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [likedResources, setLikedResources] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const likesRef = ref(db, "likes");
      const profileRef = ref(db, `users/${user.uid}/profile`);

      const unsubscribeLikes = onValue(likesRef, (snapshot) => {
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
      });

      const unsubscribeProfile = onValue(profileRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProfileData(data);
        } else {
          setProfileData(null);
        }
        setLoading(false);
      });

      return () => {
        unsubscribeLikes();
        unsubscribeProfile();
      };
    }
  }, [user]);

  const handleSaveProfile = (newProfileData) => {
    const db = getDatabase();
    const profileRef = ref(db, `users/${user.uid}/profile`);
    set(profileRef, newProfileData)
      .then(() => {
        setProfileData(newProfileData);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error saving profile data:", error);
      });
  };

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
              position: "relative",
            }}
          >
            <Button
              onClick={() => setIsEditing(true)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                },
              }}
            >
              Update Profile
            </Button>

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
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List
                  sx={{
                    display: "flex",
                    flexWrap: {
                      xs: "wrap",
                      md: "nowrap",
                    },
                    gap: 2,
                    padding: 0,
                    overflowX: "auto",
                  }}
                >
                  <ProfileListItem
                    icon={<PersonIcon />}
                    primary="Name"
                    secondary={user.displayName}
                  />
                  <ProfileListItem
                    icon={<EmailIcon />}
                    primary="Email"
                    secondary={user.email}
                  />
                  {profileData && (
                    <>
                      <ProfileListItem
                        icon={<PhoneIcon />}
                        primary="Phone Number"
                        secondary={profileData.phoneNumber}
                      />
                      <ProfileListItem
                        icon={<LocalHospitalIcon />}
                        primary="Blood Group"
                        secondary={profileData.bloodGroup}
                      />
                      <ProfileListItem
                        icon={<LocationCityIcon />}
                        primary="City"
                        secondary={profileData.city}
                      />
                      <ProfileListItem
                        icon={<WcIcon />}
                        primary="Gender"
                        secondary={profileData.gender}
                      />
                      <ProfileListItem
                        icon={<CakeIcon />}
                        primary="Date of Birth"
                        secondary={profileData.dateOfBirth}
                      />
                    </>
                  )}
                </List>
              )}
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
                      <ListItemText
                        color="#f50057"
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

      <Dialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <ProfileForm
            initialData={profileData}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
            user={user}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

const ProfileListItem = ({ icon, primary, secondary }) => (
  <ListItem>
    <ListItemAvatar>
      <Avatar
        sx={{
          color: "#8e24aa",
          backgroundColor: "rgba(243, 239, 230, 1)",
          border: "2px solid #8e24aa",
        }}
      >
        {icon}
      </Avatar>
    </ListItemAvatar>
    <ListItemText primary={primary} secondary={secondary} />
  </ListItem>
);

const ProfileForm = ({ initialData, onSave, onCancel, user }) => {
  const [formData, setFormData] = useState({
    name: user.displayName || initialData?.name || "",
    phoneNumber: initialData?.phoneNumber || "",
    email: user.email || initialData?.email || "",
    bloodGroup: initialData?.bloodGroup || "",
    city: initialData?.city || "",
    gender: initialData?.gender || "",
    dateOfBirth: initialData?.dateOfBirth || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Blood Group"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <DialogActions>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Grid>
      </Grid>
    </form>
  );
};

export default Profile;
