import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm fixed left-0 lg:left-64 right-0 top-0 z-30 h-16 flex items-center justify-between px-6 transition-all duration-300">
      <div className="text-lg font-semibold text-gray-800 ml-5 pl-5 ">
        Dashboard Overview
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-500 hover:text-gray-700 relative">
          <FaBell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2">
          <FaUserCircle className="w-6 h-6 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 hidden md:inline">
            Super Admin
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
