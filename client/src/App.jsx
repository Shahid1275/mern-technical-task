import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import AuthForm from "./pages/AuthForm";
import DashboardLayout from "./layouts/DashboardLayout";

const App = () => {
  // Correct selector based on your slice name
  const { user } = useSelector((state) => state.user); // or state.auth if you renamed the slice

  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <Routes>
          {/* Home route with auth form */}
          <Route
            path="/"
            element={!user ? <AuthForm /> : <Navigate to="/dashboard" />}
          />

          {/* Protected dashboard */}
          <Route
            path="/dashboard/*"
            element={user ? <DashboardLayout /> : <Navigate to="/" />}
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
