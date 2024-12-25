import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LoginModal from "./Login";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token") !== null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);
  const [quantity, setQuantity] = useState(1); // Track the quantity
  const navigate = useNavigate();
  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://ecommerce-backend-server-production.up.railway.app/products/${id}`);
        const data = await response.json();
        setProduct(data);        
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProductDetails();
  }, [id]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowLoginModal(false);
  };

  // Handle quantity change manually from keyboard
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === "" || !isNaN(value)) {
      // Allow only numbers or empty for reset
      setQuantity(value === "" ? "" : Math.max(1, Number(value))); // Minimum quantity is 1
    }
  };

  // Increase quantity
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + 1)); // Minimum 1
  };

  // Decrease quantity
  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1)); // Minimum 1
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    console.log(product);
    
    // Navigate to checkout page and pass selectedItems in state
    navigate("/orders-immediate", { state: { product, quantity } });
  };

  // Handle adding to cart
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User is not logged in!");
      // Show error message using SweetAlert if user is not logged in
      await Swal.fire({
        position: "top-end",
        icon: "error",
        title: "You must be logged in to add items to the cart",
        showConfirmButton: false,
        timer: 1000,
        toast: true,
        background: "#efefef",
      });
      return;
    }

    try {
      const response = await fetch(`https://ecommerce-backend-server-production.up.railway.app/carts/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id, // Assuming product ID is available
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const data = await response.json();
      console.log("Item added to cart:", data);

      // Show success message using SweetAlert
      await Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Item added to cart successfully!",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#efefef",
      });

      // Trigger navbar update instead of full reload
      if (window.updateCartItemCount) {
        window.updateCartItemCount();
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);

      // Show error message using SweetAlert if an error occurs
      await Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error adding item to cart",
        text: error.message,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: "#efefef",
      });
    }
  };

  // Handle login success
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    if (redirectAfterLogin === "buyNow") {
      console.log("Proceed with Buy Now after login");
    } else if (redirectAfterLogin === "addToCart") {
      console.log("Add to cart after login");
    }
    setShowLoginModal(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-300">
      <div className="bg-gray-100 rounded-lg shadow-lg flex max-w-4xl w-full p-6 overflow-auto max-h-[calc(100vh-100px)]">
        {/* Left Side - Image */}
        <div className="w-1/2 pr-6">
          <img
            src={product.imagepath}
            alt={product.name}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Right Side - Product Details */}
        <div className="w-1/2 flex flex-col justify-between">
          <h2 className="text-3xl font-semibold text-gray-800">{product.name}</h2>
          <p className="text-lg text-gray-600 mt-4">{product.description}</p>
          <p className="text-xl font-bold text-gray-800 mt-4">${product.price?.toFixed(2)}</p>

          {/* Quantity and Buttons */}
          <div className="mt-6 flex items-center space-x-4">
            <button
              onClick={decreaseQuantity}
              className="bg-gray-400 text-white py-1 px-4 rounded-full hover:bg-gray-500 transition-all duration-300"
            >
              -1
            </button>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              className="w-16 text-center bg-white border rounded-full py-2 px-4 focus:outline-none appearance-none no-spinner"
            />
            <button
              onClick={increaseQuantity}
              className="bg-gray-400 text-white py-1 px-4 rounded-full hover:bg-gray-500 transition-all duration-300"
            >
              +1
            </button>
          </div>

          {/* Buttons Section */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition-all duration-300"
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition-all duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-2 left-2 bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition-all duration-300"
      >
        Logout
      </button>
    </div>
  );
};

export default ProductDetails;
