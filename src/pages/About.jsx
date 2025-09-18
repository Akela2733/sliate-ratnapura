// src/pages/AboutUs.jsx
import React from "react";

const About = () => {
  return (
    <div className="pt-12 px-6 md:px-16 lg:px-28 bg-white text-gray-800">
      {/* Hero Section (Vision & Mission) */}
      <div className="grid grid-cols-1 lg:px-28 lg:grid-cols-2 gap-10 items-center mb-16">
        <div className="space-y-12">
          {/* Mission */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <hr className="border-t-4 w-16 border-primary" />
              <span className="text-primary text-xl font-semibold ">Our</span>{" "}
              <span className="text-orange-500 text-xl font-semibold ">Vision</span>
            </div>
            <p className="text-lg leading-relaxed">
              “Creating Excellent Higher National and National Diplomates with
              Modern Technology for Sustainable Development”
            </p>
          </div>

          {/* Vision */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <hr className="border-t-4 w-16 border-primary" />
              <span className="text-primary text-xl font-semibold ">Our</span>{" "}
              <span className="text-orange-500 text-xl font-semibold ">Mision</span>
            </div>
            <p className="text-lg leading-relaxed">
              “To Become the Centre of Excellence in Technological Education”
            </p>
          </div>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((_, index) => (
            <img
              key={index}
              src="/sliate.jpeg" // Assuming this image path is local or static
              alt={`Campus View ${index + 1}`}
              className="w-full h-56 rounded-lg object-cover shadow-md"
            />
          ))}
        </div>
      </div>

      {/* About History Section */}
      <section className="bg-gray-100 py-12 px-4 md:px-16 rounded-lg mb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <hr className="border-t-4 w-16 border-primary" />
            <h2 className="text-5xl font-extrabold ">
              <span className="text-[#0A174E]">About </span>
              <span className="text-[#1C3AA9]">SLIATE</span>
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-justify text-lg">
            As per the recommendations of the Committee appointed by Prof. Wiswa
            Waranapala, Deputy Minister of Higher Education in 1994, the Sri
            Lanka Institute of Advanced Technical Education (SLIATE) was formed
            in 1995, under the Sri Lanka Institute of Advanced Technical
            Education Act No. 29 of 1995, In 2001 the name of the institution
            was amended as Sri Lanka Institute of Advanced Technological
            Education, (SLIATE). It functions as an autonomous Institute for the
            management of Higher National and National Diploma courses. The main
            purposes of establishing SLIATE were to reform and restructure the
            entire technical and vocational education system in relation to the
            changing needs of economic development, to meet manpower
            requirements of national development strategies, and the promotion
            of privatization, With special concern of meeting the scarcity of
            trained technological manpower resources at the technician level.
            <br />
            <br />
            The SLIATE is a statutory body operating under the purview of the
            Ministry of Higher Education and is one of the leading higher
            educational institutions in Srilanka.
            <br />
            <br />
            SLIATE has been focusing on fostering Advanced Technical Education
            at post secondary level. It is mandated to establish Advanced
            Technological Institutes (ATI) in every province for technological
            education. At present it manages and supervises 11 ATIs and 7 ATI
            Sections. Its Chief Executive Officer is the Director General while
            each ATIs and ATI sections are headed by a Director and an Academic
            Coordinator respectively.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;