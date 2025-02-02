import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');  // Assuming you're storing the JWT token in localStorage

  if (!token) {
    // If there is no token, redirect to login page
    return <Navigate to="/login" />;
  }

  return children; // Otherwise, render the child components (Dashboard)
};

export default PrivateRoute;