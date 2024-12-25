import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://ecommerce-backend-server-production.up.railway.app/products`);
        const data = await response.json();
        console.log(data);

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-10 inline border-b-4 border-gray-500 pb-1">
        NEW ARRIVALS
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className="bg-gray-200 rounded-lg shadow-lg transform transition-all duration-500 group flex flex-col"
          >
            <div className="w-full h-48 relative mb-20">
              <img
                src={product.imagepath}
                alt={product.name}
                className="w-full mt-10 h-full object-contain transition-all duration-500 ease-in-out transform group-hover:scale-110"
              />
            </div>
            <div className="p-4 flex flex-col justify-between flex-grow">
              <h5 className="text-xl font-semibold group-hover:text-blue-600 transition-colors duration-300">
                {product.name}
              </h5>
              <p className="text-gray-600 mt-2 group-hover:text-gray-700 transition-colors duration-300">
                {product.description}
              </p>

              <div className=" flex flex-col items-start mt-5">
                <p className="text-xl font-bold group-hover:text-blue-500 transition-colors duration-300">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
