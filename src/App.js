import React from "react";
import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Header from "./components/Header/Header";
import Profile from "./components/Profile/Profile";
import LGBTQIAResources from "./components/Resources/LGBTQIA";
import WomenResources from "./components/Resources/WomenResources";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ResourceList from "./components/Resources/ResourceList/ResourceList";
import ResourceDetail from "./components/Resources/ResourceDetail/ResourceDetail";
import NotFound from "./components/NotFound/NotFound";

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <ToastContainer
        limit={1}
        theme="colored"
        autoClose={3000}
        position="top-center"
        className="toast-container"
      />
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/women-resources"
          element={
            <ProtectedRoute>
              <WomenResources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/women-resources/:category"
          element={
            <ProtectedRoute>
              <ResourceList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lgbtqia-resources"
          element={
            <ProtectedRoute>
              <LGBTQIAResources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lgbtqia-resources/:category"
          element={
            <ProtectedRoute>
              <ResourceList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources/:resourceId"
          element={
            <ProtectedRoute>
              <ResourceDetail />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
}

export default App;
