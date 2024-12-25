import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
require('dotenv').config();

const CheckOut = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedItems = location.state?.selectedItems || [];

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    paymentMethod: "creditCard", // default payment method
    deliveryLocation: "",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage        
        if (!token) {
          // Use Swal for alerting the user
          await Swal.fire({
            icon: 'warning',
            title: 'You must be logged in to proceed.',
            showConfirmButton: true,
          });
          navigate("/login"); // Redirect to login page if no token is found
          return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/details`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details.");
        }

        const data = await response.json();

        // Map response data to form fields
        setFormData({
          name: data.name || "",
          address: data.address || "",
          email: data.email || "",
          deliveryLocation: data.address || "",
          paymentMethod: "creditCard", // Default payment method
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Use Swal for error handling
        await Swal.fire({
          icon: 'error',
          title: 'Failed to fetch user details.',
          text: error.message || 'An error occurred while fetching your details.',
        });
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleRadioChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      paymentMethod: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      // Use Swal for alerting the user
      await Swal.fire({
        icon: 'warning',
        title: 'You must be logged in to proceed.',
        showConfirmButton: true,
      });
      navigate("/login"); // Redirect to login if no token
      return;
    }

    // Prepare the payload
    const payload = {
      selectedItems: selectedItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      shippingInfo: {
        name: formData.name,
        address: formData.address,
        email: formData.email,
        deliveryLocation: formData.deliveryLocation,
      },
      invoiceMethod: formData.paymentMethod === "creditCard" ? "Credit Card" : "Cash on Delivery",
    };

    try {
      const response = await fetch("http://localhost:4001/orders/create-from-cart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order.");
      }

      const data = await response.json();

      // Use Swal for success
      await Swal.fire({
        icon: 'success',
        title: 'Order placed successfully!',
        text: 'Your order has been created successfully.',
        showConfirmButton: true,
      });

      navigate("/order-success", { state: { orderId: data.orderId } });
    } catch (error) {
      console.error("Error creating order:", error);
      // Use Swal for error handling
      await Swal.fire({
        icon: 'error',
        title: 'Failed to create order.',
        text: error.message || 'Please try again later.',
      });
    }
  };

  const test = () => {
    console.log(selectedItems);
  }

  if (!selectedItems || selectedItems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-600">No items to checkout</p>
        <button
          onClick={test}>
          Testing
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex flex-col md:flex-row items-start justify-between max-w-5xl mx-auto space-y-6 md:space-y-0">
        {/* Left Column: Products & Shipping Address */}
        <div className="w-full md:w-2/3 space-y-6">
          {/* Shipping Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Shipping Information
            </h2>
            <div className="space-y-4">
              <p>
                <strong>Name:</strong> {formData.name}
              </p>
              <p>
                <strong>Address:</strong> {formData.address}
              </p>
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Delivery Location:</strong> {formData.deliveryLocation}
              </p>
            </div>
          </div>

          {/* Selected Items */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Selected Items
            </h2>
            {selectedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-4"
              >
                {/* Item Image */}
                <img
                  src={item.productId.imagepath}
                  alt={item.productId.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex flex-col flex-grow ml-4">
                  <p className="font-medium text-gray-800">
                    {item.productId.name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {item.productId.description || "No description available"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Quantity: {item.quantity}
                  </p>
                  <p className="font-semibold text-gray-800">
                    Price: ${item.productId.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Invoice Method & Order Summary */}
        <div className="w-full md:w-1/3 space-y-6 ml-6">
          <div className="flex flex-col space-y-6">
            {/* Invoice Method Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Invoice Method
              </h2>
              <div className="space-y-4 flex flex-col">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="creditCard"
                    checked={formData.paymentMethod === "creditCard"}
                    onChange={handleRadioChange}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Credit Card</span>
                </label>

                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cashOnDelivery"
                    checked={formData.paymentMethod === "cashOnDelivery"}
                    onChange={handleRadioChange}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Cash on Delivery</span>
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Total Items:</p>
                  <p className="text-gray-600 ml-auto">{selectedItems.length}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping Fee:</p>
                  <p className="text-gray-600 ml-auto">$40</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-gray-800 font-bold">Total Price:</p>
                  <p className="text-gray-800 font-bold ml-auto">
                    ${(
                      selectedItems.reduce(
                        (total, item) => total + item.productId.price * item.quantity,
                        0
                      ) + 40
                    ).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
