import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ✅ YEH PATH AAP KE SCREENSHOT KE MUTAABIQ 100% THEEK HAI
import Slide1 from "../assets/Slide1.jpg";
import Slide2 from "../assets/Slide2.png";

// --- NAYA, PROFESSIONAL SLIDE CONTENT ---
const slideContent = [
  {
    image: Slide1,
    title: "Start Your Learning Journey Today",
    subtitle: "Access thousands of expert-led courses in tech, business, and more.",
    buttonText: "Browse Courses",
    buttonLink: "/pricing" // Aap isay '/categories/web-development' ya kuch bhi kar sakte hain
  },
  {
    image: Slide2,
    title: "Unlock Your Full Potential",
    subtitle: "Learn in-demand skills to achieve your personal and professional goals.",
    buttonText: "Join for Free",
    buttonLink: "/signup"
  }
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  // --- Website se matching button style ---
  const ctaButtonClasses = "bg-purple-700 text-white font-bold py-3 px-7 rounded text-lg hover:bg-purple-800 transition-colors duration-200 shadow-md";

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideContent.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slideContent.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slideContent.length) % slideContent.length);
  };

  return (
    // Height thori barha di hai
    <div className="relative w-full h-[420px] overflow-hidden mt-0 pt-0">
      
      {/* Slides wrapper */}
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slideContent.map((slide, index) => (
          <div key={index} className="relative w-full h-[420px] flex-shrink-0">
            {/* Slide image */}
            <img
              src={slide.image}
              className="w-full h-full object-cover"
              alt={`slide-${index}`}
            />

            {/* --- REDESIGNED OVERLAY --- */}
            <div className="absolute inset-0 flex flex-col justify-center items-start text-left p-8 md:p-16 lg:p-24 
                          bg-gradient-to-r from-black/70 to-black/30">
              
              {/* Content ke liye max-width taake text hamesha aacha lage */}
              <div className="max-w-xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
                  {slide.title}
                </h1>

                <p className="text-xl md:text-2xl mb-8 text-gray-200 drop-shadow-lg">
                  {slide.subtitle}
                </p>

                {/* --- REDESIGNED BUTTON --- */}
                <Link to={slide.buttonLink} className={ctaButtonClasses}>
                  {slide.buttonText}
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* --- Prev/Next Buttons (Behtar style) --- */}
      <button
        className="absolute top-1/2 left-4 -translate-y-1/2 text-white bg-white/20 p-2 rounded-full hover:bg-white/40 transition-all duration-200"
        onClick={prevSlide}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        className="absolute top-1/2 right-4 -translate-y-1/2 text-white bg-white/20 p-2 rounded-full hover:bg-white/40 transition-all duration-200"
        onClick={nextSlide}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* --- NAYE INDICATOR DOTS --- */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {slideContent.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 cursor-pointer
              ${current === i ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/50'}`}
            onClick={() => setCurrent(i)} // Dots ko clickable banaya
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;