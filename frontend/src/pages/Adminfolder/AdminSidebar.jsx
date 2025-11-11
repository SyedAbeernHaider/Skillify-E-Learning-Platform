import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaBook, FaSignOutAlt } from 'react-icons/fa';

// Yeh component props se 'setActiveView' lega taake main page ko bata sake ke kya dikhana hai
const AdminSidebar = ({ activeView, setActiveView }) => {

  // Button ki common styling
  const buttonClass = "w-full flex items-center text-left p-3 rounded-md font-medium transition-all duration-200";
  const activeClass = "bg-purple-600 text-white shadow-lg";
  const inactiveClass = "text-gray-600 hover:bg-gray-200 hover:text-gray-900";

  // Logout function (example)
  const handleLogout = () => {
    // Yahan aap future mein logout logic likhenge (e.g., token clear karna)
    alert("Logout par click hua!");
    // Aur logout ke baad user ko home page par bhej dein
  };

  return (
    // Sidebar ka container
    <div className="w-64 h-screen bg-white shadow-lg fixed top-0 left-0 p-6 flex flex-col">
      {/* Logo/Title */}
      <div className="mb-8 text-center">
        <Link to="/" className="text-2xl font-bold text-purple-600">
          Skillify <span className="text-gray-700">Admin</span>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1">
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`${buttonClass} ${activeView === 'dashboard' ? activeClass : inactiveClass}`}
            >
              <FaHome className="mr-3 text-lg" />
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView('users')}
              className={`${buttonClass} ${activeView === 'users' ? activeClass : inactiveClass}`}
            >
              <FaUsers className="mr-3 text-lg" />
              Manage Users
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView('courses')}
              className={`${buttonClass} ${activeView === 'courses' ? activeClass : inactiveClass}`}
            >
              <FaBook className="mr-3 text-lg" />
              Manage Courses
            </button>
          </li>
        </ul>
      </nav>

      {/* Logout Button (Neeche) */}
      <div>
        <Link
          to="/" // Logout ke baad home par bhej dein
          onClick={handleLogout}
          className={`${buttonClass} ${inactiveClass} bg-red-50 hover:bg-red-100 text-red-700`}
        >
          <FaSignOutAlt className="mr-3 text-lg" />
          Logout
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;