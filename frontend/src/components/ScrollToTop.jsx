import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Yeh component har 'page change' ko detect karega
function ScrollToTop() {
  // 'useLocation' hook humein batata hai ke humara URL change hua hai
  const { pathname } = useLocation();

  // 'useEffect' hook tab chalta hai jab 'pathname' (URL) badalta hai
  useEffect(() => {
    // Jab bhi URL badle, window ko (0, 0) yaani bilkul top par scroll kar do
    window.scrollTo(0, 0);
  }, [pathname]); // Yeh effect [pathname] ke change honay par trigger hoga

  // Yeh component kuch bhi 'dikhaata' nahi hai, bas apna kaam karta hai
  return null;
}

export default ScrollToTop;