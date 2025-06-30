import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import AuthForm from "./pages/AuthForm";
import React from "react";
import DashboardLayout from "./layouts/DashboardLayout";
const App = () => {
  const { token } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={5000} />
      <Router>
        <Routes>
          <Route
            path="/auth"
            element={!token ? <AuthForm /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={token ? <DashboardLayout /> : <Navigate to="/auth" />}
          />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
