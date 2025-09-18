// src/pages/LMS.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
// FIX: Added XCircle to the import list
import { BookOpenText, GraduationCap, Users, MessageSquare, LogIn, Loader2, XCircle } from 'lucide-react'; // Icons
import AuthContext from '../context/AuthContext'; // Import AuthContext

const LMS = () => {
  const { isAuthenticated, user, loading: authLoading } = useContext(AuthContext);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lmsFeatures = [
    { icon: BookOpenText, title: "Rich Course Content", description: "Access lecture notes, videos, and supplementary materials anytime, anywhere." },
    { icon: Users, title: "Collaborative Learning", description: "Engage with peers and instructors through forums and group activities." },
    { icon: GraduationCap, title: "Progress Tracking", description: "Monitor your learning journey and track your assignment submissions." },
    { icon: MessageSquare, title: "Direct Communication", description: "Communicate with instructors and classmates seamlessly." },
  ];

  useEffect(() => {
    const fetchStudentCourses = async () => {
      if (authLoading) return; // Wait for AuthContext to finish loading

      if (!isAuthenticated || user?.role !== 'student') {
        // If not authenticated as a student, clear data and show message
        setStudentProfile(null);
        setLoading(false);
        setError("Please log in as a student to view your courses.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("Authentication token missing. Please log in.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/students/me", {
          headers: {
            'x-auth-token': token,
          },
        });
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
  }, [isAuthenticated, user, authLoading]); // Re-run when auth state changes

  // Placeholder for course images - you might want to fetch real images later
  const getCourseImage = (subjectCode) => {
    // Simple logic to return a consistent placeholder based on code
    const hash = subjectCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = ['E0F2F7', 'F7E0F2', 'F2F7E0', 'E7F7F0']; // Light pastel colors
    const textColor = '0A174E'; // Dark text
    const imgIndex = hash % colors.length;
    return `https://placehold.co/400x250/${colors[imgIndex]}/${textColor}?text=${subjectCode.replace('/', '%2F')}`;
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
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

        {/* Featured Courses Section */}
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
                  onClick={() => window.location.href = '/login'} // Simple redirect to login
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
                        {/* You can add progress bar here if you have progress data */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '0%' }}></div> {/* Placeholder progress */}
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
                <button className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300 transform hover:scale-105">
                  <LogIn className="w-5 h-5 mr-2" />
                  Go to Course Materials
                </button>
              </div>
            </>
          )}
        </section>

        {/* LMS Features Section */}
        <section className="bg-gray-50 p-8 sm:p-10 lg:p-12 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-[#0A174E] mb-8 text-center">
            Why Use Our LMS?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {lmsFeatures.map((feature, index) => (
              <div key={index} className="flex items-start bg-white p-6 rounded-xl shadow-md">
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

export default LMS;
