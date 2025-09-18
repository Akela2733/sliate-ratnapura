import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBookOpen, FaCheckCircle, FaLaptop, FaGlobe } from "react-icons/fa";

const navItems = [
  { title: "Exams", icon: FaBookOpen, link: "/exams" },
  { title: "Results", icon: FaCheckCircle, link: "/results" },
  { title: "LMS", icon: FaLaptop, link: "/lms" },
  { title: "Online Portal", icon: FaGlobe, link: "/portal" },
];

const HomeNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="py-16 px-10 md:px-28 bg-gray-100">
      <h2 className="text-center text-3xl font-bold mb-12 text-primary">
        Quick Access
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto px-6 py-10">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              onClick={() => navigate(item.link)}
              className="bg-white hover:bg-primary hover:text-white border border-gray-200 shadow-md p-6 rounded-lg text-center cursor-pointer transition duration-300 group"
            >
              <div className="flex justify-center mb-4">
                <Icon className="text-4xl text-primary group-hover:text-white transition duration-300" />
              </div>
              <h3 className="text-xl text-primary group-hover:text-white font-semibold">
                {item.title}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeNavigation;
