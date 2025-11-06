import React from "react";
import {
  FaGoogle,
  FaAmazon,
  FaMicrosoft,
  FaApple,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaSalesforce,
} from "react-icons/fa";

// All brand icons
const BRANDS = [
  { id: 1, logo: <FaGoogle size={45} /> },
  { id: 2, logo: <FaAmazon size={45} /> },
  { id: 3, logo: <FaMicrosoft size={45} /> },
  { id: 4, logo: <FaApple size={45} /> },
  { id: 5, logo: <FaFacebook size={45} /> },
  { id: 6, logo: <FaLinkedin size={45} /> },
  { id: 7, logo: <FaYoutube size={45} /> },
  { id: 8, logo: <FaSalesforce size={45} /> },
];

const BrandsSection = () => {
  return (
    <div className="bg-white py-12 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <p className="text-center text-gray-600 font-semibold mb-8">
          Trusted by over 17,000 companies and millions of learners around the world
        </p>

        <div className="relative w-full overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap items-center gap-16">
            {BRANDS.map((brand) => (
              <div
                key={brand.id}
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                {brand.logo}
              </div>
            ))}

            {/* Duplicate for seamless loop */}
            {BRANDS.map((brand) => (
              <div
                key={brand.id + "-copy"}
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                {brand.logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsSection;
