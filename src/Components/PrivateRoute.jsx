// src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // Import your AuthContext

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  if (loading) {
    // Still checking authentication status, show a loading indicator or null
    return <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700">Loading user session...</p>
    </div>;
  }

  if (!isAuthenticated) {
    // Not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If a required role is specified, check if the user has that role
  if (requiredRole && (!user || user.role !== requiredRole)) {
    // User is authenticated but doesn't have the required role
    // Redirect to home or an unauthorized page
    return <Navigate to="/" replace />; // Or to a specific /unauthorized page
  }

  // Authenticated (and has required role if specified), render the children
  return children;
};

export default PrivateRoute;