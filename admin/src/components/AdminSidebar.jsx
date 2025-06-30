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
import {
  logoutAdmin,
  toggleSidebar,
  setSidebarOpen,
} from "../redux/features/adminSlice";

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

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      if (mobile) {
        // On mobile: close sidebar by default
        dispatch(setSidebarOpen(false));
      } else {
        // On desktop: always open sidebar
        dispatch(setSidebarOpen(true));
      }
    };

    window.addEventListener("resize", handleResize);

    // Call on mount
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  return (
    <>
      {/* Mobile Toggle Button: only show if mobile & sidebar closed */}
      {isMobile && !sideBarOpen && (
        <button
          onClick={handleToggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white transition-opacity opacity-100"
          aria-label="Toggle menu"
        >
          <FaBars className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white fixed top-0 z-40 h-screen flex flex-col transition-all duration-300 ease-in-out
          ${
            isMobile
              ? sideBarOpen
                ? "left-0 w-full max-w-xs shadow-xl"
                : "-left-full w-0"
              : "left-0 w-64"
          }
        `}
      >
        {/* Close Button on Mobile */}
        {isMobile && sideBarOpen && (
          <button
            onClick={handleToggleSidebar}
            className="absolute top-4 right-4 p-2 text-gray-300 hover:text-white transition-colors"
            aria-label="Close menu"
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

        {/* Navigation */}
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
                onClick={isMobile ? handleToggleSidebar : undefined}
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
                onClick={isMobile ? handleToggleSidebar : undefined}
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
                onClick={isMobile ? handleToggleSidebar : undefined}
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
                onClick={isMobile ? handleToggleSidebar : undefined}
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

      {/* Overlay for Mobile when sidebar open */}
      {isMobile && sideBarOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 z-30 lg:hidden transition-opacity"
          onClick={handleToggleSidebar}
        />
      )}
    </>
  );
};

export default AdminSidebar;
