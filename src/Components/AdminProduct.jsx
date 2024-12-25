import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar"; // Import the Sidebar
const AdminProduct = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const response = await fetch(`https://ecommerce-backend-server-production.up.railway.app/products/admin`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Function to toggle the product status (active/inactive)
  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://ecommerce-backend-server-production.up.railway.app/products/${productId}/archive`, {
        method: "PUT",  // Using PUT to match the route for archiving products
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update product status");
      }

      // Refresh the product list after status update
      const updatedProducts = products.map((product) =>
        product._id === productId ? { ...product, isActive: !currentStatus } : product
      );
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Admin - Products</h1>

        {/* Table structure */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Product Name</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr
                    key={product._id}
                    className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}`}
                  >
                    <td className="py-2 px-4 text-sm text-gray-800">{product.name}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">{product.category}</td>
                    <td className="py-2 px-4 text-sm text-blue-600">${product.price}</td>
                    <td className="py-2 px-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs ${
                          product.isActive ? "bg-green-600" : "bg-red-600"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-sm">
                      <button
                        onClick={() => toggleProductStatus(product._id, product.isActive)}
                        className={`py-2 px-4 rounded-md text-white font-semibold ${
                          product.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {product.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-600">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProduct;
