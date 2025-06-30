import React from "react";

const MuralsSection = () => {
  return (
    <section className="bg-[#1a1a1a] text-white py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
          <div className="lg:col-span-1">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop"
              alt="Modern living room with beautiful tropical mosaic mural featuring palm leaves and birds"
              className="w-full h-[300px] md:h-[400px] lg:h-[450px] object-cover rounded-2xl"
            />
          </div>
          <div className="lg:col-span-1">
            <img
              src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=2070&auto=format&fit=crop"
              alt="Stunning stained glass mosaic with intricate mandala patterns in blues and golds"
              className="w-full h-[300px] md:h-[400px] lg:h-[450px] object-cover rounded-2xl"
            />
          </div>
        </div>
        <div className="w-full flex gap-8 md:flex-row flex-col  mb-10">
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed md:w-7/12">
            Trimoss mosaic murals are immersive expressions of color, texture,
            and tradition. Hand-assembled by skilled artisans, each mural tells
            a unique story — whether it's a modern mandala, a Rajasthani
            folklore scene, or an abstract geometric burst. These pieces are
            more than wall décor; they are permanent installations of identity
            and imagination.
          </p>
          <div className="lg:col-span-1 flex items-center justify-center lg:justify-end md:w-4/12">
            <h2 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-white leading-none">
              Murals
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MuralsSection;
