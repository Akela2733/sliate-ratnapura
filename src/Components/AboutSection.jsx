import React from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AboutSection = () => {
    const Navigate = useNavigate();
  return (
    <div className="flex flex-row items-center justify-center gap-20 max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-start flex-col  w-1/2">
        <p className="text-orange-500 font-bold text-xl">About</p>
        <h1 className="text-primary text-[40px] font-bold pb-4">
          ATI Rathnapura
        </h1>
        <p className="pb-5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad
          consequuntur magni eaque, sunt odit consectetur iusto pariatur enim
          veritatis consequatur excepturi perspiciatis reiciendis ut, velit unde
          harum quis dolores quas? Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Ad consequuntur magni eaque, sunt odit consectetur
          iusto pariatur enim veritatis consequatur excepturi perspiciatis
          reiciendis ut, velit unde harum quis dolores quas?
        </p>

        <button className="bg-orange-500 text-white p-3 rounded-md" onClick={()=>Navigate("/about")}>
          Know More
        </button>
      </div>
      <div>
        <img
          src="/sliate.jpeg"
          alt="University Image"
          className="w-full h-80 object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default AboutSection;
