import React, { useState, useEffect } from "react";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/orders?status=${activeTab}&page=${currentPage}&limit=5`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeTab, currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="orders-page p-4 bg-gray-200 min-h-screen flex flex-col">
      {/* Tabs */}
      <div className="tabs flex justify-center space-x-10 border-b border-gray-300 pb-4">
        <button
          className={`text-lg font-medium pb-2 ${
            activeTab === "Pending"
              ? "border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Pending")}
        >
          Pending
        </button>
        <button
          className={`text-lg font-medium pb-2 ${
            activeTab === "Completed"
              ? "border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Completed")}
        >
          Completed
        </button>
      </div>

      {loading && (
        <p className="text-center mt-4 text-gray-500">Loading orders...</p>
      )}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}

      <div className="orders-list mt-6 flex-1">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="order-item flex items-center space-x-4 mb-4 p-4 border rounded-lg shadow-sm bg-white"
            >
              <img
                src={order.orderItems[0].productId.imagepath}
                alt={`Product image for Order #${order._id}`}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h3 className="text-xl font-semibold">Order #{order._id}</h3>
                <p>Total Amount: ${order.totalAmount}</p>
                <p>
                  Order Date: {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <p>Status: {order.orderStatus}</p>
                <p>Delivery Location: {order.shippingInfo.deliveryLocation}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found for {activeTab}.</p>
        )}
      </div>

      {/* Pagination Controls (Fixed at the bottom) */}
      <div className="pagination fixed bottom-0 left-0 right-0 bg-gray-200 p-4 flex justify-center space-x-4">
  <button
    className="px-6 py-3 bg-blue-500 text-white rounded disabled:opacity-50"
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <span className="px-4 py-3 bg-gray-200 rounded">
    Page {currentPage} of {totalPages}
  </span>
  <button
    className="px-6 py-3 bg-blue-500 text-white rounded disabled:opacity-50"
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>

    </div>
  );
};

export default Orders;
