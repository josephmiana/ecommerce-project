import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

const ImmediateOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Getting the product data from the location state
  const product = location.state?.product || {};
  const quantity = location.state?.quantity || {};
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
        const token = localStorage.getItem("token");
        if (!token) {
          await Swal.fire({
            icon: 'warning',
            title: 'You must be logged in to proceed.',
            showConfirmButton: true,
          });
          navigate("/login");
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

        // Set form data with the fetched user details
        setFormData({
          name: data.name || "",
          address: data.address || "",
          email: data.email || "",
          deliveryLocation: data.address || "",
          paymentMethod: "creditCard", // Default payment method
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
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
      await Swal.fire({
        icon: 'warning',
        title: 'You must be logged in to proceed.',
        showConfirmButton: true,
      });
      navigate("/login");
      return;
    }
  
    // Check if product and quantity are valid
    if (!product._id || !quantity) {
      await Swal.fire({
        icon: 'error',
        title: 'Missing Product or Quantity',
        text: 'Product or quantity is missing. Please try again.',
      });
      return;
    }
  
    // Prepare the payload for the immediate order
    const payload = {
      orderItems: [  // Wrap the selectedItem in an array for consistency
        {
          productId: product._id,  // Using the product ID
          quantity: quantity,  // Assuming quantity is 1 for immediate order
        }
      ],
      shippingInfo: {
        name: formData.name,
        address: formData.address,
        email: formData.email,
        deliveryLocation: formData.deliveryLocation,
      },
      invoiceMethod: formData.paymentMethod === "creditCard" ? "Credit Card" : "Cash on Delivery",
    };
  
    // Log the payload to check if all values are correct
    console.log("Payload:", payload);
  
    try {
      const response = await fetch("http://localhost:4001/orders/create-immediate", {
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
  
      await Swal.fire({
        icon: 'success',
        title: 'Order placed successfully!',
        text: 'Your order has been created successfully.',
        showConfirmButton: true,
      });
  
      navigate("/order-success", { state: { orderId: data.orderId } });
    } catch (error) {
      console.error("Error creating order:", error);
      await Swal.fire({
        icon: 'error',
        title: 'Failed to create order.',
        text: error.message || 'Please try again later.',
      });
    }
  };
  
  

  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-600">No product to checkout</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex flex-col md:flex-row items-start justify-between max-w-5xl mx-auto space-y-6 md:space-y-0">
        {/* Left Column: Product & Shipping Address */}
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

          {/* Product Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Details</h2>
            <div className="flex items-center justify-between">
              <img
                src={product.imagepath}
                alt={product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex flex-col flex-grow ml-4">
                <p className="font-medium text-gray-800">{product.name}</p>
                <p className="text-gray-600 text-sm">{product.description}</p>
                <p className="font-semibold text-gray-800">Price: ${product.price}</p>
              </div>
            </div>
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
                  <p className="text-gray-600 ml-auto">1</p>
                </div>
              <div className="flex justify-between">
                  <p className="text-gray-600">Shipping Fee:</p>
                  <p className="text-gray-600 ml-auto">$40</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Total Price:</p>
                  <p className="text-gray-800 font-bold ml-auto">${product.price}</p>
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

export default ImmediateOrder;
