import { Link, useLocation } from "react-router-dom";

export default function SignupToggle() {
  const { pathname } = useLocation();

  const handleFlip = () => {
    const card = document.getElementById("flip-container");
    if (!card) return;

    card.classList.add("flip");
    setTimeout(() => card.classList.remove("flip"), 600);
  };

  return (
    <div className="flex justify-center mt-4 mb-6 space-x-2">
      <Link
        to="/signup"
        onClick={handleFlip}
        className={`px-4 py-2 rounded-md font-semibold ${
          pathname === "/signup"
            ? "bg-purple-600 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        Student
      </Link>

      <Link
        to="/teacher-signup"
        onClick={handleFlip}
        className={`px-4 py-2 rounded-md font-semibold ${
          pathname === "/teacher-signup"
            ? "bg-purple-600 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        Teacher
      </Link>
    </div>
  );
}
