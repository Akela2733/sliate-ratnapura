// src/pages/Portal.jsx
import React from 'react';
import { UserCircle, GraduationCap, DollarSign, CalendarDays, Bell, Settings, LogIn } from 'lucide-react'; // Icons

const Portal = () => {
  const quickLinks = [
    { name: "My Profile", icon: UserCircle, description: "View and update your personal information.", link: "/portal/profile" },
    { name: "Academic Records", icon: GraduationCap, description: "Access your grades, transcripts, and academic history.", link: "/portal/academics" },
    { name: "Financial Aid", icon: DollarSign, description: "Manage your tuition fees, scholarships, and financial statements.", link: "/portal/finance" },
    { name: "Course Registration", icon: CalendarDays, description: "Register for new courses and manage your current enrollments.", link: "/portal/registration" },
    { name: "Notifications", icon: Bell, description: "Stay updated with important announcements and alerts.", link: "/portal/notifications" },
    { name: "Settings", icon: Settings, description: "Customize your portal experience and privacy settings.", link: "/portal/settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Hero Section */}
        <div className="relative bg-[#1C3AA9] text-white p-8 sm:p-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            <UserCircle className="inline-block w-10 h-10 sm:w-12 sm:h-12 mr-3 align-middle" />
            Student Portal
          </h1>
          <p className="text-lg sm:text-xl font-light max-w-2xl mx-auto opacity-90">
            Your personalized gateway to all essential university services and information.
          </p>
          <div className="absolute inset-0 bg-pattern-circles opacity-10"></div> {/* Decorative pattern */}
        </div>

        {/* Quick Links / Dashboard Overview */}
        <section className="p-8 sm:p-10 lg:p-12">
          <h2 className="text-3xl font-bold text-[#0A174E] mb-8 text-center sm:text-left">
            Quick Access Dashboard
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.link} // Using href for mock links, can be changed to Link component
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center"
              >
                <link.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{link.name}</h3>
                <p className="text-gray-600 text-sm">{link.description}</p>
              </a>
            ))}
          </div>
          <div className="text-center mt-10">
            <button className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105">
              <LogIn className="w-5 h-5 mr-2" />
              Login to Portal
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Portal;
