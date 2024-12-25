import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect to login page
  };

  return (
    <div className="flex flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-semibold text-center mb-8 text-blue-500">
          Admin Panel
        </h2>

        {/* Navigation Links */}
        <ul className="space-y-4">
          <li>
            <Link
              to="/admin/dashboard"
              className="block py-2 px-4 rounded hover:bg-blue-600 transition-all duration-200"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/products"
              className="block py-2 px-4 rounded hover:bg-blue-600 transition-all duration-200"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/admin/orders"
              className="block py-2 px-4 rounded hover:bg-blue-600 transition-all duration-200"
            >
              Orders
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className="block py-2 px-4 rounded hover:bg-blue-600 transition-all duration-200"
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              to="/admin/settings"
              className="block py-2 px-4 rounded hover:bg-blue-600 transition-all duration-200"
            >
              Settings
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="block py-2 px-4 rounded hover:bg-blue-600 transition-all duration-200"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-100">
        {/* Your main admin page content */}
      </div>
    </div>
  );
};

export default Sidebar;
