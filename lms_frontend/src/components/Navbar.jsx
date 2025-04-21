import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Optional: install lucide-react or use Heroicons
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const isInstructor = user?.role === 'instructor';
  
  // State for mobile menu
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Left: Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          MyLMS
        </Link>

        {/* Hamburger - mobile only */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>


        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium">
            Home
          </Link>

          {isAuthenticated && (
            <Link
              to={isInstructor ? '/manage-courses' : '/my-courses'}
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
              My Courses
            </Link>
          )}

          {isAuthenticated && user ? (
            <>
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Logout
              </button>

              <Link to="/profile" className="flex items-center">
                {user.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-white shadow">
          <Link to="/" onClick={closeMenu} className="block text-gray-700 hover:text-indigo-600 font-medium">
            Home
          </Link>
          {isAuthenticated && (
            <Link
              to={isInstructor ? '/manage-courses' : '/my-courses'}
              onClick={closeMenu}
              className="block text-gray-700 hover:text-indigo-600 font-medium"
            >
              My Courses
            </Link>
          )}
          {isAuthenticated && user ? (
            <>
              <button onClick={() => { logout(); closeMenu(); }} className="block text-red-500 font-medium">
                Logout
              </button>
              <Link to="/profile" onClick={closeMenu} className="flex items-center space-x-2">
                {user.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <span className="text-sm text-gray-700 font-medium">{user.username}</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" onClick={closeMenu} className="block text-gray-700 hover:text-indigo-600 font-medium">
                Register
              </Link>
              <Link
                to="/login"
                onClick={closeMenu}
                className="block text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
