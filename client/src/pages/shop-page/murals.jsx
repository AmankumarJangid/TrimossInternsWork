import React from "react";

const MuralsSection = () => {
  return (
    <section className="bg-[#1a1a1a] text-white py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-10 mb-12 lg:mb-20">
          <div className="col-span-1">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop"
              alt="Tropical mosaic mural"
              className="w-full h-64 md:h-80 lg:h-[450px] object-cover rounded-2xl"
            />
          </div>
          <div className="col-span-2">
            <img
              src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=2070&auto=format&fit=crop"
              alt="Mandala stained glass mosaic"
              className="w-full h-64 md:h-80 lg:h-[450px] object-cover rounded-2xl"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <p className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed md:w-7/12">
            At the client's request, the project theme was minimalist and
            modern.
          </p>
          <h2 className="text-6xl sm:text-7xl md:text-8xl font-light text-white tracking-tight">
            Murals
          </h2>
        </div>
      </div>
    </section>
  );
};

export default MuralsSection;
