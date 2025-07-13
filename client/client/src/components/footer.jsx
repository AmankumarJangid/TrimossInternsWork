import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <div className="bg-black pt-24">
      <footer className="rounded-tl-[50px] rounded-tr-[50px] bg-white py-16 md:py-20  mt-40 -top-16 ">
        <div className="max-w-7xl mx-auto px-4 md:px-8 ">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20">
                  <img
                    src="./src/assets/images/image-9.jpg"
                    alt="Trimoss Logo"
                    className="object-contain w-full h-full"
                  />
                </div>

                <h3 className="text-2xl md:text-3xl font-medium text-gray-900">
                  Trimoss Pvt. Ltd.
                </h3>
              </div>

              <div className="max-w-md">
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  Stay in the loop and sign up for the Trimoss newsletter:
                </p>

                <form onSubmit={handleSubmit} className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-6 py-4 pr-16 border border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1.5 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-300"
                  >
                    <ArrowRight size={20} />
                  </button>
                </form>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">
                Company
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="/"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Solutions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Team
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Career
                  </a>
                </li>
              </ul>
            </div>

            {/* Documentation Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">
                Documentation
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Help Centre
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">
                Social
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Youtube
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 text-base">
                © Trimoss Pvt. Ltd. All Rights Reserved 2025
              </p>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
