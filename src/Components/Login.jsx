import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {jwtDecode} from "jwt-decode"; // Correct import for jwtDecode
import { useNavigate } from "react-router-dom"; // Import useNavigate

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [minLoadComplete, setMinLoadComplete] = useState(false);
  
  const navigate = useNavigate(); // Initialize useNavigate
  
  const onLogin = async () => {
    setLoading(true);
    setMinLoadComplete(false);
    setTimeout(() => {
      setMinLoadComplete(true);
    }, 2000);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed: " + response.statusText);
      }

      const data = await response.json();
      const decoded = jwtDecode(data.token);
      
      // Save the token in local storage
      localStorage.setItem("token", data.token);
      
      // Check if the user is an admin
      if (decoded.isAdmin) {
        // Navigate to the admin panel if isAdmin is true
        navigate("/admin"); // Replace with your actual admin panel route
      } else {
        // Navigate to the home page if isAdmin is false
        navigate("/"); // Home page route
      }

      onLoginSuccess(); // Notify the parent component that login was successful
      setEmail("");
      setPassword("");
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Logged in successfully!",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#efefef",
      });

      onClose(); // Close modal after successful login
    } catch (error) {
      console.log("Login failed", error.message);
      await Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Incorrect Credentials",
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
    if (email.length > 3 && password.length > 3) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [email, password]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {loading ? "Processing ..." : "Log In"}
        </h2>

        {/* Email Field */}
        <div className="relative mb-6">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-12 w-full px-6 text-xl text-gray-800 border-b-2 border-l-0 border-t-1 border-gray-400 outline-none focus:border-blue-500 focus:text-blue-500 peer"
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
            className="h-14 w-full px-6 text-xl text-gray-800 border-b-2 border-l-0 border-t-0 border-gray-400 outline-none focus:border-blue-500"
          />
        </div>

        {/* Login Button */}
        <button
          onClick={onLogin}
          disabled={buttonDisabled}
          className="w-full py-3 bg-blue-500 text-white rounded-lg mt-4 disabled:opacity-50"
        >
          Login
        </button>
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
