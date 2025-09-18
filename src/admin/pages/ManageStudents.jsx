// src/admin/pages/ManageStudents.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PlusCircle, Edit, Trash2, User, Mail, Home, BookOpen, Search, XCircle, Eye, EyeOff } from 'lucide-react'; // Icons

import AuthContext from '../../context/AuthContext'; // To get the auth token

const ManageStudents = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const isAdmin = isAuthenticated && user?.role === 'admin';

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]); // To populate the enrolledSubjects dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // To toggle add/edit form visibility
  const [isEditing, setIsEditing] = useState(false); // To determine if we're adding or editing
  const [currentStudent, setCurrentStudent] = useState(null); // Student being edited
  const [formData, setFormData] = useState({
    registrationNumber: '',
    name: '',
    email: '',
    password: '',
    department: 'HNDIT', // Default department
    enrolledSubjects: [] // Array of subject IDs
  });
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const departments = ['HNDIT', 'HNDE', 'HNDA']; // Available departments for dropdown

  // Define regex patterns for each department's registration number format
  const regNumPatterns = {
    HNDE: /^RAT\/EN\/\d{4}\/[A-Z]\/\d{4}$/, // Example: RAT/EN/2021/F/0000
    HNDA: /^RAT\/AC\/\d{4}\/[A-Z]\/\d{4}$/, // Example: RAT/AC/2022/F/0000
    HNDIT: /^RAT\/IT\/\d{4}\/[A-Z]\/\d{4}$/, // Example: RAT/IT/2022/F/0020
  };

  // Helper to get authorization headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Authentication token missing. Please log in.");
      return {};
    }
    return {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };
  };

  // Fetch Students from Backend
  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      if (!headers.headers || !headers.headers['x-auth-token']) {
        setLoading(false);
        return;
      }
      const res = await axios.get("http://localhost:5000/api/students", headers);
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err.response ? err.response.data : err.message);
      setError("Failed to fetch student list.");
      toast.error("Failed to load student list.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Subjects from Backend (for dropdown)
  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/subjects");
      setSubjects(res.data);
    } catch (err) {
      console.error("Error fetching subjects:", err.response ? err.response.data : err.message);
      toast.error("Failed to load subjects for selection.");
    }
  };

  useEffect(() => {
    if (isAdmin) { // Only fetch if authenticated as admin
      fetchStudents();
      fetchSubjects();
    }
  }, [isAdmin]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'enrolledSubjects') {
      // Handle multi-select for subjects
      const subjectId = value;
      setFormData(prev => ({
        ...prev,
        enrolledSubjects: checked
          ? [...prev.enrolledSubjects, subjectId]
          : prev.enrolledSubjects.filter(id => id !== subjectId)
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission (Add/Edit Student)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Dynamic Registration number format validation based on selected department
    const currentRegNumPattern = regNumPatterns[formData.department];
    if (!currentRegNumPattern || !currentRegNumPattern.test(formData.registrationNumber.toUpperCase())) {
      setError(`Invalid registration number format for ${formData.department} department. Expected: ${currentRegNumPattern ? currentRegNumPattern.source : 'unknown format'}.`);
      setLoading(false);
      return;
    }

    try {
      const headers = getAuthHeaders();
      if (!headers.headers || !headers.headers['x-auth-token']) return;

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/students/${currentStudent._id}`, formData, headers);
        toast.success("Student updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/students", formData, headers);
        toast.success("Student added successfully!");
      }
      // Reset form and close it
      setFormData({
        registrationNumber: '',
        name: '',
        email: '',
        password: '',
        department: 'HNDIT',
        enrolledSubjects: []
      });
      setShowForm(false);
      setIsEditing(false);
      setCurrentStudent(null);
      fetchStudents(); // Re-fetch to update list
    } catch (err) {
      console.error("Error saving student:", err.response ? err.response.data : err.message);
      const msg = err.response?.data?.message || "Failed to save student.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit click
  const handleEditClick = (student) => {
    setCurrentStudent(student);
    setFormData({
      registrationNumber: student.registrationNumber,
      name: student.name,
      email: student.email,
      password: '', // Password is not pre-filled for security
      department: student.department,
      enrolledSubjects: student.enrolledSubjects.map(sub => sub._id) // Map to just IDs for form
    });
    setIsEditing(true);
    setShowForm(true);
  };

  // Handle Delete click
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      setLoading(true);
      try {
        const headers = getAuthHeaders();
        if (!headers.headers || !headers.headers['x-auth-token']) return;

        await axios.delete(`http://localhost:5000/api/students/${id}`, headers);
        toast.success("Student deleted successfully!");
        fetchStudents();
      } catch (err) {
        console.error("Error deleting student:", err.response ? err.response.data : err.message);
        const msg = err.response?.data?.message || "Failed to delete student.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">Access Denied. You must be an administrator to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-inter">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#0A174E]">Manage Students</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setIsEditing(false);
            setCurrentStudent(null);
            setFormData({ registrationNumber: '', name: '', email: '', password: '', department: 'HNDIT', enrolledSubjects: [] });
          }}
          className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition-colors duration-300"
        >
          {showForm ? "Hide Form" : <><PlusCircle className="w-5 h-5 mr-2" /> Add New Student</>}
        </button>
      </div>

      {/* Add/Edit Student Form */}
      {showForm && (
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">{isEditing ? "Edit Student" : "Add New Student"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">Registration Number</label>
              <input type="text" id="registrationNumber" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                placeholder={`e.g., RAT/${formData.department === 'HNDE' ? 'EN' : formData.department === 'HNDA' ? 'AC' : 'IT'}/YYYY/L/NNNN`} // Dynamic placeholder
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" />
            </div>
            {/* Password Field with Toggle */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password {isEditing && "(Leave blank to keep current)"}</label>
              <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                required={!isEditing} // Password is required only for new students
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
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
              <select id="department" name="department" value={formData.department} onChange={handleChange} required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 bg-white">
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            {/* Enrolled Subjects Checkboxes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Enrolled Subjects</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-gray-50 p-4 rounded-md border border-gray-200">
                {subjects.length > 0 ? (
                  subjects.map(subject => (
                    <div key={subject._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`subject-${subject._id}`}
                        name="enrolledSubjects"
                        value={subject._id}
                        checked={formData.enrolledSubjects.includes(subject._id)}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`subject-${subject._id}`} className="ml-2 text-sm text-gray-700">
                        {subject.code} - {subject.name} ({subject.department})
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 col-span-full">No subjects available. Please add subjects first.</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2 text-center mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full md:w-auto px-8 py-3 border border-transparent rounded-full shadow-lg text-white font-semibold transition-colors duration-300 transform hover:scale-105 ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                }`}
              >
                {loading ? "Saving..." : (isEditing ? "Update Student" : "Add Student")}
              </button>
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>
          </form>
        </div>
      )}

      {/* Students List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {loading && <p className="p-6 text-center text-gray-500">Loading students...</p>}
        {error && !showForm && <p className="p-6 text-center text-red-600">Error: {error}</p>}
        {!loading && students.length === 0 && !error && (
          <p className="p-6 text-center text-gray-500">No students found. Add a new student above.</p>
        )}
        {!loading && students.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Reg. No.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Subjects</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.registrationNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {student.enrolledSubjects && student.enrolledSubjects.length > 0
                        ? student.enrolledSubjects.map(sub => sub.code).join(', ')
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(student)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit className="w-5 h-5 inline-block" />
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5 inline-block" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStudents;
