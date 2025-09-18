import React from "react";
import { motion } from "framer-motion";
import { FaChartLine, FaCalculator, FaMoneyBillWave } from "react-icons/fa";

const HNDA = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f8ff] to-white">
      {/* Hero Section */}
      <div className="relative h-96 flex items-center justify-center bg-gradient-to-r from-[#1C3AA9] to-[#2B5FE3] text-white text-center">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold drop-shadow-lg"
        >
          Higher National Diploma in Accountancy (HNDA)
        </motion.h1>
      </div>

      {/* Overview */}
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-lg text-gray-700 leading-relaxed"
        >
          The HNDA program develops accounting and finance experts equipped 
          with auditing, taxation, and business analytics skills to thrive in 
          local and international markets.
        </motion.p>
      </div>

      {/* Highlights */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6 pb-20">
        {[
          {
            title: "Professional Accounting",
            desc: "Master financial and management accounting practices for businesses.",
            icon: <FaCalculator className="text-4xl text-orange-500" />,
          },
          {
            title: "Tax & Auditing",
            desc: "Hands-on projects to understand taxation laws and auditing techniques.",
            icon: <FaMoneyBillWave className="text-4xl text-orange-500" />,
          },
          {
            title: "Financial Analytics",
            desc: "Learn to analyze and visualize business data for smart decisions.",
            icon: <FaChartLine className="text-4xl text-orange-500" />,
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
            <h3 className="text-xl font-semibold text-[#1C3AA9] mb-2 text-center">{item.title}</h3>
            <p className="text-gray-600 text-center">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center pb-16">
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="px-8 py-4 text-lg font-semibold rounded-full text-white bg-gradient-to-r from-[#1C3AA9] to-[#2B5FE3] shadow-lg hover:shadow-2xl transition"
        >
          Join HNDA Today
        </motion.button>
      </div>
    </div>
  );
};

export default HNDA;


