// components/Loader.jsx
import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md">
      <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Loader;
