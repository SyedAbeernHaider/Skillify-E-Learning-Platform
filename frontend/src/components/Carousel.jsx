import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ✅ Correct image imports
import Slide1 from "/src/assets/Slide1.jpg";
import Slide2 from "/src/assets/Slide2.png";

const images = [Slide1, Slide2];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-[380px] overflow-hidden mt-0 pt-0">
      {/* Slides wrapper */}
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, index) => (
          <div key={index} className="relative w-full h-[380px] flex-shrink-0">
            {/* Slide image */}
            <img
              src={src}
              className="w-full h-full object-cover"
              alt={`slide-${index}`}
            />

            {/* Overlay content */}
            <div className="absolute inset-0 flex flex-col justify-center items-start text-left p-8 md:p-16 lg:p-24 bg-black bg-opacity-30">
              <h1
                className={`text-5xl md:text-6xl font-extrabold mb-2 ${
                  index === 0 ? "text-purple-600" : "text-yellow-400"
                }`}
              >
                Skillify
              </h1>

              <p
                className={`text-xl md:text-2xl mb-6 ${
                  index === 0 ? "text-gray-200" : "text-white"
                }`}
              >
                Education is the passport to the future
              </p>

              <Link to="/signup">
                <button
                  className={`py-3 px-8 rounded-md font-semibold text-lg transition-colors duration-300
                  ${
                    index === 0
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-yellow-400 text-purple-800 hover:bg-yellow-500"
                  }`}
                >
                  Get Started 🚀
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Prev Button */}
      <button
        className="absolute top-1/2 left-4 -translate-y-1/2 text-white bg-black bg-opacity-40 p-2 rounded-full hover:bg-opacity-60 transition"
        onClick={prevSlide}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        className="absolute top-1/2 right-4 -translate-y-1/2 text-white bg-black bg-opacity-40 p-2 rounded-full hover:bg-opacity-60 transition"
        onClick={nextSlide}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Carousel;
