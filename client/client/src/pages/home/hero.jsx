import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of mosaic images
  const images = [
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582582621959-48d27397dc69?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2070&auto=format&fit=crop",
  ];
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  return (
    <section className="min-h-screen bg-white">
      <div className="h-[70vh] overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt="Beautiful mosaic wall art collection"
          className="w-full h-full object-cover transition-all duration-500 ease-in-out"
        />
      </div>
      <div className="h-[20vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
            <div className="flex-1">
              <h1 className="text-4xl text-left md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight mb-4">
                Wall Mosaic Collection
              </h1>
              <p className="text-lg md:text-xl text-left text-gray-700 font-normal">
                Art that adds soul to your space
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-transparent border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-full text-base font-medium hover:bg-gray-900 hover:text-white transition-all duration-300">
                Explore
              </button>
              <button className="bg-transparent border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-full text-base font-medium hover:bg-gray-900 hover:text-white transition-all duration-300">
                Customize
              </button>
              <button
                onClick={nextImage}
                className="group flex items-center justify-center w-12 h-12 bg-transparent border-2 border-gray-900 text-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 flex-shrink-0"
              >
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
