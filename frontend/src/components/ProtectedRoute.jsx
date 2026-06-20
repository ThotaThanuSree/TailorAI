import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/api';

const ProtectedRoute = ({ children }) => {
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    // User not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
