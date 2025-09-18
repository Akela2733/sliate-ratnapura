// src/App.js
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom"; // Added useLocation

// Public Pages
import Header from "./Components/Header"; // Corrected casing: Components -> components
import Footer from "./Components/Footer"; // Corrected casing: Components -> components
import Home from "./pages/Home";
import AboutUs from "./pages/About"; // Confirmed filename AboutUs.jsx
import Staff from "./pages/Staff";     
import Courses from "./pages/Courses";
import News from "./pages/News"; 
import Events from "./pages/Events"; 
import Contact from "./pages/Contact";
import CourseDetailPage from "./Components/CourseDetailPage"; // Corrected casing
import Login from "./pages/Login"; 

// Quick Access Pages
import Exams from "./pages/Exams";
import Results from "./pages/Results";
import LMS from "./pages/LMS";
import Portal from "./pages/Portal";

// Admin Pages and Layouts
import PrivateRoute from "./Components/PrivateRoute"; // Corrected casing
import AdminDashboardLayout from "./admin/layouts/AdminDashboardLayout"; 
import DashboardHome from "./admin/pages/DashboardHome"; 
import ManageCourses from "./pages/ManageCourses"; 
import AddCourse from "./pages/AddCourse"; 
import EditCourse from "./pages/EditCourse"; 
import ManageNews from "./pages/ManageNews"; 
import AddNews from "./pages/AddNews"; 
import EditNews from "./pages/EditNews"; 
import ManageEvents from "./pages/ManageEvents"; 
import AddEvent from "./pages/AddEvents"; // Corrected to AddEvent.jsx
import EditEvent from "./pages/EditEvents"; // Corrected to EditEvent.jsx
import StaffManagement from "./admin/pages/StaffManagement"; 
import ManageStudents from "./admin/pages/ManageStudents"; 
import StudentRegister from "./pages/StudentRegister";

// For Toast Notifications
import { ToastContainer } from 'react-toastify'; // This is the ONLY place ToastContainer should be imported and rendered
import 'react-toastify/dist/ReactToastify.css';

// Import AuthProvider to wrap the entire application
import { AuthProvider } from './context/AuthContext'; 

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    // <React.StrictMode> {/* Temporarily comment out StrictMode in index.js if issues persist in development */}
    <AuthProvider>
      {/* Render Header only if not on an admin route */}
      {!isAdminRoute && <Header />} 
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} /> 
        <Route path="/staff" element={<Staff />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/news" element={<News />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courses/:courseCode" element={<CourseDetailPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-student" element={<StudentRegister />} />

        {/* Quick Access Routes */}
        <Route path="/exams" element={<Exams />} />
        <Route path="/results" element={<Results />} />
        <Route path="/lms" element={<LMS />} />
        <Route path="/portal" element={<Portal />} />

        {/* Admin Protected Routes with Sidebar Layout */}
        {/* PrivateRoute now wraps AdminDashboardLayout, protecting the entire admin section */}
        <Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminDashboardLayout /></PrivateRoute>}>
          {/* Default view when navigating to /admin */}
          <Route index element={<DashboardHome />} /> 
          
          {/* Nested Admin Management Routes */}
          <Route path="manage-students" element={<ManageStudents />} />
          <Route path="manage-courses" element={<ManageCourses />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="edit-course/:id" element={<EditCourse />} />
          
          <Route path="manage-news" element={<ManageNews />} />
          <Route path="add-news" element={<AddNews />} />
          <Route path="edit-news/:id" element={<EditNews />} />
          
          <Route path="manage-events" element={<ManageEvents />} />
          <Route path="add-event" element={<AddEvent />} />
          <Route path="edit-event/:id" element={<EditEvent />} />
          
          <Route path="manage-staff" element={<StaffManagement />} />
        </Route>

        {/* Fallback - Redirect to home for any unmatched routes (404) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Render Footer only if not on an admin route */}
      {!isAdminRoute && <Footer />} 
      
      {/*
        IMPORTANT: This is the ONLY ToastContainer instance.
        It should be here, at a high level in the component tree,
        to ensure it's always mounted and correctly manages all toasts.
      */}
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
    </AuthProvider>
    // </React.StrictMode>
  );
};

export default App;
