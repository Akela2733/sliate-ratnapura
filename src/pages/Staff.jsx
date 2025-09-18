// src/pages/Staff.jsx
import React, { useState, useEffect } from "react";

const Staff = () => {
  const [staffMembers, setStaffMembers] = useState([]); // State for fetched staff
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5000/api/staff"); // Ensure your backend API is running
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStaffMembers(data); // Assuming backend directly returns an array of staff members
      } catch (err) {
        console.error("Failed to fetch staff:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div className="pt-12 px-6 md:px-16 lg:px-28 bg-white text-gray-800 min-h-screen">
      <section className="py-12">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-3">
            <hr className="border-t-4 w-16 border-primary" />
            <h2 className="text-2xl md:text-3xl font-semibold text-primary">
              Meet Our Staff
            </h2>
            <hr className="border-t-4 w-16 border-primary" />
          </div>
          <p className="text-gray-600 text-lg">
            Passionate professionals dedicated to empowering future leaders
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading staff members...</p>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">Error: {error}</p>
        ) : staffMembers.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No staff members found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-10">
            {staffMembers.map((staff) => (
              <div
                key={staff._id} // Use unique ID from backend for key
                className="bg-white p-4 shadow-md rounded-xl text-center"
              >
                <img
                  src={staff.imageURL} // Ensure this matches your backend field name (e.g., 'image' or 'imageUrl')
                  alt={staff.name}
                  className="w-32 h-32 object-cover mx-auto rounded-full mb-4"
                />
                <h3 className="text-lg font-bold text-gray-800">{staff.name}</h3>
                <p className="text-sm text-primary">{staff.title}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Staff;