import React from "react";
import ProductList from "./ProductList"; // Import the ProductList component

const Home = () => {
  
  return (
    <div className="min-h-screen">
      {/* Image Section */}
      <div className="image-container flex justify-center ">
        <img
          src="/images/home-bgg.png"  // Update the image path here
          alt="Gaming PC"              // Add an appropriate alt description
          className="w-full h-auto max-w-none"
        />
      </div>

      {/* Product List Section */}
      <div className="mt-10">  {/* Add margin top to separate from the image */}
        <ProductList />   {/* This will render the ProductList component */}
      </div>
    </div>
  );
};

export default Home;
