import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { BookOpenText, GraduationCap, Users, MessageSquare, LogIn, Loader2, XCircle, ExternalLink, CalendarDays, Clock, MapPin, CircleCheck } from 'lucide-react';

// CSS for react-toastify, embedded as a string to avoid import errors
const toastifyCSS = `
.Toastify__toast-container {
  z-index: 9999;
  position: fixed;
  padding: 4px;
  width: 320px;
  box-sizing: border-box;
  color: #fff;
}
.Toastify__toast-container--top-left {
  top: 1em;
  left: 1em;
}
.Toastify__toast-container--top-center {
  top: 1em;
  left: 50%;
  transform: translateX(-50%);
}
.Toastify__toast-container--top-right {
  top: 1em;
  right: 1em;
}
.Toastify__toast-container--bottom-left {
  bottom: 1em;
  left: 1em;
}
.Toastify__toast-container--bottom-center {
  bottom: 1em;
  left: 50%;
  transform: translateX(-50%);
}
.Toastify__toast-container--bottom-right {
  bottom: 1em;
  right: 1em;
}
.Toastify__toast-container--rtl {
  left: initial;
  right: 1em;
}
.Toastify__toast-container--rtl {
  right: initial;
  left: 1em;
}
.Toastify__toast {
  position: relative;
  min-height: 64px;
  box-sizing: border-box;
  margin-bottom: 1rem;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: sans-serif;
  cursor: pointer;
  direction: ltr;
}
.Toastify__toast--rtl {
  direction: rtl;
}
.Toastify__toast-body {
  margin: auto 0;
  display: flex;
  align-items: center;
  flex: 1;
}
.Toastify__toast-body > div:last-child {
  flex: 1;
}
.Toastify--animate {
  animation-duration: 0.7s;
  animation-fill-mode: both;
}
@keyframes Toastify__bounceInRight {
  from, 60%, 75%, 90%, to {
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }
  from {
    opacity: 0;
    transform: translate3d(3000px, 0, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(-25px, 0, 0);
  }
  75% {
    transform: translate3d(10px, 0, 0);
  }
  90% {
    transform: translate3d(-5px, 0, 0);
  }
  to {
    transform: none;
  }
}
.Toastify__bounceIn--right {
  animation-name: Toastify__bounceInRight;
}
@keyframes Toastify__bounceInLeft {
  from, 60%, 75%, 90%, to {
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }
  from {
    opacity: 0;
    transform: translate3d(-3000px, 0, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(25px, 0, 0);
  }
  75% {
    transform: translate3d(-10px, 0, 0);
  }
  90% {
    transform: translate3d(5px, 0, 0);
  }
  to {
    transform: none;
  }
}
.Toastify__bounceIn--left {
  animation-name: Toastify__bounceInLeft;
}
@keyframes Toastify__bounceInUp {
  from, 60%, 75%, 90%, to {
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }
  from {
    opacity: 0;
    transform: translate3d(0, 3000px, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(0, -20px, 0);
  }
  75% {
    transform: translate3d(0, 10px, 0);
  }
  90% {
    transform: translate3d(0, -5px, 0);
  }
  to {
    transform: translate3d(0,0,0);
  }
}
.Toastify__bounceIn--top {
  animation-name: Toastify__bounceInUp;
}
@keyframes Toastify__bounceOutRight {
  20% {
    opacity: 1;
    transform: translate3d(-20px, 0, 0);
  }
  to {
    opacity: 0;
    transform: translate3d(2000px, 0, 0);
  }
}
.Toastify__bounceOut--right {
  animation-name: Toastify__bounceOutRight;
}
@keyframes Toastify__bounceOutLeft {
  20% {
    opacity: 1;
    transform: translate3d(20px, 0, 0);
  }
  to {
    opacity: 0;
    transform: translate3d(-2000px, 0, 0);
  }
}
.Toastify__bounceOut--left {
  animation-name: Toastify__bounceOutLeft;
}
@keyframes Toastify__bounceOutDown {
  20% {
    opacity: 1;
    transform: translate3d(0, -20px, 0);
  }
  to {
    opacity: 0;
    transform: translate3d(0, 2000px, 0);
  }
}
.Toastify__bounceOut--top {
  animation-name: Toastify__bounceOutDown;
}
@keyframes Toastify__bounceOutUp {
  20% {
    opacity: 1;
    transform: translate3d(0, 20px, 0);
  }
  to {
    opacity: 0;
    transform: translate3d(0, -2000px, 0);
  }
}
.Toastify__bounceOut--bottom {
  animation-name: Toastify__bounceOutUp;
}
.Toastify__bounceIn--down {
  animation-name: Toastify__bounceInUp;
}
.Toastify__bounceIn--bottom {
  animation-name: Toastify__bounceInUp;
}
.Toastify__toast-theme--light {
  background: #fff;
  color: #333;
}
.Toastify__toast-theme--dark {
  background: #2a2a2a;
  color: #fff;
}
.Toastify__toast-theme--colored.Toastify__toast--default {
  background: #fff;
  color: #333;
}
.Toastify__toast-theme--colored.Toastify__toast--info {
  background: #3498db;
}
.Toastify__toast-theme--colored.Toastify__toast--success {
  background: #07bc0c;
}
.Toastify__toast-theme--colored.Toastify__toast--warning {
  background: #f1c40f;
}
.Toastify__toast-theme--colored.Toastify__toast--error {
  background: #e74c3c;
}
.Toastify__toast--default {
  background: #fff;
  color: #aaa;
}
.Toastify__progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  transform-origin: left;
}
.Toastify__progress-bar--animated {
  animation: Toastify__progressBar 4s linear;
}
@keyframes Toastify__progressBar {
  0% {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}
.Toastify__progress-bar--default {
  background: linear-gradient(to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55);
}
.Toastify__progress-bar--dark {
  background: #909090;
}
.Toastify__progress-bar--info {
  background: #3498db;
}
.Toastify__progress-bar--success {
  background: #07bc0c;
}
.Toastify__progress-bar--warning {
  background: #f1c40f;
}
.Toastify__progress-bar--error {
  background: #e74c3c;
}
`;

