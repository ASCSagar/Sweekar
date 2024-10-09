import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { auth } from "../../firebase";

const Header = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const showBackButton = location.pathname !== "/" && user;

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user ? user : null);
    });
    return () => unsubscribe();
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutDialogOpen = () => {
    setLogoutDialogOpen(true);
    handleClose();
  };

  const handleLogoutDialogClose = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
    handleLogoutDialogClose();
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <AppBar position="sticky" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {showBackButton && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={handleBack}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sweekar
          </Typography>
          {user && (
            <>
              {isMobile ? (
                <div>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    keepMounted
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => navigate("/")}>Home</MenuItem>
                    <MenuItem onClick={() => navigate("/women-resources")}>
                      Women Resources
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/lgbtqia-resources")}>
                      LGBTQIA Resources
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/profile")}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogoutDialogOpen}>Logout</MenuItem>{" "}
                  </Menu>
                </div>
              ) : (
                <>
                  <Button color="inherit" onClick={() => navigate("/")}>
                    Home
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/women-resources")}
                  >
                    Women Resources
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/lgbtqia-resources")}
                  >
                    LGBTQIA Resources
                  </Button>
                  <Button color="inherit" onClick={() => navigate("/profile")}>
                    Profile
                  </Button>
                  <Button color="inherit" onClick={handleLogoutDialogOpen}>
                    Logout
                  </Button>
                </>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      <Dialog open={logoutDialogOpen} onClose={handleLogoutDialogClose}>
        <DialogTitle sx={{ bgcolor: "#f5f5f5", color: "#333" }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          Are you sure you want to log out?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
