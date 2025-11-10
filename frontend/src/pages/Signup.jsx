import { Link } from "react-router-dom";
// --- 1. FaEye aur FaEyeSlash import karein ---
import { FaGoogle, FaFacebook, FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import loginIllustration from "../assets/Login image.webp";
import SignupToggle from "../components/SignupToggle";

function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "", // <-- 2. Confirm Password ke liye state
    marketingConsent: false,
  });

  // --- 3. Dono passwords ki visibility ke liye States ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // --- 4. Password error ke liye State ---
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Jab user type kare toh error hata dein
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // --- 5. Password matching validation ---
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return; // Submit rok dein
    }
    
    setPasswordError(""); // Agar match ho jaye toh error clear karein
    console.log("Student Signup:", formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="hidden md:flex w-1/2 justify-center">
        <img src={loginIllustration} alt="Illustration" className="max-w-md" />
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div
          id="flip-container"
          className="bg-white p-8 rounded-lg shadow-md w-96"
        >
          <SignupToggle />

          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Sign up with email
            </h2>

            <input
              type="text"
              name="fullName"
              placeholder="Full name"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:border-purple-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:border-purple-500"
            />

            {/* --- 6. Password Input (Wrapper ke sath) --- */}
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 pr-10 focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* --- 7. Confirm Password Input (Wrapper ke sath) --- */}
            <div className="relative mb-4">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 pr-10 focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {/* --- 8. Error message dikhane ki jagah --- */}
            {passwordError && (
              <p className="text-red-500 text-sm mb-4 -mt-2 ml-1">{passwordError}</p>
            )}

            <div className="flex items-center mb-4 text-sm ml-2">
              <input
                type="checkbox"
                name="marketingConsent"
                checked={formData.marketingConsent}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-600 ml-2">
                Send me special offers & recommendations
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition"
            >
              Continue
            </button>
            
            {/* ... Baqi code waisa hi ... */}

            <div className="my-6 text-center text-gray-400 text-sm">
              Other sign up options
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
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;