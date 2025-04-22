// Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet renders the current page's component

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}

      {/* Main content */}
      <div className="flex-1 p-6">
        <Outlet />  {/* The content of each page will go here */}
      </div>

      {/* Footer */}
      <footer className="bg-indigo-600 text-white text-center py-4 mt-6">
        <p>&copy; 2025 Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
