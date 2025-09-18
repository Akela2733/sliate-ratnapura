// src/pages/Login.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext'; 
import { Eye, EyeOff } from 'lucide-react'; // Added Eye, EyeOff icons

const Login = () => {
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();
  const { isAuthenticated, user, login } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true }); 
      } else if (user.role === 'student') {
        navigate('/lms', { replace: true }); // Redirect students to LMS or Portal
      } else {
        navigate('/', { replace: true }); 
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 

    try {
      const credentials = {};
      const isEmail = identifier.includes('@');
      // Updated regNumRegex to be consistent with the backend model and student registration
      const regNumRegex = /^RAT\/(EN|AC|IT)\/\d{4}\/[A-Z]\/\d{4}$/; 
      const isRegNumber = !isEmail && regNumRegex.test(identifier.toUpperCase());

      if (isEmail) {
        credentials.email = identifier;
      } else if (isRegNumber) {
        credentials.registrationNumber = identifier.toUpperCase(); // Ensure uppercase for consistency
      } else {
        setError("Please enter a valid email or registration number (e.g., RAT/IT/YYYY/L/NNNN).");
        setLoading(false);
        return;
      }
      credentials.password = password;

      // Pass the credentials object directly to the login function
      const success = await login(credentials); 

      if (!success) {
        // Error handled by AuthContext toast, no need to set local error here
      }

    } catch (err) {
      console.error("Login submission error:", err);
      setError(err.message || 'Login failed due to an unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-[#1C3AA9] mb-8">Login</h2> 

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
              Email or Registration Number
            </label>
            <input
              type="text" 
              id="identifier"
              name="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., student@sliate.lk or RAT/IT/2022/F/0020"
              required
            />
          </div>

          {/* Password Field with Toggle */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </span>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1C3AA9] hover:bg-[#2B5FE3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        {error && <p className="mt-4 text-center text-red-600">{error}</p>}

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have a student account?{' '}
          <button
            onClick={() => navigate('/register-student')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Register here
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
