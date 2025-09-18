import React, { useState, useEffect } from "react";

const images = [
  "/./slide 2.png",
  "/./slide 2.png",
  "/./slide 3.png",
//   "/cover4.jpg",
];

const Home = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[820px] overflow-hidden">
      {/* Background image slider */}
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`cover-${index}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Overlay content */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center px-10">
        <div className="text-center max-w-4xl">
          <h1 className="font-bold text-white text-[50px]">
            Welcome to ATI - Ratnapura
          </h1>
          <p className="text-white mt-4 text-lg">
            Advanced Technological Institute Ratnapura is one of a government
            institute for higher studies. ATI is under the control of Sri Lanka
            Institute of Advanced Technological Education SLIATE
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
