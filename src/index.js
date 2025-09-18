// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom"; // Ensure BrowserRouter is imported
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider

// IMPORTANT: Remove ToastContainer import and rendering from here.
// import "react-toastify/dist/ReactToastify.css"; // Keep CSS import if needed elsewhere, but App.js handles it
// import { ToastContainer } from "react-toastify"; // REMOVE THIS IMPORT

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      {/* Router must wrap AuthProvider */}
      <AuthProvider>
        {/* App component is wrapped by AuthProvider */}
        <App />
        {/* REMOVE ToastContainer from here */}
        {/*
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        */}
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
