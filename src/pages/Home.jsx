import React from "react";
import { motion } from "framer-motion";
import Cover from "../Components/Cover";
import Courses from "../Components/Courses";
import HomeNavigation from "../Components/HomeNavigation";
import NewsEventsSplitSection from "../Components/EventNewsPage";
import AboutSection from "../Components/AboutSection";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const Home = () => {
  return (
    <div>
      <Cover />

     
        <AboutSection />
      
      <motion.div
        custom={1}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <Courses />
      </motion.div>

      
        <HomeNavigation />
      

      <motion.div
        custom={3}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <NewsEventsSplitSection />
      </motion.div>
    </div>
  );
};

export default Home;
