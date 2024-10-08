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
import SecurityIcon from "@mui/icons-material/Security";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import SpaIcon from "@mui/icons-material/Spa";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SupportIcon from "@mui/icons-material/Group";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HomeIcon from "@mui/icons-material/Home";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    key: "healthcare",
    name: "Healthcare",
    icon: <LocalHospitalIcon />,
    description: "Women health services and facilities",
  },
  {
    key: "mentalhealth",
    name: "Mental Health",
    icon: <PsychologyIcon />,
    description: "Emotional and psychological support",
  },
  {
    key: "legal",
    name: "Legal Aid",
    icon: <GavelIcon />,
    description: "Legal help for women in need",
  },
  {
    key: "safety",
    name: "Safety",
    icon: <SecurityIcon />,
    description: "Safety resources and emergency contacts",
  },
  {
    key: "childcare",
    name: "Childcare",
    icon: <ChildCareIcon />,
    description: "Childcare and support services",
  },
  {
    key: "education",
    name: "Education",
    icon: <SchoolIcon />,
    description: "Education programs and training",
  },
  {
    key: "career",
    name: "Career",
    icon: <WorkIcon />,
    description: "Career guidance and job support",
  },
  {
    key: "financial",
    name: "Financial",
    icon: <AttachMoneyIcon />,
    description: "Financial advice and grants",
  },
  {
    key: "leadership",
    name: "Leadership",
    icon: <TrendingUpIcon />,
    description: "Leadership programs and events",
  },
  {
    key: "wellness",
    name: "Wellness",
    icon: <SpaIcon />,
    description: "Women’s wellness and fitness",
  },
  {
    key: "support-groups",
    name: "Support Groups",
    icon: <SupportIcon />,
    description: "Support groups and community help",
  },
  {
    key: "fitness",
    name: "Fitness",
    icon: <FitnessCenterIcon />,
    description: "Fitness programs and activities",
  },
  {
    key: "housing",
    name: "Housing",
    icon: <HomeIcon />,
    description: "Housing support and shelters",
  },
  {
    key: "food-nutrition",
    name: "Food & Nutrition",
    icon: <RestaurantIcon />,
    description: "Food security and nutrition advice",
  },
];

const WomenResources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (category) => {
    navigate(`/women-resources/${category.key}`);
  };

  return (
    <Box sx={{ padding: { xs: 2, sm: 4 }, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{ textAlign: "center", color: "#6A1B9A", marginBottom: { xs: 2, sm: 4 } }}
      >
        Women Resources
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: { xs: 2, sm: 4 } }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: { xs: "100%", sm: "80%", md: "60%" },
            borderRadius: "50px",
            backgroundColor: "#ffffff",
          }}
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
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
              }}
            >
              <CardActionArea onClick={() => handleCategoryClick(category)}>
                <CardContent sx={{ textAlign: "center", padding: { xs: 2, sm: 3 } }}>
                  <Box sx={{ color: "#8e24aa", marginBottom: 1 }}>
                    {React.cloneElement(category.icon, {
                      fontSize: "inherit",
                      sx: { fontSize: { xs: 40, sm: 50 } },
                    })}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "#6A1B9A", fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.25rem" } }}
                  >
                    {category.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginTop: 1, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
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

export default WomenResources;
