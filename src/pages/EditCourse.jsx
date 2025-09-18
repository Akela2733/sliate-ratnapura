// src/pages/EditCourse.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, Save, Plus, X } from 'lucide-react'; // Added X for removing highlights
import AuthContext from '../context/AuthContext';

// Dummy data for available icons and colors (replace with actual dynamic lists if needed)
const availableIcons = ["BookOpen", "Laptop", "Calculator", "Briefcase", "GraduationCap", "Lightbulb", "Users", "Check", "Award"];
const availableColors = [
  "from-blue-700 to-blue-500",
  "from-purple-700 to-purple-500",
  "from-green-700 to-green-500",
  "from-red-700 to-red-500",
  "from-orange-700 to-orange-500",
  "from-indigo-700 to-indigo-500",
];

const EditCourse = () => {
  const { id } = useParams(); // Get the course ID from the URL
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    iconName: '',
    labelColor: '',
    courseCode: '',
    link: '',
    highlights: [],
  });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formMessage, setFormMessage] = useState(null); // For success/error messages after submit

  // Fetch course data on component mount
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'admin') {
      navigate('/login'); // Redirect if not authenticated or not admin
      return;
    }

    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFormData({
          title: data.title || '',
          description: data.description || '',
          iconName: data.iconName || '',
          labelColor: data.labelColor || '',
          courseCode: data.courseCode || '',
          link: data.link || '',
          highlights: data.highlights || [],
        });
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError(`Failed to load course details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHighlightChange = (index, e) => {
    const { name, value } = e.target;
    const newHighlights = [...formData.highlights];
    newHighlights[index] = { ...newHighlights[index], [name]: value };
    setFormData((prev) => ({ ...prev, highlights: newHighlights }));
  };

  const addHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, { title: '', description: '', iconName: '' }],
    }));
  };

  const removeHighlight = (index) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setFormMessage(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'PUT', // Use PUT for updating
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update course.');
      }

      setFormMessage('Course updated successfully!');
      // Optionally, redirect after a short delay
      setTimeout(() => {
        navigate('/admin/manage-courses');
      }, 2000);
    } catch (err) {
      console.error("Error updating course:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700">Loading course for editing...</p>
      </div>
    );
  }

  if (error && !formMessage) { // Show initial fetch error
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f8ff] to-white py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <Edit className="w-20 h-20 text-[#1C3AA9] mx-auto mb-4" />
        <h1 className="text-5xl font-extrabold text-[#0A174E] mb-4">Edit Course</h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          Modify the details of the course with ID: {id}
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Course Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Course Code */}
          <div>
            <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700">Course Code</label>
            <input
              type="text"
              id="courseCode"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            ></textarea>
          </div>

          {/* Icon Name */}
          <div>
            <label htmlFor="iconName" className="block text-sm font-medium text-gray-700">Icon Name (Lucide Icon)</label>
            <select
              id="iconName"
              name="iconName"
              value={formData.iconName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="">Select an icon</option>
              {availableIcons.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>

          {/* Label Color */}
          <div>
            <label htmlFor="labelColor" className="block text-sm font-medium text-gray-700">Label Color (Tailwind gradient class)</label>
            <select
              id="labelColor"
              name="labelColor"
              value={formData.labelColor}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="">Select a color</option>
              {availableColors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          {/* Link (Optional) */}
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700">Link (Optional)</label>
            <input
              type="text"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Highlights Section */}
          <div className="border p-4 rounded-md bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Highlights</h3>
            {formData.highlights.map((highlight, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 mb-4 p-4 border border-gray-200 rounded-md bg-white shadow-sm">
                <div className="flex-grow">
                  <label htmlFor={`highlight-title-${index}`} className="block text-xs font-medium text-gray-600">Highlight Title</label>
                  <input
                    type="text"
                    id={`highlight-title-${index}`}
                    name="title"
                    value={highlight.title}
                    onChange={(e) => handleHighlightChange(index, e)}
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
                <div className="flex-grow">
                  <label htmlFor={`highlight-description-${index}`} className="block text-xs font-medium text-gray-600">Highlight Description</label>
                  <input
                    type="text"
                    id={`highlight-description-${index}`}
                    name="description"
                    value={highlight.description}
                    onChange={(e) => handleHighlightChange(index, e)}
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
                <div className="flex-grow">
                  <label htmlFor={`highlight-icon-${index}`} className="block text-xs font-medium text-gray-600">Highlight Icon</label>
                  <select
                    id={`highlight-icon-${index}`}
                    name="iconName"
                    value={highlight.iconName}
                    onChange={(e) => handleHighlightChange(index, e)}
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select icon</option>
                    {availableIcons.map(icon => (
                        <option key={`h-${index}-${icon}`} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end pt-6 md:pt-0">
                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addHighlight}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Highlight
            </button>
          </div>

          {/* Submission messages */}
          {formMessage && <p className="text-center text-green-600 mt-4">{formMessage}</p>}
          {error && <p className="text-center text-red-600 mt-4">{error}</p>}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-[#1C3AA9] hover:bg-[#2B5FE3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={submitLoading}
          >
            {submitLoading ? 'Updating Course...' : (
              <>
                <Save className="h-6 w-6 mr-2" /> Update Course
              </>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;