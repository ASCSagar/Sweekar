import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { auth } from "../../firebase";

const Profile = () => {
  const user = auth.currentUser;
  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ ml: 2 }}>
          My Profile
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Avatar
          alt={user.displayName || user.email}
          src={user.photoURL}
          sx={{ width: 80, height: 80, mr: { sm: 2 }, mb: { xs: 2, sm: 0 } }}
        />
        <Box>
          <Typography variant="h6">
            {user.displayName || "Anonymous User"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {user.email}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
