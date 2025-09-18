import React from "react";
import { Link } from 'react-router-dom'; // Import Link
import {
  AiFillInstagram,
  AiFillLinkedin,
  AiFillFacebook,
  AiFillPhone,
} from "react-icons/ai";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9 } },
};

const Footer = () => {
  return (
    <div className="bg-primary text-white">
      <footer className="px-6 sm:px-10 md:px-20 py-16 text-base">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {/* Logo & Institute */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/"> {/* Link the logo to the homepage */}
              <img
                className="h-28 w-auto mb-4 object-contain"
                src="/government-logo.png"
                alt="Sri Lanka Government Logo"
              />
            </Link>
            <div className="text-sm leading-5 text-slate-300">
              <p>Sri Lanka Institute of Advanced Technological Education</p>
              <p>ශ්‍රී ලංකා උසස් තාක්ෂණ අධ්‍යාපන ආයතනය</p>
            </div>
          </div>

          {/* Info Section */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            {/* Courses */}
            <div>
              <h2 className="font-semibold text-lg mb-4 text-white">Courses</h2>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/courses/hndit" className="hover:text-white transition block">HNDIT – Information Technology</Link></li>
                <li><Link to="/courses/hnda" className="hover:text-white transition block">HNDA – Accountancy</Link></li>
                <li><Link to="/courses/hnde" className="hover:text-white transition block">HNDE – English</Link></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="font-semibold text-lg mb-4 text-white">Quick Links</h2>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/students" className="hover:text-white transition block">For Current Students</Link></li>
                <li><Link to="/staff" className="hover:text-white transition block">For Staff</Link></li>
                {/* Add other quick links here as needed, e.g., to /news, /events, /about */}
                <li><Link to="/news" className="hover:text-white transition block">News</Link></li>
                <li><Link to="/events" className="hover:text-white transition block">Events</Link></li>
                <li><Link to="/about" className="hover:text-white transition block">About Us</Link></li>
                <li><Link to="/staff" className="hover:text-white transition block">Staff</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h2 className="font-semibold text-lg mb-4 text-white">Connect With Us</h2>
              <div className="flex gap-4 mb-4 justify-center sm:justify-start">
                <a href="https://www.instagram.com/your_sliate_instagram" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <AiFillInstagram className="text-2xl text-white hover:text-[#E4405F] transition" />
                </a>
                <a href="https://www.linkedin.com/school/your_sliate_linkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <AiFillLinkedin className="text-2xl text-white hover:text-[#0077b5] transition" />
                </a>
                <a href="https://www.facebook.com/your_sliate_facebook" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <AiFillFacebook className="text-2xl text-white hover:text-[#1877F2] transition" />
                </a>
                <a href="tel:+94452231492" aria-label="Phone">
                  <AiFillPhone className="text-2xl text-white hover:text-[#22c55e] transition" />
                </a>
              </div>
              <div className="text-sm text-slate-300 leading-5">
                <p>Advanced Technological Institute,</p>
                <p>New Town, Rathnapura</p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:pio@ou.ac.lk"
                    className="underline hover:text-white"
                    target="_blank" // Added target="_blank"
                    rel="noopener noreferrer" // Added rel="noopener noreferrer"
                  >
                    pio@ou.ac.lk
                  </a>
                </p>
                <p>Phone: 045 22 31 492 / 045 22 31 493</p>
              </div>
            </div>
          </div>
        </motion.div>
      </footer>

      {/* Bottom Footer Text */}
      <div className="text-center text-xs py-4 bg-white text-primary">
        © {new Date().getFullYear()} ATI Ratnapura — All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;