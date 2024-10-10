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
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
    description:
      "Career development and job support for LGBTQIA+ professionals.",
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (category) => {
    navigate(`/lgbtqia-resources/${category.key}`);
  };

  return (
    <Box sx={{ padding: { xs: 2, sm: 4 } }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{
          textAlign: "center",
          color: "#6A1B9A",
          marginBottom: { xs: 2, sm: 4 },
        }}
      >
        LGBTQIA+ Resources
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: { xs: 2, sm: 4 },
        }}
      >
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
                <SearchIcon sx={{ color: "gray" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={2} justifyContent="center">
        {filteredCategories.map((category, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                },
                backgroundColor: "rgba(243, 239, 230, 1)",
                boxShadow: "0 4px 4px rgba(0, 0, 0, 0.5)",
                borderRadius: "12px",
              }}
            >
              <CardActionArea onClick={() => handleCategoryClick(category)}>
                <CardContent
                  sx={{ textAlign: "center", padding: { xs: 2, sm: 3 } }}
                >
                  <Box sx={{ color: "#8e24aa", marginBottom: 1 }}>
                    {React.cloneElement(category.icon, {
                      fontSize: "inherit",
                      sx: { fontSize: { xs: 40, sm: 50 } },
                    })}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#6A1B9A",
                      fontWeight: "bold",
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                  >
                    {category.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="black"
                    sx={{
                      marginTop: 1,
                      fontSize: { xs: "0.8rem", sm: "0.9rem" },
                    }}
                  >
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
