import React from "react";

const TablesFurnitureSection = () => {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 ">
          <div className="order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop"
              alt="Beautiful mosaic table with intricate geometric patterns and colorful Jodhpuri designs"
              className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover rounded-lg"
            />
          </div>
          <div className="order-1 lg:order-2 flex flex-col text-left">
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-gray-900 leading-tight mb-8">
              Tables &<br />
              Furniture
            </h2>
            <div className="space-y-2 mt-16  text-left">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-light text-gray-900">
                Residential Projects
              </h3>
              <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-lg">
                From royal Jodhpuri inspirations to modern geometric patterns,
                these tables bring color, texture, and artisanal depth into
                everyday living.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TablesFurnitureSection;
