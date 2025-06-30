import React from "react";

const CondoProject = () => {
  return (
    <div className="bg-[#111] text-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16 px-4 md:px-8">
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
            alt="Interior thumbnail"
            className="rounded-xl mb-6 w-3/4 md:w-4/5"
          />
          <h2 className="text-2xl md:text-3xl font-medium mb-2">
            Condominium Project B
          </h2>
          <p className="text-gray-300 text-sm md:text-base">
            Full interior design of client's three-bedroom condo unit
          </p>
        </div>
        <div className="">
          <img
            src="./src/assets/images/image-6.jpg"
            alt="Interior design full image"
            className="rounded-xl w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default CondoProject;
