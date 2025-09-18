// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; 

// Create AuthContext
const AuthContext = createContext();

// Create AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Stores user data (e.g., id, username, role)
  const [loading, setLoading] = useState(true); // To manage initial loading state

  // Function to decode JWT (simplified for client-side, consider a library like 'jwt-decode')
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error decoding token:", e);
      return null;
    }
  };

  // Check token on component mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = decodeToken(token);
          // Check if token exists, is decoded, and not expired
          if (decoded && decoded.exp * 1000 > Date.now()) { 
            setIsAuthenticated(true);
            // Ensure the user object is correctly structured as expected by your app
            // The decoded token payload itself often contains the user object directly
            setUser(decoded.user); // Set user data from the decoded token's 'user' field
            axios.defaults.headers.common['x-auth-token'] = token; 
          } else {
            localStorage.removeItem('token'); 
            setIsAuthenticated(false);
            setUser(null);
            delete axios.defaults.headers.common['x-auth-token'];
          }
        } catch (err) {
          console.error("Token validation failed:", err);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
          delete axios.defaults.headers.common['x-auth-token'];
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Login function
  // Updated to accept an object for credentials to handle both email/password and regNumber/password
  const login = async (credentials) => {
    try {
      // Determine the correct login endpoint based on credentials (e.g., if it has registrationNumber)
      const loginEndpoint = credentials.registrationNumber 
        ? 'http://localhost:5000/api/student-auth/login' 
        : 'http://localhost:5000/api/auth/login'; // Default for admin/general users

      const res = await axios.post(loginEndpoint, credentials);
      const { token, user: userData } = res.data; // Destructure 'user' as 'userData' to avoid conflict

      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      setUser(userData); // Set user data received from the backend
      axios.defaults.headers.common['x-auth-token'] = token;
      toast.success("Login successful!");
      return true; 
    } catch (err) {
      console.error("Login failed:", err.response ? err.response.data : err.message);
      const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(msg);
      setIsAuthenticated(false);
      setUser(null);
      delete axios.defaults.headers.common['x-auth-token'];
      return false; 
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    delete axios.defaults.headers.common['x-auth-token'];
    toast.info("Logged out successfully.");
  };

  // Context value to be provided to consumers
  const contextValue = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
