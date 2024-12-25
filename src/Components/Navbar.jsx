import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@heroicons/react/20/solid";
import Swal from "sweetalert2"; // Import Swal
import LoginModal from "./Login";
require('dotenv').config();

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartData, setCartData] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Function to fetch cart data
  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartData([]);
        setCartItemCount(0);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/carts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch cart data");

      const data = await response.json();
      setCartData(data.items || []);
      setCartItemCount(data.items?.length || 0);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setCartData([]);
      setCartItemCount(0);
    }
  };

  // Update cart when user logs in or cart update is triggered
  useEffect(() => {
    if (isLoggedIn) fetchCartData();
    else {
      setCartData([]);
      setCartItemCount(0);
    }
  }, [isLoggedIn]);

  // Expose cart update function globally
  useEffect(() => {
    window.updateCartItemCount = fetchCartData;

    return () => {
      delete window.updateCartItemCount;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out from your account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/");
        setIsLoggedIn(false);
        Swal.fire('Logged out!', 'You have been logged out successfully.', 'success');
      }
    });
  };

  const handleCheckOut = async () => {
    if (cartData.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Cart is empty',
        text: 'Please select items to proceed.',
      });
      return;
    }

    console.log("this is cart data ", cartData);
    navigate("/checkout", { state: { selectedItems: cartData } });
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    if (searchQuery) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleCartDropdown = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center space-x-6">
        <Link
          to="/"
          className="text-xl font-bold text-white hover:text-blue-400"
        >
          PC SHOP
        </Link>

        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center w-full max-w-lg"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 w-full border bg-white text-black rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-400 h-12"
            maxLength={40}
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-r-full hover:bg-blue-600 h-12"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </form>

        <ul className="flex items-center space-x-4">
          <li className="relative">
            <button
              onClick={toggleCartDropdown}
              className="text-white hover:text-blue-500"
              aria-label="Cart"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute bottom-6 text-center left-3 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            {isCartOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-80 p-4">
                <h3 className="text-xl font-bold">Cart Items</h3>
                {cartData.length > 0 ? (
                  <ul className="space-y-2 mt-2">
                    {cartData.map((item, index) => (
                      <li key={index} className="flex items-center space-x-4">
                        <img
                          src={item.productId.imagepath}
                          alt={item.productId.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-grow">
                          <span className="block font-medium">
                            {item.productId.name}
                          </span>
                          <span className="block text-sm text-gray-500">
                            Qty: {item.quantity}
                          </span>
                          <span className="block text-sm text-gray-500">
                            Price: ${item.productId.price}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Your cart is empty.</p>
                )}
                <div className="mt-4 flex justify-between">
                  <Link to="/cart" className="text-blue-500 hover:underline">
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    className="text-blue-500 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("Checkout clicked!");
                      handleCheckOut();
                    }}
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </li>

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                aria-label="Toggle account options"
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                Accounts
              </button>
              {isDropdownOpen && (
                <ul className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48">
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-black rounded-t-md hover:bg-gray-300 text-center"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-black hover:bg-gray-300 text-center"
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm text-black rounded-b-md hover:bg-gray-300"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Login
            </button>
          )}
        </ul>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </nav>
  );
};

export default Navbar;
