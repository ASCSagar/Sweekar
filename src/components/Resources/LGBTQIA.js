import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  TextField,
  Typography,
  CardContent,
  CardActionArea,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PsychologyIcon from "@mui/icons-material/Psychology";
import GavelIcon from "@mui/icons-material/Gavel";
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import SpaIcon from "@mui/icons-material/Spa";
import ShieldIcon from "@mui/icons-material/Shield";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    key: "lgbtq_healthcare",
    name: "Healthcare",
    icon: <LocalHospitalIcon fontSize="large" />,
    description: "Inclusive healthcare services for LGBTQIA+ individuals.",
  },
  {
    key: "lgbtq_mentalhealth",
    name: "Mental Health",
    icon: <PsychologyIcon fontSize="large" />,
    description: "Emotional and psychological support for LGBTQIA+.",
  },
  {
    key: "lgbtq_legalaid",
    name: "Legal Aid",
    icon: <GavelIcon fontSize="large" />,
    description: "Legal assistance and resources for LGBTQIA+ rights.",
  },
  {
    key: "lgbtq_supportgroups",
    name: "Support Groups",
    icon: <GroupIcon fontSize="large" />,
    description: "Community support groups and peer support.",
  },
  {
    key: "lgbtq_education",
    name: "Education",
    icon: <SchoolIcon fontSize="large" />,
    description: "Educational resources and scholarships for LGBTQIA+.",
  },
  {
    key: "lgbtq_career",
    name: "Career",
    icon: <WorkIcon fontSize="large" />,
    description: "Career development and job support for LGBTQIA+ professionals.",
  },
  {
    key: "lgbtq_safety",
    name: "Safety",
    icon: <ShieldIcon fontSize="large" />,
    description: "Resources and support for safety and anti-violence.",
  },
  {
    key: "lgbtq_leadership",
    name: "Leadership",
    icon: <SupervisorAccountIcon fontSize="large" />,
    description: "Leadership programs and events for LGBTQIA+ individuals.",
  },
  {
    key: "lgbtq_wellness",
    name: "Wellness",
    icon: <SpaIcon fontSize="large" />,
    description: "Wellness programs and fitness activities for LGBTQIA+.",
  },
];

const LGBTQIA = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (category) => {
    navigate(`/lgbtqia-resources/${category.key}`);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{ color: "#6A1B9A", textAlign: "center", mb: 4 }}
      >
        LGBTQIA+ Resources
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "60%", borderRadius: "50px", backgroundColor: "#fff" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {filteredCategories.map((category, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardActionArea onClick={() => handleCategoryClick(category)}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Box sx={{ color: "#8e24aa", marginBottom: 1 }}>
                    {category.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "#6A1B9A", fontWeight: "bold" }}
                  >
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LGBTQIA;
