import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import { Heart, Share2 } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-coverflow";

import slide_image_1 from "../../assets/images/image-1.jpg";
import slide_image_2 from "../../assets/images/image-2.jpg";
import slide_image_3 from "../../assets/images/image-3.jpg";
import slide_image_4 from "../../assets/images/image-4.jpg";
import slide_image_5 from "../../assets/images/image-5.jpg";

const products = [
  {
    id: 1,
    name: "PRODUCT 1",
    price: "$3.000",
    image: slide_image_1,
    bg: "bg-[#946be1]",
  },
  {
    id: 2,
    name: "PRODUCT 2",
    price: "$3.200",
    image: slide_image_2,
    bg: "bg-[#5cc264]",
  },
  {
    id: 3,
    name: "PRODUCT 3",
    price: "$4.500",
    image: slide_image_3,
    bg: "bg-[#18aeef]",
  },
  {
    id: 4,
    name: "PRODUCT 4",
    price: "$3.500",
    image: slide_image_4,
    bg: "bg-[#ff781e]",
  },
  {
    id: 5,
    name: "PRODUCT 5",
    price: "$2.200",
    image: slide_image_5,
    bg: "bg-[#ff9e21]",
  },
];

const ProductCards = () => {
  return (
    <div className="w-full py-14 px-4 bg-white">
      <h1 className="text-4xl font-serif bold italic text-center mb-16">
        Our Signature Products
      </h1>

      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: false,
        }}
        modules={[EffectCoverflow]}
        className="max-w-[1200px] mx-auto swiper_container"
      >
        {products.map((product) => (
          <SwiperSlide
            key={product.id}
            className="!w-[250px] !h-[420px] flex items-center justify-center"
          >
            <div
              className={`relative w-full h-full flex flex-col items-center justify-between p-4 rounded-3xl shadow-xl ${product.bg}`}
            >
              <div className="absolute top-4 left-4">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div className="absolute top-4 right-4">
                <Share2 className="w-5 h-5 text-white" />
              </div>

              <img
                src={product.image}
                alt={product.name}
                className="w-[160px] h-[200px] object-contain mt-10"
              />

              <div className="w-full mt-4 px-2 text-white flex justify-between items-center">
                <p className="text-sm font-semibold">{product.name}</p>
                <p className="text-sm font-semibold">{product.price}</p>
              </div>

              <button className="mt-auto w-full bg-white text-black py-2 rounded-full flex items-center justify-center gap-2 font-medium">
                <span className="text-xl">+</span> Add to Cart
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="bg-white-100 box-shadow-lg mt-16">
      <section className="bg-white text-white py-16 md:py-20 lg:py-24 mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-12 lg:mb-16">
            <div className="lg:col-span-1">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop"
                alt="Modern living room with beautiful tropical mosaic mural featuring palm leaves and birds"
                className="w-full h-[300px] md:h-[400px] lg:h-[450px] object-cover rounded-2xl"
              />
            </div>
            <div className="lg:col-span-2">
              <img
                src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=2070&auto=format&fit=crop"
                alt="Stunning stained glass mosaic with intricate mandala patterns in blues and golds"
                className="w-full h-[300px] md:h-[400px] lg:h-[450px] object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default ProductCards;
