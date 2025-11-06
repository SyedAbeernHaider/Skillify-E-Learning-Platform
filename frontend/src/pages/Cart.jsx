import React, { useState, useEffect } from 'react'; // useEffect import kiya
import { Link } from "react-router-dom";

// --- IMAGE URL FIX ---
// Aap ka diya gaya naya URL
const emptyCartImage = "https://s.udemycdn.com/browse_components/flyout/empty-shopping-cart-v2-2x.jpg";

// --- NAYA LOADER COMPONENT ---
// Yeh ek simple circle loader hai jo page ke beech mein dikhega
const CircleLoader = () => (
  <div className="flex justify-center items-center min-h-[300px]"> {/* FIX: Height 60vh se 300px kar di */}
    <div className="w-16 h-16 border-4 border-t-4 border-t-purple-700 border-gray-200 rounded-full animate-spin"></div>
  </div>
);
// --- END LOADER COMPONENT ---


const Cart = () => {
  // --- YEH SAB SE ZAROORI HISS H ---
  // Backend se aanay wala data is 'cartItems' state mein store hoga.
  const [cartItems, setCartItems] = useState([]); 
  
  // --- NAYI LOADING STATE ---
  // Default true hai taake component load hotay hi loader dikhe
  const [isLoading, setIsLoading] = useState(true);
  // --- END ---

  // --- BUTTON FIX --- 'rounded' ko 'rounded-md' kar diya
  const ctaButtonClasses = "bg-purple-700 text-white font-bold py-3 px-7 rounded-md text-lg hover:bg-purple-800 transition-colors duration-200 shadow-md";

  // --- NAYA USEEFFECT (Data Fetching Simulation) ---
  // Yeh backend se data laane ko simulate kar raha hai
  useEffect(() => {
    // 1.5 second ka delay simulate kar rahe hain
    const timer = setTimeout(() => {
      // Yahan aap backend se data fetch karne ke baad yeh dono set kareinge:
      // 1. Data set karein (filhaal empty set kar rahe hain)
      setCartItems([]); 
      // 2. Loading false kar dein
      setIsLoading(false); 
    }, 1500); // 1.5 seconds

    // Cleanup function
    return () => clearTimeout(timer);
  }, []); // Empty array [] ka matlab hai ke yeh sirf ek baar component mount honay par chalega
  // --- END USEEFFECT ---
  
  // --- NAYA CONDITIONAL RETURN ---
  // Jab tak data load ho raha hai, loader dikhao
  if (isLoading) {
    return (
      // --- LAYOUT FIX --- Background white kar diya
      <div className="bg-white min-h-screen">
        <div className="container mx-auto max-w-5xl py-12 px-4 sm:px-6 lg:px-8">
          {/* --- FIX: Heading waapis add kar di --- */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shopping Cart
          </h1>
          {/* --- LAYOUT FIX --- Border hata di aur pt-8 kar diya --- */}
          <div className="pt-8">
            <CircleLoader />
          </div>
        </div>
      </div>
    );
  }
  // --- END CONDITIONAL RETURN ---


  // Jab loading false ho jayegi, toh yeh neeche wala code chalega
  return (
    // --- LAYOUT FIX --- Background white kar diya
    <div className="bg-white min-h-screen">
      <div className="container mx-auto max-w-5xl py-12 px-4 sm:px-6 lg:px-8">
        
        {/* --- FIX: Heading waapis add kar di --- */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Shopping Cart
        </h1>

        {/* --- LAYOUT FIX --- Border hata di aur pt-8 kar diya --- */}
        <div className="pt-8">

          {/* --- Dynamic Course Count --- */}
          {/* --- LAYOUT FIX --- margin zyaada kar di (mb-12) --- */}
          <h2 className="text-xl text-gray-700 mb-12 text-center md:text-left">
            {cartItems.length} Courses in Cart
          </h2>

          {/* --- CONDITIONAL LOGIC (Backend Friendly) ---
            Yahan hum check kar rahe hain ke cart mein items hain ya nahi
          */}
          
          {cartItems.length === 0 ? (
            /* --- STATE 1: JAB CART KHAALI HAI (Aap ki di hui image) --- */
            // --- LAYOUT FIX --- padding 'pt-12' se 'pt-4' kar di
            <div className="flex flex-col items-center justify-center text-center pt-4"> 
              <img 
                src={emptyCartImage} 
                alt="Empty shopping cart" 
                // --- IMAGE SIZE FIX --- Nayi image ke liye size 'h-32 w-32' kar diya
                className="h-32 w-32 mb-6" 
              />
              <p className="text-lg text-gray-600 mb-6">
                Your cart is empty. Keep shopping to find a course!
              </p>
              {/* --- FIX: Button ka link "/pricing" kar diya --- */}
              <Link to="/pricing" className={ctaButtonClasses}>
                Keep shopping
              </Link>
            </div>

          ) : (
            /* --- STATE 2: JAB CART MEIN ITEMS HONGE --- */
            // Yeh hissa tab dikhega jab 'cartItems' array mein data hoga
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Side: Course List */}
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-4">Your Courses</h3>
                {/* Yahan hum backend se aaye data ko .map() karke list banayenge.
                  (Yeh hum baad mein design karenge)
                */}
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="p-4 border rounded-md shadow-sm bg-white">
                      {/* Placeholder - Yahan course card design aayega */}
                      <h4 className="font-semibold">{item.title}</h4> 
                      <p>Course ID: {item.id}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Checkout Summary */}
              <div className="w-full lg:w-80">
                <div className="bg-white p-6 shadow-md rounded-md sticky top-24">
                  <h3 className="text-xl font-semibold mb-4">Total:</h3>
                  {/* Placeholder - Yahan price calculation hogi */}
                  <p className="text-3xl font-bold mb-6">$[Total Price]</p>
                  <button className={`${ctaButtonClasses} w-full`}>
                    Checkout
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Cart;