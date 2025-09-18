// src/pages/ManageCourses.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Edit, Trash2, BookOpen } from 'lucide-react';
import AuthContext from 'context/AuthContext';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useContext(AuthContext); // Get auth state
  const navigate = useNavigate();

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/courses'); // Fetch all courses
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError(`Failed to load courses: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if authenticated and is admin, otherwise redirect or show error
    if (isAuthenticated && user && user.role === 'admin') {
      fetchCourses();
    } else if (!isAuthenticated && !user) {
      // If not authenticated at all, redirect to login
      navigate('/login');
    } else if (isAuthenticated && user && user.role !== 'admin') {
      // Authenticated but not admin, redirect to dashboard or home
      navigate('/admin-dashboard'); // Or '/'
    }
  }, [isAuthenticated, user, navigate]); // Depend on auth state

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the course "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token, // Send the token in the header
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete course: ${response.statusText}`);
      }

      setCourses(courses.filter(course => course._id !== id)); // Remove deleted course from state
      alert(`Course "${title}" deleted successfully!`);
    } catch (err) {
      console.error("Error deleting course:", err);
      alert(`Error deleting course: ${err.message}`);
      // If token issues, redirect to login
      if (err.message.includes('token') || err.message.includes('Unauthorized')) {
          navigate('/login');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  // If not authenticated or not admin, the useEffect hook will handle redirection.
  // This ensures direct access attempts are caught.
  if (!isAuthenticated || !user || user.role !== 'admin') {
      return null; // Or a simple loading/redirect message
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f8ff] to-white py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <BookOpen className="w-20 h-20 text-[#1C3AA9] mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-[#0A174E] mb-4">Manage Courses</h1>
        <p className=" text-gray-700 max-w-2xl mx-auto">
          Overview of all courses. You can add new courses or edit/delete existing ones.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-end mb-6">
          <Link
            to="/add-course"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add New Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No courses found. Add your first course!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <motion.tr
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.courseCode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {course.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/edit-course/${course._id}`} // Link to the edit page
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit className="inline-block w-5 h-5" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(course._id, course.title)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="inline-block w-5 h-5" /> Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCourses;