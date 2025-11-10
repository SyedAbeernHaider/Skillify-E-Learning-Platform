import { Link } from "react-router-dom";
import { FaGoogle, FaFacebook, FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react"; // <-- 1. useState import karein

function Login() {
  // --- 2. State banayein password visibility ke liye ---
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 mr-10">
      {/* Left Illustration */}
      <div className="hidden md:flex w-1/2 justify-center">
        <img
          src="src/assets/Login image.webp"
          alt="login illustration"
          className="max-w-md"
        />
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Log in to continue your learning journey
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:border-purple-500"
          />
          
          {/* --- 3. Password Input Field (Wrapper ke sath) --- */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"} // <-- Dynamic type
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md p-3 pr-10 focus:outline-none focus:border-purple-500" // <-- pr-10 (padding right) add kiya
            />
            {/* --- 4. Eye Icon Button --- */}
            <button
              type="button" // Form submit hone se roke
              onClick={() => setShowPassword(!showPassword)} // State toggle kare
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Icon change kare */}
            </button>
          </div>
          

          <button className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition">
            Continue
          </button>

          {/* ... Baqi code waisa hi ... */}
          
          <div className="my-6 flex items-center">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-400">Other log in options</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="flex justify-center space-x-4 mb-2">
            <button className="border border-gray-300 p-2 rounded-md">
              <FaGoogle className="text-red-500 text-xl" />
            </button>
            <button className="border border-gray-300 p-2 rounded-md">
              <FaFacebook className="text-blue-600 text-xl" />
            </button>
            <button className="border border-gray-300 p-2 rounded-md">
              <FaApple className="text-black text-xl" />
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-purple-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;