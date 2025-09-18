import React from "react";
import { motion } from "framer-motion";
import { FaBookOpen, FaChalkboardTeacher, FaGlobe } from "react-icons/fa";

const HNDE = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f8ff] to-white">
      {/* Hero Section */}
      <div className="relative h-96 flex items-center justify-center bg-gradient-to-r from-[#090d54] to-[#1C3AA9] text-white text-center">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold drop-shadow-lg"
        >
          Higher National Diploma in English (HNDE)
        </motion.h1>
      </div>

      {/* Overview Section */}
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-lg text-gray-700 leading-relaxed"
        >
          The HNDE program equips students with advanced English communication, literature, 
          and professional writing skills, preparing them for careers in education, 
          translation, media, and global organizations.
        </motion.p>
      </div>

      {/* Highlights Section */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6 pb-20">
        {[
          {
            title: "Advanced English Proficiency",
            desc: "Master professional spoken and written English for global careers.",
            icon: <FaBookOpen className="text-4xl text-orange-500" />,
          },
          {
            title: "Global Communication Skills",
            desc: "Enhance your presentation and public speaking with confidence.",
            icon: <FaChalkboardTeacher className="text-4xl text-orange-500" />,
          },
          {
            title: "Career Growth",
            desc: "Opportunities in teaching, journalism, translation, and beyond.",
            icon: <FaGlobe className="text-4xl text-orange-500" />,
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="p-6 rounded-2xl bg-white/70 backdrop-blur shadow-lg hover:shadow-2xl transition transform hover:-translate-y-3"
          >
            <div className="mb-4 flex justify-center">{item.icon}</div>
            <h3 className="text-xl font-semibold text-[#090d54] mb-2 text-center">{item.title}</h3>
            <p className="text-gray-600 text-center">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center pb-16">
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="px-8 py-4 text-lg font-semibold rounded-full text-white bg-gradient-to-r from-[#090d54] to-[#1C3AA9] shadow-lg hover:shadow-2xl transition"
        >
          Join HNDE Today
        </motion.button>
      </div>
    </div>
  );
};

export default HNDE;
