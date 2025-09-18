// src/admin/pages/DashboardHome.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, Newspaper, Calendar, Users, MessageSquare } from 'lucide-react';

const adminSections = [
  { title: "Manage Courses", description: "Add, edit, and delete courses offered.", icon: BookOpen, link: "/admin/manage-courses" },
  { title: "Manage News", description: "Create and update news articles.", icon: Newspaper, link: "/admin/manage-news" },
  { title: "Manage Events", description: "Schedule and update university events.", icon: Calendar, link: "/admin/manage-events" },
  { title: "Manage Staff", description: "Administer staff profiles and roles.", icon: Users, link: "/admin/manage-staff" },
  // { title: "View Contact Messages", description: "Review messages from the contact form.", icon: MessageSquare, link: "/admin/contact-messages" },
];

const DashboardHome = () => {
  return (
    <div className="min-h-full bg-gradient-to-b from-[#f5f8ff] to-white py-8 px-4 rounded-lg shadow-md">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <LayoutDashboard className="w-20 h-20 text-[#1C3AA9] mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-[#0A174E] mb-4">Admin Dashboard</h1>
        <p className=" text-gray-700 max-w-2xl mx-auto">
          Welcome to the administration panel. Manage your university's content efficiently.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {adminSections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300"
          >
            {section.icon && (
              <section.icon className="w-16 h-16 text-orange-500 mb-4" />
            )}
            <h2 className="text-2xl font-semibold text-[#1C3AA9] mb-3">{section.title}</h2>
            <p className="text-gray-600 mb-6">{section.description}</p>
            <Link
              to={section.link}
              className="mt-auto px-6 py-3 bg-[#1C3AA9] text-white rounded-full hover:bg-[#2B5FE3] transition-colors shadow-md"
            >
              Go to {section.title.split(' ')[1]}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
