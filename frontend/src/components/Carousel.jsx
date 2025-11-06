import React, { useState, useEffect } from "react";

const images = [
  "../src/assets/Slide2.png",
  "../src/assets/Slide1.jpg",
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  });

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-[380px] overflow-hidden mt-0 pt-0">
      {/* Images */}
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            className="w-full h-[380px] object-cover flex-shrink-0"
            alt={`slide-${index}`}
          />
        ))}
      </div>

      {/* Left Button */}
      <button
        className="absolute top-1/2 left-4 -translate-y-1/2 text-black text-3xl font-bold bg-transparent"
        onClick={prevSlide}
      >
        {"<"}
      </button>

      {/* Right Button */}
      <button
        className="absolute top-1/2 right-4 -translate-y-1/2 text-black text-3xl font-bold bg-transparent"
        onClick={nextSlide}
      >
        {">"}
      </button>
    </div>
  );
};

export default Carousel;
