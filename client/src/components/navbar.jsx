import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#B8956A] px-4 py-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-white text-2xl md:text-3xl font-normal tracking-wide">
          trimoss
        </div>

        <div className="hidden lg:flex items-center space-x-8">
          <Link
            to="/"
            className="text-white hover:text-gray-200 transition-colors text-base font-medium"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="text-white hover:text-gray-200 transition-colors text-base font-medium"
          >
            Shop
          </Link>
          <Link
            to="/cards"
            className="text-white hover:text-gray-200 transition-colors text-base font-medium"
          >
            Collections
          </Link>

          <Link
            to="/product-detail"
            className="text-white hover:text-gray-200 transition-colors text-base font-medium"
          >
            Custom Design
          </Link>
          <a
            href="#"
            className="text-white hover:text-gray-200 transition-colors text-base font-medium"
          >
            About Us
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-200 transition-colors text-base font-medium"
          >
            Blog
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-200 transition-colors text-base font-medium"
          >
            Contact
          </a>
        </div>

        <div className="hidden lg:flex items-center space-x-3">
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-[#B8956A] px-6 py-2 rounded-full text-base font-medium hover:bg-gray-100 transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="border-2 border-white text-white px-6 py-2 rounded-full text-base font-medium hover:bg-white hover:text-[#B8956A] transition-colors"
          >
            Sign up
          </button>
        </div>

        <button
          onClick={toggleMenu}
          className="lg:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden mt-4 pb-4">
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="text-white hover:text-gray-200 transition-colors text-base font-medium py-2"
            >
              Home
            </Link>
            <a
              href="#"
              className="text-white hover:text-gray-200 transition-colors text-base font-medium py-2"
            >
              Shop
            </a>
            <Link
              to="/cards"
              className="text-white hover:text-gray-200 transition-colors text-base font-medium py-2"
            >
              Collections
            </Link>
            <a
              href="#"
              className="text-white hover:text-gray-200 transition-colors text-base font-medium py-2"
            >
              Custom Design
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-200 transition-colors text-base font-medium py-2"
            >
              About Us
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-200 transition-colors text-base font-medium py-2"
            >
              Blog
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-200 transition-colors text-base font-medium py-2"
            >
              Contact
            </a>

            <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-[#B8956A] px-6 py-2 rounded-full text-base font-medium hover:bg-gray-100 transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="border-2 border-white text-white px-6 py-2 rounded-full text-base font-medium hover:bg-white hover:text-[#B8956A] transition-colors"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
