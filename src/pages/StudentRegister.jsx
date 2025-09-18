// src/pages/StudentRegister.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserPlus, User, Mail, Lock, Building, Hash, Eye, EyeOff } from 'lucide-react'; // Added Eye, EyeOff icons

const StudentRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    registrationNumber: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'HNDIT', // Default to HNDIT
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state for confirm password visibility

  const departments = ['HNDIT', 'HNDE', 'HNDA']; // Available departments

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { registrationNumber, name, email, password, confirmPassword, department } = formData;

    // Frontend validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    // Registration number format validation
    const regNumRegex = /^[A-Z]+\/[A-Z]+\/\d{4}\/[A-Z]\/\d{4}$/; 
    if (!regNumRegex.test(registrationNumber.toUpperCase())) {
      setError("Invalid registration number format. Expected: RAT/IT/YYYY/L/NNNN (e.g., RAT/IT/2022/F/0020).");
      setLoading(false);
      return;
    }

    try {
      // Send registration data to the backend
      const res = await axios.post('http://localhost:5000/api/student-auth/register', {
        registrationNumber,
        name,
        email,
        password,
        department,
      });

      toast.success(res.data.message || "Registration successful! You can now log in.");
      navigate('/login'); // Redirect to login page after successful registration
    } catch (err) {
      console.error("Student registration failed:", err.response ? err.response.data : err.message);
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 flex items-center justify-center font-inter">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[#1C3AA9] mb-8 flex items-center justify-center">
          <UserPlus className="w-8 h-8 mr-3" /> Student Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
              <Hash className="inline-block w-4 h-4 mr-1 text-gray-500" /> Registration Number
            </label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., RAT/IT/2022/F/0020"
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              <User className="inline-block w-4 h-4 mr-1 text-gray-500" /> Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="inline-block w-4 h-4 mr-1 text-gray-500" /> Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              <Building className="inline-block w-4 h-4 mr-1 text-gray-500" /> Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
              required
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Password Field with Toggle */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              <Lock className="inline-block w-4 h-4 mr-1 text-gray-500" /> Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer top-6"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </span>
          </div>

          {/* Confirm Password Field with Toggle */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              <Lock className="inline-block w-4 h-4 mr-1 text-gray-500" /> Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer top-6"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
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
            {loading ? 'Registering...' : 'Register Account'}
          </button>
        </form>

        {error && <p className="mt-4 text-center text-red-600 text-sm">{error}</p>}

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default StudentRegister;
