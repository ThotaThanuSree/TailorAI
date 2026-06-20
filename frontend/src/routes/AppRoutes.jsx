import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

// Authenticated Pages
import Dashboard from '../pages/Dashboard';
import UploadPhoto from '../pages/UploadPhoto';
import Measurements from '../pages/Measurements';
import FabricRecommendation from '../pages/FabricRecommendation';
import PatternGenerator from '../pages/PatternGenerator';
import History from '../pages/History';
import Profile from '../pages/Profile';

// Admin Page
import FabricManagement from '../pages/FabricManagement';

// Components & Layouts
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated Dashboard Routes */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload-photo" element={<UploadPhoto />} />
        <Route path="/enter-measurements" element={<Measurements />} />
        <Route path="/recommend-fabric" element={<FabricRecommendation />} />
        <Route path="/generate-pattern" element={<PatternGenerator />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/fabrics" element={<FabricManagement />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
