import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // <-- 1. Icons import karein
import loginIllustration from "../../assets/Login image.webp";
import SignupToggle from "../../components/SignupToggle";

function TeacherSignup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    specialization: "",
    experience: "",
    accurate: false,
  });

  // --- 2. State banayein password visibility ke liye ---
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Teacher Signup:", formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="hidden md:flex w-1/2 justify-center">
        <img
          src={loginIllustration}
          alt="teacher signup illustration"
          className="max-w-md"
        />
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div
          id="flip-container"
          className="bg-white p-8 rounded-lg shadow-md w-96"
        >
          <SignupToggle />

          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Teacher Registration
            </h2>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
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

            {/* --- 3. Password Input Field (Wrapper ke sath) --- */}
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"} // <-- Dynamic type
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 pr-10 focus:outline-none focus:border-purple-500" // <-- pr-10 add kiya
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

            <input
              type="text"
              name="specialization"
              placeholder="Specialization (e.g. Web Dev, Cybersecurity)"
              required
              value={formData.specialization}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:border-purple-500"
            />

            <input
              type="number"
              name="experience"
              placeholder="Experience (Years)"
              required
              value={formData.experience}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:border-purple-500"
            />

            {/* ... Baqi code waisa hi ... */}
            
            <div className="flex items-center mb-4 text-sm ml-2">
              <input
                type="checkbox"
                name="accurate"
                checked={formData.accurate}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-600 ml-2">
                I confirm that the information provided is accurate.
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TeacherSignup;