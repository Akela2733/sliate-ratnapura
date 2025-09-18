// src/pages/EditNews.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, Save } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const EditNews = () => {
  const { id } = useParams(); // Get the news ID from the URL
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: '',
    imageURL: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formMessage, setFormMessage] = useState(null);

  // Fetch news data on component mount
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/news/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFormData({
          title: data.title || '',
          content: data.content || '',
          // Format date to YYYY-MM-DD for input type="date"
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
          imageURL: data.imageURL || '',
        });
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError(`Failed to load news details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id, isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

      const response = await fetch(`http://localhost:5000/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update news article.');
      }

      setFormMessage('News article updated successfully!');
      setTimeout(() => {
        navigate('/admin/manage-news');
      }, 2000);
    } catch (err) {
      console.error("Error updating news:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700">Loading news for editing...</p>
      </div>
    );
  }

  if (error && !formMessage) {
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
        <h1 className="text-5xl font-extrabold text-[#0A174E] mb-4">Edit News Article</h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          Modify the details of the news article with ID: {id}
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">News Title</label>
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

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="8"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            ></textarea>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Image URL (Optional) */}
          <div>
            <label htmlFor="imageURL" className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
            <input
              type="text"
              id="imageURL"
              name="imageURL"
              value={formData.imageURL}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
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
            {submitLoading ? 'Updating Article...' : (
              <>
                <Save className="h-6 w-6 mr-2" /> Update Article
              </>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default EditNews;