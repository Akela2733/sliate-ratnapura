import React from "react";
import { motion } from "framer-motion";
import { FaLaptopCode, FaNetworkWired, FaServer } from "react-icons/fa";

const HNDIT = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f8ff] to-white">
      {/* Hero Section */}
      <div className="relative h-96 flex items-center justify-center bg-gradient-to-r from-[#10297C] to-[#1A4ACC] text-white text-center">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold drop-shadow-lg"
        >
          Higher National Diploma in IT (HNDIT)
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
          The HNDIT program builds future-ready IT professionals with hands-on
          training in programming, web technologies, database systems, and
          networking essentials.
        </motion.p>
      </div>

      {/* Highlights */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6 pb-20">
        {[
          {
            title: "Full-Stack Development",
            desc: "Learn modern programming languages and frameworks for web and app development.",
            icon: <FaLaptopCode className="text-4xl text-orange-500" />,
          },
          {
            title: "Networking & Security",
            desc: "Hands-on training with real-world network and cybersecurity tools.",
            icon: <FaNetworkWired className="text-4xl text-orange-500" />,
          },
          {
            title: "Database Systems",
            desc: "Master SQL, NoSQL, and cloud databases for enterprise applications.",
            icon: <FaServer className="text-4xl text-orange-500" />,
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
            <h3 className="text-xl font-semibold text-[#10297C] mb-2 text-center">{item.title}</h3>
            <p className="text-gray-600 text-center">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center pb-16">
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="px-8 py-4 text-lg font-semibold rounded-full text-white bg-gradient-to-r from-[#10297C] to-[#1A4ACC] shadow-lg hover:shadow-2xl transition"
        >
          Join HNDIT Today
        </motion.button>
      </div>
    </div>
  );
};

export default HNDIT;
