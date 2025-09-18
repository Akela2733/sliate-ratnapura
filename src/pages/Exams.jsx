// src/pages/Exams.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, FileText, BookOpenCheck, Download } from 'lucide-react';

const examSchedules = [
  { semester: 'Fall 2025', date: 'Dec 10 - Dec 20', link: '#', description: 'Final exams for all Fall 2025 courses.' },
  { semester: 'Summer 2025', date: 'Aug 15 - Aug 25', link: '#', description: 'Resit exams and Summer session finals.' },
  { semester: 'Spring 2025', date: 'May 05 - May 15', link: '#', description: 'Mid-term examinations schedule.' },
];

const examResources = [
  { title: 'Exam Guidelines', icon: FileText, description: 'Detailed rules and regulations for all examinations.', link: '#' },
  { title: 'Past Papers Archive', icon: BookOpenCheck, description: 'Access previous years\' question papers for practice.', link: '#' },
  { title: 'Exam Hall Allocations', icon: CalendarDays, description: 'Find your assigned exam hall and seat number.', link: '#' },
];

const Exams = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto text-center mb-12"
      >
        <CalendarDays className="w-20 h-20 text-[#1C3AA9] mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-[#0A174E] mb-4">Examinations Hub</h1>
        <p className=" text-gray-700 max-w-3xl mx-auto">
          Your comprehensive guide to all academic examinations at SLIATE Ratnapura. Stay informed about schedules, guidelines, and resources.
        </p>
      </motion.div>

      {/* Upcoming Exam Schedules Section */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-[#0A174E] mb-8 text-center">Upcoming Exam Schedules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examSchedules.map((schedule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-start transform hover:scale-[1.02] transition-all duration-300"
            >
              <CalendarDays className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-2xl font-semibold text-[#1C3AA9] mb-2">{schedule.semester}</h3>
              <p className="text-gray-700 text-lg mb-3">{schedule.date}</p>
              <p className="text-gray-600 text-base mb-4 flex-grow">{schedule.description}</p>
              <a href={schedule.link} className="mt-auto px-6 py-3 bg-[#1C3AA9] text-white rounded-full hover:bg-[#2B5FE3] transition-colors shadow-md flex items-center">
                View Schedule <Download className="w-4 h-4 ml-2" />
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Important Resources Section */}
      {/* <section className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-[#0A174E] mb-8 text-center">Important Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examResources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-start transform hover:scale-[1.02] transition-all duration-300"
              >
                <Icon className="w-10 h-10 text-green-600 mb-4" />
                <h3 className="text-2xl font-semibold text-[#1C3AA9] mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-base mb-4 flex-grow">{resource.description}</p>
                <a href={resource.link} className="mt-auto px-6 py-3 border border-[#1C3AA9] text-[#1C3AA9] rounded-full hover:bg-[#1C3AA9] hover:text-white transition-colors shadow-md">
                  Access Resource
                </a>
              </motion.div>
            );
          })}
        </div>
      </section> */}
    </div>
  );
};

export default Exams;
