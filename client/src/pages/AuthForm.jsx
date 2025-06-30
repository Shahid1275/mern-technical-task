import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { setToken } from "../redux/features/authSlice"; // Adjust path
import { loginUser, registerUser } from "../redux/features/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [state, setState] = useState("Sign Up");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token, message } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitHandler = async (data) => {
    setIsSubmitting(true);

    try {
      if (state === "Sign Up") {
        const result = await dispatch(
          registerUser({
            name: data.name,
            email: data.email,
            password: data.password,
          })
        ).unwrap();
        toast.success("Registration successful please log in.", {
          position: "top-right",
          autoClose: 5000,
        });
        setState("Login"); // Switch to Login state
      } else {
        const result = await dispatch(
          loginUser({
            email: data.email,
            password: data.password,
          })
        ).unwrap();
        dispatch(setToken(result.data.token));
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg border border-gray-100"
      >
        <div className="mb-6 flex items-center justify-center gap-3">
          <h1 className="text-3xl font-serif text-gray-900">{state}</h1>
          <hr className="h-[2px] w-10 bg-gray-800" />
        </div>

        {state === "Sign Up" && (
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name", { required: "Name is required" })}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all"
              placeholder="Enter your name"
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all"
            placeholder="Enter your email"
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all"
            placeholder="Enter your password"
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="mb-6 flex justify-between text-sm text-gray-600">
          {state === "Login" && (
            <a
              href="#"
              className="hover:text-gray-800 transition-colors"
              aria-label="Forgot your password"
            >
              Forgot your password?
            </a>
          )}
          <button
            type="button"
            onClick={() => setState(state === "Login" ? "Sign Up" : "Login")}
            className="ml-auto hover:text-gray-800 transition-colors"
            aria-label={`Switch to ${state === "Login" ? "Sign Up" : "Login"}`}
          >
            {state === "Login" ? "Create Account" : "Login Here"}
          </button>
        </div>

        <button
          type="submit"
          className={`w-full rounded-md py-3 text-white font-medium transition-all ${
            isSubmitting
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gray-800 hover:bg-gray-900"
          }`}
          disabled={isSubmitting}
        >
          {state === "Login" ? "Login" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
