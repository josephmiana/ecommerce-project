import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate from react-router-dom
require('dotenv').config();

const ViewCart = () => {
  const [cartData, setCartData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();  // Initialize useNavigate hook

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setCartData([]);
          return;
        }        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/carts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }

        const data = await response.json();
        setCartData(data.items || []);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setCartData([]);
      }
    };

    fetchCartData();
  }, []);

  const handleCheckboxChange = (item, isChecked) => {
    if (isChecked) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(selectedItems.filter((selected) => selected !== item));
    }
  };

  const handleBuyNow = () => {
    if (selectedItems.length === 0) {
      alert("Please select items to proceed.");
      return;
    }
    console.log(selectedItems);
    
    // Navigate to checkout page and pass selectedItems in state
    navigate("/checkout", { state: { selectedItems } });
  };

  const totalSelectedPrice = selectedItems.reduce(
    (total, item) => total + item.productId.price * item.quantity,
    0
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Cart Items Section */}
      <div className="flex flex-col items-center w-full p-4 space-y-6">
        {cartData.map((item, index) => (
          <div
            key={index}
            className="flex items-center bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl space-x-6"
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring focus:ring-blue-300"
              onChange={(e) =>
                handleCheckboxChange(item, e.target.checked)
              }
            />
            {/* Image */}
            <img
              src={item.productId.imagepath}
              alt={item.productId.name}
              className="w-32 h-32 object-cover rounded"
            />
            {/* Details */}
            <div className="flex flex-col space-y-2 flex-grow">
              <h2 className="font-bold text-xl text-gray-800">
                {item.productId.name}
              </h2>
              <p className="text-gray-600">
                {item.productId.description || "No description available"}
              </p>
              <div className="text-gray-500">
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.productId.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "white",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 className="text-lg font-bold mb-2">Summary</h2>
        <p className="text-gray-600">Total Items: {selectedItems.length}</p>
        <p className="text-gray-800 font-bold">
          Total Price: ${totalSelectedPrice.toFixed(2)}
        </p>
        <button
          onClick={handleBuyNow}
          className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ViewCart;
