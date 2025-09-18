// src/admin/pages/StaffManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { PlusCircle, Edit, Trash2, Users } from "lucide-react";

const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    department: "",
    email: "",
    phone: "",
    imageURL: "",
    description: "",
    linkedinProfile: "",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token missing. Please log in.");
      return {};
    }
    return {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };
  };

  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/api/staff");
      setStaffMembers(res.data);
    } catch (err) {
      console.error("Error fetching staff:", err);
      setError("Failed to fetch staff members.");
      toast.error("Failed to load staff members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();

    const timer = setTimeout(() => setShowScrollHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      if (!headers["headers"]["x-auth-token"]) {
        setLoading(false);
        return;
      }

      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/staff/${currentStaff._id}`,
          formData,
          headers
        );
        toast.success("Staff member updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/staff", formData, headers);
        toast.success("Staff member added successfully!");
      }

      setFormData({
        name: "",
        title: "",
        department: "",
        email: "",
        phone: "",
        imageURL: "",
        description: "",
        linkedinProfile: "",
      });
      setShowForm(false);
      setIsEditing(false);
      setCurrentStaff(null);
      fetchStaff();
    } catch (err) {
      console.error("Error saving staff:", err);
      const msg =
        err.response?.data?.message || "Failed to save staff member.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (staff) => {
    setCurrentStaff(staff);
    setFormData({
      name: staff.name,
      title: staff.title,
      department: staff.department || "",
      email: staff.email || "",
      phone: staff.phone || "",
      imageURL: staff.imageURL,
      description: staff.description || "",
      linkedinProfile: staff.linkedinProfile || "",
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      setLoading(true);
      try {
        const headers = getAuthHeaders();
        if (!headers["headers"]["x-auth-token"]) {
          setLoading(false);
          return;
        }
        await axios.delete(`http://localhost:5000/api/staff/${id}`, headers);
        toast.success("Staff member deleted successfully!");
        fetchStaff();
      } catch (err) {
        console.error("Error deleting staff:", err);
        const msg =
          err.response?.data?.message || "Failed to delete staff member.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !showForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700">Loading staff members...</p>
      </div>
    );
  }

  if (error && !showForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f8ff] to-white py-16 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <Users className="w-20 h-20 text-[#1C3AA9] mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-[#0A174E] mb-4">
          Staff Management
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Manage all staff members. You can add, edit, or remove staff below.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        {/* Toggle Form Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setIsEditing(false);
              setCurrentStaff(null);
              setFormData({
                name: "",
                title: "",
                department: "",
                email: "",
                phone: "",
                imageURL: "",
                description: "",
                linkedinProfile: "",
              });
            }}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            {showForm ? "Hide Form" : "Add New Staff"}
          </button>
        </div>

        {/* Staff Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {isEditing ? "Edit Staff Member" : "Add New Staff Member"}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg focus:ring-2 focus:ring-[#1C3AA9] focus:outline-none"
              />
              <input
                type="text"
                name="title"
                placeholder="Job Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg focus:ring-2 focus:ring-[#1C3AA9] focus:outline-none"
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-[#1C3AA9] focus:outline-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-[#1C3AA9] focus:outline-none"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-[#1C3AA9] focus:outline-none"
              />
              <input
                type="url"
                name="imageURL"
                placeholder="Image URL"
                value={formData.imageURL}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-[#1C3AA9] focus:outline-none"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="col-span-1 md:col-span-2 p-3 border rounded-lg focus:ring-2 focus:ring-[#1C3AA9] focus:outline-none"
              />
              <input
                type="url"
                name="linkedinProfile"
                placeholder="LinkedIn Profile URL"
                value={formData.linkedinProfile}
                onChange={handleChange}
                className="col-span-1 md:col-span-2 p-3 border rounded-lg focus:ring-2 focus:ring-[#1C3AA9] focus:outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className={`col-span-1 md:col-span-2 py-3 rounded-lg text-white font-semibold ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                }`}
              >
                {loading
                  ? "Saving..."
                  : isEditing
                  ? "Update Staff Member"
                  : "Add Staff Member"}
              </button>
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </form>
          </motion.div>
        )}

        {/* Staff Table */}
        {staffMembers.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No staff members found. Add one above!
          </p>
        ) : (
          <div className="relative">
            <div>
              {/* Scroll Hint */}
              {showScrollHint && (
                <div className="absolute -top-6 right-4 text-xs text-gray-500 animate-pulse md:hidden">
                  Scroll →
                </div>
              )}
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {staffMembers.map((staff) => (
                      <motion.tr
                        key={staff._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={
                              staff.imageURL || "https://via.placeholder.com/50"
                            }
                            alt={staff.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {staff.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {staff.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {staff.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {staff.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditClick(staff)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Edit className="inline-block w-5 h-5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(staff._id)}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffManagement;
