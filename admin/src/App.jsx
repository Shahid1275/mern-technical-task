import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import AdminSidebar from "./components/AdminSidebar";
import Navbar from "./components/Navbar";
import Users from "./pages/Users";
import Appointments from "./pages/Appointments";

export const App = () => {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("adminToken", token);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [token]);

  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {!token ? (
          <Login setToken={setToken} />
        ) : (
          <>
            <AdminSidebar setToken={setToken} />
            <Navbar />
            <main className="pt-16 lg:pl-64 transition-all duration-300">
              <div className="p-6">
                <Routes>
                  <Route
                    path="/"
                    element={<Navigate to="/admin/appointments" />}
                  />
                  <Route
                    path="/admin/appointments"
                    element={<Appointments />}
                  />
                  <Route path="/admin/users" element={<Users />} />
                  <Route
                    path="*"
                    element={<Navigate to="/admin/appointments" />}
                  />
                </Routes>
              </div>
            </main>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
