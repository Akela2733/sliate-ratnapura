import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Laptop, Calculator } from "lucide-react";

// Map icon names (strings from backend) to actual Lucide React components
const iconMap = {
  BookOpen: BookOpen,
  Laptop: Laptop,
  Calculator: Calculator,
  // Add other icons if you use them for courses (e.g., if you add FaChartLine, etc., from the individual course pages)
  // FaChartLine: FaChartLine, // You would need to import these from 'react-icons/fa' if using them here
  // FaCalculator: FaCalculator,
  // FaMoneyBillWave: FaMoneyBillWave,
  // FaBookOpen: FaBookOpen,
  // FaChalkboardTeacher: FaChalkboardTeacher,
  // FaGlobe: FaGlobe,
  // FaLaptopCode: FaLaptopCode,
  // FaNetworkWired: FaNetworkWired,
  // FaServer: FaServer,
};

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5000/api/courses");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // It's a good idea to ensure courseCode is always a string to avoid .toLowerCase() errors
        const processedData = data.map(course => ({
            ...course,
            courseCode: String(course.courseCode || '').toUpperCase() // Ensure it's a string and uppercase for consistency before converting to lowercase for path
        }));
        setCourses(processedData);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-extrabold text-primary mb-4">
          <span className="text-[#0A174E]">Our </span>
          <span className="text-[#1C3AA9]">Courses</span>
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Choose from our diploma programs designed to prepare you for success.
        </p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading courses...</p>
      ) : error ? (
        <p className="text-center text-red-600 text-lg">Error: {error}</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No courses available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {courses.map((course) => {
            const IconComponent = iconMap[course.iconName];
            const pathToNavigate = course.link || `/courses/${course.courseCode.toLowerCase()}`;

            // Add this console.log for debugging purposes
            // console.log(`Course: ${course.title}, Navigating to: ${pathToNavigate}`);

            return (
              <motion.div
                key={course._id}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                onClick={() => navigate(pathToNavigate)} // Use the pre-computed path
                className={`cursor-pointer rounded-3xl bg-gradient-to-br ${course.labelColor} p-1 shadow-xl`}
              >
                <div className="h-full w-full bg-white rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-orange-500 p-3 rounded-full shadow-lg">
                      {IconComponent ? <IconComponent className="w-8 h-8 text-white" /> : null}
                    </div>
                    <h3 className="text-xl font-bold text-[#0A174E]">{course.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm flex-grow">{course.description}</p>
                  <button className="mt-6 px-4 py-2 text-sm font-medium bg-[#0A174E] text-white rounded-xl hover:bg-[#10297C] transition">
                    Explore {course.title}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Courses;