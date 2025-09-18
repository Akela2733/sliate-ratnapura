// src/pages/ManageNews.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Edit, Trash2, Newspaper } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const ManageNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/news'); // Fetch all news
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // The news API endpoint returns an object with a 'news' array
      setNews(data.news || []); // Access the 'news' array
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setError(`Failed to load news: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'admin') {
      navigate('/login');
    } else {
      fetchNews();
    }
  }, [isAuthenticated, user, navigate]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the news article "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch(`http://localhost:5000/api/news/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete news: ${response.statusText}`);
      }

      setNews(news.filter(article => article._id !== id));
      alert(`News article "${title}" deleted successfully!`);
    } catch (err) {
      console.error("Error deleting news:", err);
      alert(`Error deleting news: ${err.message}`);
      if (err.message.includes('token') || err.message.includes('Unauthorized')) {
          navigate('/login'); // Redirect on auth issues
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700">Loading news...</p>
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

  if (!isAuthenticated || !user || user.role !== 'admin') {
      return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f8ff] to-white py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <Newspaper className="w-20 h-20 text-[#1C3AA9] mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-[#0A174E] mb-4">Manage News</h1>
        <p className=" text-gray-700 max-w-2xl mx-auto">
          Create, edit, and delete news articles for your university.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-end mb-6">
          <Link
            to="/admin/add-news"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add New Article
          </Link>
        </div>

        {news.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No news articles found. Add your first article!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {news.map((article) => (
                  <motion.tr
                    key={article._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {article.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(article.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/edit-news/${article._id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit className="inline-block w-5 h-5" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(article._id, article.title)}
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

export default ManageNews;