import { Link } from "react-router-dom";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import { useState } from "react";
import loginIllustration from "../assets/Login image.webp";

function SignUp() {

  // ✅ Backend-friendly state model
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    marketingConsent: false,
  });

  // ✅ Form submit handler (Backend attach-yable)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 👇 Yaha backend ko send karna bohot easy hoga
    console.log("User SignUp Data:", formData);

    /*
    fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    */
  };

  // ✅ Generic value updater
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 mr-8">
      
      {/* Left Illustration */}
      <div className="hidden md:flex w-1/2 justify-center">
        <img
          src={loginIllustration}
          alt="signup illustration"
          className="max-w-md"
        />
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-96"
        >
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

          <div className="flex items-center mb-4 text-sm ml-2">
            <input
              type="checkbox"
              name="marketingConsent"
              checked={formData.marketingConsent}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-gray-600 ml-2">
              Send me special offers, personalized recommendations, and learning tips.
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition"
          >
            Continue
          </button>

          <div className="my-6 flex items-center">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-400">Other sign up options</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center space-x-4 mb-2">
            <button
              type="button"
              className="border border-gray-300 p-2 rounded-md hover:bg-gray-100 transition"
              onClick={() => console.log("Google OAuth")}
            >
              <FaGoogle className="text-red-500 text-xl" />
            </button>
            <button
              type="button"
              className="border border-gray-300 p-2 rounded-md hover:bg-gray-100 transition"
              onClick={() => console.log("Facebook OAuth")}
            >
              <FaFacebook className="text-blue-600 text-xl" />
            </button>
            <button
              type="button"
              className="border border-gray-300 p-2 rounded-md hover:bg-gray-100 transition"
              onClick={() => console.log("Apple OAuth")}
            >
              <FaApple className="text-black text-xl" />
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
