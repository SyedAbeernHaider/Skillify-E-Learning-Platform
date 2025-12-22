import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

// --- SVG Icons ---
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
    navigate('/');
  };

  // Get dashboard link based on role
  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'instructor':
        return '/instructor/dashboard';
      case 'student':
        return '/student/dashboard';
      default:
        return '/';
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-purple-600">Skillify</Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/courses" className="text-gray-600 hover:text-purple-600 transition-colors no-underline">Courses</Link>
              {!isAuthenticated && (
                <>
                  <Link to="/pricing" className="text-gray-600 hover:text-purple-600 transition-colors no-underline">Plans & Pricing</Link>
                  <Link to="/teachonskillify" className="text-gray-600 hover:text-purple-600 transition-colors no-underline">Teach on Skillify</Link>
                </>
              )}
              {isAuthenticated && (
                <Link to={getDashboardLink()} className="text-gray-600 hover:text-purple-600 transition-colors no-underline">Dashboard</Link>
              )}
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8 hidden lg:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search for anything"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Right Side Icons & Buttons */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                {/* Cart Icon (only for students) */}
                {user?.role === 'student' && (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsCartOpen(true)}
                    onMouseLeave={() => setIsCartOpen(false)}
                  >
                    <Link to="/cart" className="text-gray-600 hover:text-purple-600 p-2 rounded-full transition-colors">
                      <CartIcon />
                    </Link>

                    {isCartOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-md border border-gray-200 shadow-lg z-50 p-6 text-center">
                        <p className="text-gray-700 text-lg font-semibold mb-4">Your cart is empty.</p>
                        <Link
                          to="/cart"
                          className="font-bold text-purple-600 hover:text-purple-800 transition-colors"
                          onClick={() => setIsCartOpen(false)}
                        >
                          Keep shopping
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Profile Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="font-medium">{user?.firstName || 'User'}</span>
                    <ChevronDownIcon />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md border border-gray-200 shadow-lg z-50 py-2">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <p className="text-xs text-purple-600 font-medium mt-1 capitalize">{user?.role}</p>
                      </div>

                      <Link
                        to={getDashboardLink()}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Dashboard
                      </Link>

                      {user?.role === 'student' && (
                        <>
                          <Link
                            to="/student/enrolled"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            My Courses
                          </Link>
                          <Link
                            to="/cart"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            My Cart
                          </Link>
                        </>
                      )}

                      {user?.role === 'instructor' && (
                        <>
                          <Link
                            to="/instructor/courses"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            My Courses
                          </Link>
                          <Link
                            to="/instructor/courses/create"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Create Course
                          </Link>
                        </>
                      )}

                      <div className="border-t border-gray-200 mt-2">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <div
                  className="relative"
                  onMouseEnter={() => setIsCartOpen(true)}
                  onMouseLeave={() => setIsCartOpen(false)}
                >
                  <Link to="/cart" className="text-gray-600 hover:text-purple-600 p-2 rounded-full transition-colors">
                    <CartIcon />
                  </Link>

                  {isCartOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-md border border-gray-200 shadow-lg z-50 p-6 text-center">
                      <p className="text-gray-700 text-lg font-semibold mb-4">Your cart is empty.</p>
                      <Link
                        to="/cart"
                        className="font-bold text-purple-600 hover:text-purple-800 transition-colors"
                        onClick={() => setIsCartOpen(false)}
                      >
                        Keep shopping
                      </Link>
                    </div>
                  )}
                </div>

                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-700 rounded-md hover:bg-purple-400 hover:text-white transition-colors">Log in</Link>
                <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 transition-colors">Sign up</Link>
              </div>
            )}

            {/* Mobile Menu Burger Icon */}
            <div className="md:hidden ml-4">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-purple-600 focus:outline-none">
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {isAuthenticated && (
              <div className="border-b border-gray-200 pb-3 mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.firstName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-purple-600 font-medium capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
            )}

            <Link to="/courses" className="block px-2 py-1 text-gray-600 hover:text-purple-600">Courses</Link>

            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="block px-2 py-1 text-gray-600 hover:text-purple-600">Dashboard</Link>

                {user?.role === 'student' && (
                  <>
                    <Link to="/student/enrolled" className="block px-2 py-1 text-gray-600 hover:text-purple-600">My Courses</Link>
                    <Link to="/cart" className="block px-2 py-1 text-gray-600 hover:text-purple-600">My Cart</Link>
                  </>
                )}

                {user?.role === 'instructor' && (
                  <>
                    <Link to="/instructor/courses" className="block px-2 py-1 text-gray-600 hover:text-purple-600">My Courses</Link>
                    <Link to="/instructor/courses/create" className="block px-2 py-1 text-gray-600 hover:text-purple-600">Create Course</Link>
                  </>
                )}

                <div className="border-t pt-4">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-2 py-1 text-red-600 hover:text-red-700 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/pricing" className="block px-2 py-1 text-gray-600 hover:text-purple-600">Plans & Pricing</Link>
                <Link to="/teachonskillify" className="block px-2 py-1 text-gray-600 hover:text-purple-600">Teach on Skillify</Link>

                <div className="border-t pt-4 space-y-2">
                  <Link to="/login" className="block w-full text-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-700 rounded-md hover:bg-gray-100">Log in</Link>
                  <Link to="/signup" className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">Sign up</Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
