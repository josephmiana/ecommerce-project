import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode"; // Correct import for jwtDecode
import { useNavigate } from "react-router-dom"; // Import useNavigate

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [minLoadComplete, setMinLoadComplete] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false); // Track whether it's login or register mode

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async () => {
    setLoading(true);
    setMinLoadComplete(false);
    setTimeout(() => {
      setMinLoadComplete(true);
    }, 2000);

    try {
      const endpoint = isRegisterMode
        ? "https://ecommerce-backend-server-production.up.railway.app/register"
        : "https://ecommerce-backend-server-production.up.railway.app/login";

      const method = "POST";
      const headers = { "Content-Type": "application/json" };

      const body = isRegisterMode
        ? JSON.stringify({ name, address, email, password })
        : JSON.stringify({ email, password });

      const response = await fetch(endpoint, { method, headers, body });

      if (!response.ok) {
        throw new Error(
          `${isRegisterMode ? "Registration" : "Login"} failed: ${
            response.statusText
          }`
        );
      }

      const data = await response.json();

      if (!isRegisterMode) {
        const decoded = jwtDecode(data.token);

        // Save the token in local storage
        localStorage.setItem("token", data.token);

        // Check if the user is an admin
        if (decoded.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/");
        }

        onLoginSuccess();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Logged in successfully!",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
          background: "#efefef",
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Registered successfully!",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
          background: "#efefef",
        });
      }

      setName("");
      setAddress("");
      setEmail("");
      setPassword("");
      onClose();
    } catch (error) {
      console.error(
        `${isRegisterMode ? "Registration" : "Login"} failed`,
        error.message
      );
      await Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error",
        text: error.message,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: "#efefef",
      });
      setLoading(false);
    } finally {
      let checkCount = 0;
      const maxChecks = 30;
      const checkInterval = setInterval(() => {
        if (minLoadComplete) {
          setLoading(false);
          clearInterval(checkInterval);
        } else if (checkCount >= maxChecks) {
          setLoading(false);
          clearInterval(checkInterval);
        }
        checkCount++;
      }, 100);
    }
  };

  useEffect(() => {
    if (
      (isRegisterMode && name && address && email && password) ||
      (!isRegisterMode && email && password)
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [name, address, email, password, isRegisterMode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {loading
            ? "Processing ..."
            : isRegisterMode
            ? "Register"
            : "Log In"}
        </h2>

        {/* Name Field (Register Mode Only) */}
        {isRegisterMode && (
          <div className="relative mb-6">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="h-12 w-full px-6 text-xl text-gray-800 border-b-2 border-gray-400 outline-none focus:border-blue-500"
            />
          </div>
        )}

        {/* Address Field (Register Mode Only) */}
        {isRegisterMode && (
          <div className="relative mb-6">
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              className="h-12 w-full px-6 text-xl text-gray-800 border-b-2 border-gray-400 outline-none focus:border-blue-500"
            />
          </div>
        )}

        {/* Email Field */}
        <div className="relative mb-6">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-12 w-full px-6 text-xl text-gray-800 border-b-2 border-gray-400 outline-none focus:border-blue-500"
          />
        </div>

        {/* Password Field */}
        <div className="relative mb-6">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-14 w-full px-6 text-xl text-gray-800 border-b-2 border-gray-400 outline-none focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={buttonDisabled}
          className="w-full py-3 bg-blue-500 text-white rounded-lg mt-4 disabled:opacity-50"
        >
          {isRegisterMode ? "Register" : "Login"}
        </button>

        {/* Register/Login Toggle */}
        <div className="text-center mt-4">
          <button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-blue-500 underline"
          >
            {isRegisterMode
              ? "Already have an account? Log in"
              : "Don't have an account? Register"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
