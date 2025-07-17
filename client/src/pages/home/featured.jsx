import React from "react";

const FeaturedCollections = () => {
  return (
    <section className="bg-[#1a1a1a] text-white py-10 sm:py-14 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4">
          <div className="flex flex-col">
            <h3 className="text-white text-base sm:text-lg md:text-xl font-normal mb-3 sm:mb-4 md:mb-6 text-left">
              Featured Collections
            </h3>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight mb-4 sm:mb-6 md:mb-8 text-left">
              Wall Panels
            </h2>
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-6 sm:mb-8">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2070&auto=format&fit=crop"
                alt="Beautiful mosaic wall panel"
                className="w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[450px] object-cover rounded-2xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                  Step into a world where every piece of glass is hand-cut,
                  color-selected, and soulfully placed by artisans from Jodhpur.
                  Our mosaic panels are not just décor — they are statements.
                </p>
              </div>
              <div>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                  Whether you're designing a serene foyer or a luxurious hotel
                  lobby, these panels offer more than beauty — they bring
                  emotion, character, and storytelling to your interiors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;