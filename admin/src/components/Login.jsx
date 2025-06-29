import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginAdmin, clearAdminError } from "../redux/features/adminSlice";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.admin);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear previous errors
    dispatch(clearAdminError());

    try {
      const resultAction = await dispatch(loginAdmin({ email, password }));

      if (loginAdmin.fulfilled.match(resultAction)) {
        toast.success("Admin login successful");
        setToken(resultAction.payload.token);
        navigate("/admin/appointments");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md"
      >
        <div className="space-y-6">
          <p className="text-2xl font-bold text-center text-gray-800">
            <span className="text-blue-600">Admin</span> Panel
          </p>

          {error && (
            <div className="p-2 text-red-500 bg-red-100 rounded text-center">
              {error.message || "Login failed"}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-black text-white font-medium rounded-md transition duration-200 ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
