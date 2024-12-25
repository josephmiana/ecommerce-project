import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If no token exists, redirect to login
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.isAdmin) {
      // If the user is an admin, render the component
      return children;
    } else {
      // If the user is not an admin, redirect to home
      return <Navigate to="/" />;
    }
  } catch (error) {
    // If there's an error decoding the token, redirect to login
    console.error("Invalid token:", error);
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;
