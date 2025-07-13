import React from 'react';

const QuoteSection = () => {
  return (
    <div className="relative w-full h-[100vh] bg-black text-white overflow-hidden">
      <img
        src="./src/assets/images/image-7.jpeg"
        alt="Elegant living room"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-20 lg:px-32">
        <p className="text-3xl md:text-5xl lg:text-6xl font-light leading-snug md:leading-snug max-w-4xl">
          I enjoy the challenge of <br />
          transforming a space into <br />
          something fresh and <br />
          engaging.
        </p>
         <div className="absolute bottom-10 right-10 z-20">
        <div className="px-6 py-3 border border-white rounded-full text-lg italic">
          Arden Lee
        </div>
      </div>
      </div>
    </div>
  );
};

export default QuoteSection;
