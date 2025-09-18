import React from "react";
import { motion } from "framer-motion";

const courses = [
  {
    course: "HNDIT",
    title: "HNDIT – Information Technology",
    image: "/./IT.png",
    description:
      "Learn programming, networking, and software development with practical skills in IT.",
    labelColor: "bg-blue-700",
  },
  {
    course: "HNDA",
    title: "HNDA – Accountancy",
    image: "/./accountancy.png",
    description:
      "Gain a strong foundation in financial accounting, taxation, and management accounting.",
    labelColor: "bg-yellow-700",
  },
  {
    course: "HNDE",
    title: "HNDE – English",
    image: "/./english.png",
    description:
      "Enhance your language, literature, and communication skills for professional contexts.",
    labelColor: "bg-red-700",
  },
];

const Courses = () => {
  return (
    <div className="px-28 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
      {courses.map((course, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer"
        >
          {/* Colorful label */}
          <div
            className={`absolute  ${course.labelColor} text-white text-[20px] font-semibold px-8 py-3 rounded shadow-md z-20`}
          >
            {course.course}
          </div>

          {/* Image */}
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-transparent group-hover:bg-opacity-40 transition-all duration-300"></div>

          {/* Slide-up description */}
          <div className="absolute bottom-0 w-full p-4 bg-black bg-opacity-40 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <h2 className="font-bold text-lg mb-2">{course.title}</h2>
            <p className="text-sm">{course.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Courses;
