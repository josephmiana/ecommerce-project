import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
    const navigate = useNavigate();

    const handleContinueShopping = () => {
        navigate('/'); // Adjust the path to match your home or shopping page route
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100 p-5">
            <h1 className="text-4xl mb-5 text-gray-800">Your order has been placed!</h1>
            <p className="text-lg mb-8 text-gray-600">Thanks for shopping with us. We hope to see you again soon!</p>
            <button 
                className="px-5 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                onClick={handleContinueShopping}
            >
                Continue Shopping
            </button>
        </div>
    );
};

export default OrderSuccess;
