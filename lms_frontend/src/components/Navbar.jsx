import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const isAuthenticated = !!localStorage.getItem("accessToken"); // Check if the user is authenticated

  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="text-white hover:text-gray-200">
            Home
          </Link>
        </li>
        {isAuthenticated && (
          <li>
            <Link to="/profile" className="text-white hover:text-gray-200">
              Profile
            </Link>
          </li>
        )}
        {!isAuthenticated && (
          <li>
            <Link to="/login" className="text-white hover:text-gray-200">
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;