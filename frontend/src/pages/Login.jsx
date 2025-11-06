import { Link } from "react-router-dom";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa"

function Login() {
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

          <button className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition">
            Continue
          </button>

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
