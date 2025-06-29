import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUsers,
  FaSignOutAlt,
  FaUserShield,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin, toggleSidebar } from "../redux/features/adminSlice";

const AdminSidebar = ({ setToken }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sideBarOpen, isAdmin } = useSelector((state) => state.admin);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    setToken("");
    navigate("/");
  };

  const toggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile && sideBarOpen) {
        dispatch({ type: "TOGGLE_SIDEBAR" });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch, sideBarOpen]);

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className={`fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white transition-all ${
            sideBarOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <FaBars className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white fixed lg:static top-0 z-40 h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isMobile
            ? sideBarOpen
              ? "left-0 w-64"
              : "-left-64 w-0"
            : "left-0 w-64"
        }`}
        style={{ position: "fixed" }}
      >
        {/* Close Button (Mobile) */}
        {isMobile && sideBarOpen && (
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 p-2 text-gray-300 hover:text-white transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        )}

        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700 flex items-center">
          <FaUserShield className="text-blue-400 w-6 h-6 mr-3" />
          <span className="text-xl font-bold text-gray-100 truncate">
            {isAdmin ? "Super Admin" : "Admin Panel"}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {isAdmin ? (
            <>
              <NavLink
                to="/admin/appointments"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`
                }
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <FaCalendarAlt className="w-5 h-5 mr-3" />
                <span className="text-base font-medium">Appointments</span>
              </NavLink>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`
                }
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <FaUsers className="w-5 h-5 mr-3" />
                <span className="text-base font-medium">Users</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`
                }
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <FaCalendarAlt className="w-5 h-5 mr-3" />
                <span className="text-base font-medium">Appointments</span>
              </NavLink>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`
                }
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <FaUsers className="w-5 h-5 mr-3" />
                <span className="text-base font-medium">Users</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <FaSignOutAlt className="w-5 h-5 mr-3" />
            <span className="text-base font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isMobile && sideBarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default AdminSidebar;
