// src/pages/CourseDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { motion } from "framer-motion";
import {
  BookOpen, Laptop, Calculator, // Existing icons
  Check, Users, Briefcase, Award, GraduationCap, Lightbulb // Example new icons for highlights
} from "lucide-react"; // Import more icons you might use

// Map icon names (strings from backend) to actual Lucide React components
const iconMap = {
  BookOpen: BookOpen,
  Laptop: Laptop,
  Calculator: Calculator,
  Check: Check,
  Users: Users,
  Briefcase: Briefcase,
  Award: Award,
  GraduationCap: GraduationCap,
  Lightbulb: Lightbulb,
  // Add any other Lucide icons you might use for course main or highlight icons
};

const CourseDetailPage = () => {
  const { courseCode } = useParams();
  const navigate = useNavigate(); // Initialize navigate
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5000/api/courses");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const foundCourse = data.find(
          (c) => String(c.courseCode).toLowerCase() === courseCode.toLowerCase()
        );

        if (foundCourse) {
          setCourse(foundCourse);
        } else {
          setError(`Course with code "${courseCode}" not found.`);
        }
      } catch (err) {
        console.error("Failed to fetch course details:", err);
        setError(`Failed to load course details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (courseCode) {
      fetchCourseDetails();
    }
  }, [courseCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700">Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <p className="text-xl text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate('/courses')}
          className="px-6 py-3 bg-[#1C3AA9] text-white rounded-lg shadow hover:bg-[#2B5FE3] transition-colors"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <p className="text-xl text-gray-700 mb-4">Course not found.</p>
        <button
          onClick={() => navigate('/courses')}
          className="px-6 py-3 bg-[#1C3AA9] text-white rounded-lg shadow hover:bg-[#2B5FE3] transition-colors"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  // Get the main course icon component
  const MainIconComponent = iconMap[course.iconName];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f8ff] to-white pb-16">
      {/* Hero Section */}
      <div className={`relative h-[400px] flex flex-col items-center justify-center ${course.labelColor} text-white text-center shadow-lg overflow-hidden`}>
        <div className="absolute inset-0 bg-black opacity-30 z-0"></div> {/* Overlay for better text readability */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="z-10 flex flex-col items-center p-4"
        >
          {MainIconComponent && (
            <div className="bg-white/20 backdrop-blur-sm p-5 rounded-full mb-4 shadow-xl">
              <MainIconComponent className="w-16 h-16 text-white" />
            </div>
          )}
          <h1 className="text-6xl md:text-7xl font-extrabold drop-shadow-lg mb-4 leading-tight">
            {course.title}
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl px-4">
            {course.description}
          </p>
        </motion.div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        {/* Overview Section */}
        <section className="bg-white p-10 rounded-xl shadow-2xl mb-12 transform -translate-y-20 relative z-20">
          <h2 className="text-4xl font-bold text-[#0A174E] mb-6 text-center">
            Course Overview
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg text-gray-700 leading-relaxed text-center"
          >
            {course.description} {/* Reusing description for overview */}
          </motion.p>
          {course.courseCode && (
            <div className="mt-8 text-center text-gray-500 font-semibold text-lg">
                Course Code: <span className="text-[#1C3AA9]">{course.courseCode}</span>
            </div>
          )}
        </section>

        {/* Highlights Section (Conditional Rendering) */}
        {course.highlights && course.highlights.length > 0 && (
          <section className="mb-12">
            <h2 className="text-4xl font-bold text-[#0A174E] mb-10 text-center">
              What You'll Learn & Gain
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {course.highlights.map((highlight, i) => {
                const HighlightIcon = iconMap[highlight.iconName];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    className="p-8 rounded-xl bg-white shadow-lg border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="bg-orange-100 p-4 rounded-full mb-4">
                      {HighlightIcon ? (
                        <HighlightIcon className="w-10 h-10 text-orange-600" />
                      ) : (
                        <Lightbulb className="w-10 h-10 text-orange-600" /> // Fallback icon
                      )}
                    </div>
                    <h3 className="text-2xl font-semibold text-[#1C3AA9] mb-3">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {highlight.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Call to Action Section */}
        <section className="text-center py-16 bg-[#F3F7FF] rounded-xl shadow-lg mt-12">
          <h2 className="text-4xl font-bold text-[#0A174E] mb-6">Ready to Enroll?</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Take the next step in your career with the {course.title}. Click below to learn more about admissions and how to apply.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 text-xl font-semibold rounded-full text-white bg-gradient-to-r from-[#1C3AA9] to-[#2B5FE3] shadow-lg transition-all duration-300"
            onClick={() => alert(`Navigating to application for ${course.title}!`)}
          >
            Apply Now
          </motion.button>
        </section>

        {/* Back to Courses Button */}
        <div className="text-center mt-16">
          <button
            onClick={() => navigate('/courses')}
            className="inline-flex items-center px-6 py-3 border border-[#1C3AA9] text-base font-medium rounded-full text-[#1C3AA9] bg-white hover:bg-[#EBF1FF] transition-colors shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;