// Create AuthContext
const AuthContext = createContext();

// Create AuthProvider component
const AuthProvider = ({ children }) => {
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

const LMS = () => {
  const { isAuthenticated, user, loading: authLoading, logout } = useContext(AuthContext);
  const [studentProfile, setStudentProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventsError, setEventsError] = useState(null);

  const lmsFeatures = [
    { icon: BookOpenText, title: "Rich Course Content", description: "Access lecture notes, videos, and supplementary materials anytime, anywhere." },
    { icon: Users, title: "Collaborative Learning", description: "Engage with peers and instructors through forums and group activities." },
    { icon: GraduationCap, title: "Progress Tracking", description: "Monitor your learning journey and track your assignment submissions." },
    { icon: MessageSquare, title: "Direct Communication", description: "Communicate with instructors and classmates seamlessly." },
  ];

  // Fetch student profile and enrolled subjects based on auth state
  useEffect(() => {
    const fetchStudentCourses = async () => {
      // Wait for the auth context to finish its initial loading check
      if (authLoading) return;

      // If not authenticated or not a student, stop and set appropriate state
      if (!isAuthenticated || user?.role !== 'student') {
        setStudentProfile(null);
        setLoading(false);
        setError("Please log in as a student to view your courses.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Axios is already configured with the token from AuthContext
        const res = await axios.get("http://localhost:5000/api/students/me");
        setStudentProfile(res.data);
      } catch (err) {
        console.error("Error fetching student courses:", err.response ? err.response.data : err.message);
        setError(err.response?.data?.message || "Failed to load your courses. Please try again.");
        toast.error(err.response?.data?.message || "Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentCourses();
  }, [isAuthenticated, user, authLoading]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true);
      setEventsError(null);
      try {
        const res = await axios.get('http://localhost:5000/api/events');
        setEvents(res.data.events);
      } catch (err) {
        console.error("Failed to fetch upcoming events:", err);
        setEventsError("Failed to load events. Please try again later.");
        toast.error("Failed to load upcoming events.");
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getCourseImage = (subjectCode) => {
    const hash = subjectCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = ['E0F2F7', 'F7E0F2', 'F2F7E0', 'E7F7F0'];
    const textColor = '0A174E';
    const imgIndex = hash % colors.length;
    return `https://placehold.co/400x250/${colors[imgIndex]}/${textColor}?text=${subjectCode.replace('/', '%2F')}`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <style>{toastifyCSS}</style>
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Hero Section */}
        <div className="relative bg-[#1C3AA9] text-white p-8 sm:p-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            <GraduationCap className="inline-block w-10 h-10 sm:w-12 sm:h-12 mr-3 align-middle" />
            Learning Management System
          </h1>
          <p className="text-lg sm:text-xl font-light max-w-2xl mx-auto opacity-90">
            Your gateway to a dynamic and interactive online learning experience.
          </p>
          <div className="absolute inset-0 bg-pattern-grid opacity-10"></div>
        </div>

        {/* Your Enrolled Courses Section */}
        <section className="p-8 sm:p-10 lg:p-12">
          <h2 className="text-3xl font-bold text-[#0A174E] mb-8 text-center sm:text-left">
            Your Enrolled Courses
          </h2>

          {loading || authLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
              <p className="ml-3 text-lg text-gray-600">Loading your courses...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-xl text-red-600">{error}</p>
              {!isAuthenticated && (
                <button
                  onClick={() => window.location.href = '/login'}
                  className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  <LogIn className="w-5 h-5 mr-2" /> Go to Login
                </button>
              )}
            </div>
          ) : (
            <>
              {studentProfile?.enrolledSubjects && studentProfile.enrolledSubjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {studentProfile.enrolledSubjects.map(subject => (
                    <div key={subject._id} className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <img src={getCourseImage(subject.code)} alt={subject.name} className="w-full h-40 object-cover" />
                      <div className="p-5">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{subject.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">Code: {subject.code}</p>
                        <p className="text-sm text-gray-600 mb-3">Department: {subject.department}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <p className="text-sm text-gray-600">Progress: Not Tracked Yet</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-xl text-gray-600">You are not currently enrolled in any subjects.</p>
                  <p className="text-md text-gray-500 mt-2">Please contact your department for enrollment details.</p>
                </div>
              )}
              <div className="text-center mt-10">
                <a
                  href="https://www.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300 transform hover:scale-105"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Go to External LMS Website
                </a>
              </div>
            </>
          )}
        </section>

        {/* Upcoming Events Section */}
        <section className="p-8 sm:p-10 lg:p-12 border-t border-gray-200 bg-gray-50">
          <h2 className="text-3xl font-bold text-[#0A174E] mb-8 text-center sm:text-left">
            Upcoming Events
          </h2>
          {eventsLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="ml-3 text-lg text-gray-600">Loading events...</p>
            </div>
          ) : eventsError ? (
            <div className="text-center py-10">
              <XCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
              <p className="text-xl text-red-600">{eventsError}</p>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <div key={event._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-lg font-semibold text-[#0A174E] mb-2 flex items-center">
                    <CircleCheck className="w-5 h-5 text-green-600 mr-2" /> {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1 flex items-center">
                    <CalendarDays className="w-4 h-4 text-gray-400 mr-2" /> {formatDate(event.date)}
                  </p>
                  <p className="text-sm text-gray-600 mb-1 flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" /> {event.time}
                  </p>
                  <p className="text-sm text-gray-700 mb-4 flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" /> {event.location}
                  </p>
                  <p className="text-sm text-gray-700">{event.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600">No upcoming events at the moment.</p>
            </div>
          )}
        </section>

        {/* LMS Features Section */}
        <section className="bg-white p-8 sm:p-10 lg:p-12 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-[#0A174E] mb-8 text-center">
            Why Use Our LMS?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {lmsFeatures.map((feature, index) => (
              <div key={index} className="flex items-start bg-gray-50 p-6 rounded-xl shadow-md">
                <feature.icon className="w-10 h-10 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const App = () => (
    <>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <AuthProvider>
        <LMS />
      </AuthProvider>
    </>
);

export default App;
