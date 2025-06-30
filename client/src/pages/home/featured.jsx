import React from "react";

const FeaturedCollections = () => {
  return (
    <section className="bg-[#1a1a1a] text-white py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-2 lg:gap-4 xl:gap-4">
          <div className="flex flex-col ">
            <h3 className="text-white text-lg text-left md:text-xl font-normal mb-6">
              Featured Collections
            </h3>
            <h2 className="text-4xl md:text-5xl lg:text-6xl  text-left xl:text-7xl font-light leading-tight mb-8">
              Wall Panels
            </h2>
          </div>
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2070&auto=format&fit=crop"
                alt="Beautiful mosaic wall panel in living room with intricate blue and gold patterns"
                className="w-full h-[300px] md:h-[400px] lg:h-[450px] object-cover rounded-2xl"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <p className="text-base md:text-lg leading-relaxed">
                  Step into a world where every piece of glass is hand-cut,
                  color-selected, and soulfully placed by artisans from Jodhpur.
                  Our mosaic panels are not just décor — they are statements.
                  They bring walls to life through texture, light play, and
                  centuries-old craft.
                </p>
              </div>
              <div>
                <p className="text-base md:text-lg leading-relaxed">
                  Whether you're designing a serene foyer, a luxurious hotel
                  lobby, or an artistic wall in your living space, these panels
                  offer more than beauty — they bring emotion, character, and
                  storytelling to your interiors.
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
