import React from "react";

const CondoProject = () => {
  return (
    <div className="bg-[#111] text-white py-8 sm:py-12 md:py-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6 sm:gap-10 md:gap-16 px-4 sm:px-6 md:px-8">
        <div className="w-full md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
            alt="Interior thumbnail"
            className="rounded-xl w-full object-cover mb-4 sm:mb-6"
          />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-1">
            Condominium Project B
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">
            Full interior design of client's three-bedroom condo unit
          </p>
        </div>
        <div className="w-full md:w-1/2">
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