import React from 'react';
import { Route, Routes } from "react-router-dom";
import './App.css';
import './index.css'; // or './styles.css' depending on your setup

import LoginModal from "./Components/Login";
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import ProductDetails from './Components/ProductDetails';
import ViewCart from './Components/Cart';
import CheckOut from './Components/CheckOut';
import OrderSuccess from './Components/OrderSuccess';
import Orders from './Components/Order';
import CreateImmediateOrder from './Components/OrderImmediate';
import Profile from './Components/Profile';
import AdminPage from './Components/Admin';
import AdminRoute from './Components/AdminRoute'; // Import AdminRoute
import AdminProduct from './Components/AdminProduct';
import AdminUserManagement from './Components/AdminUser';
function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Home />
          </>
        }
      />
      {/* Route for product details */}
      <Route
        path="products/:id"
        element={
          <>
            <Navbar />
            <ProductDetails />
          </>
        }
      />
      <Route
        path="cart"
        element={
          <>
            <Navbar />
            <ViewCart />
          </>
        }
      />
      <Route
        path="checkout"
        element={
          <>
            <Navbar />
            <CheckOut />
          </>
        }
      />
      <Route
        path="order-success"
        element={
          <>
            <Navbar />
            <OrderSuccess />
          </>
        }
      />
      <Route
        path="orders"
        element={
          <>
            <Navbar />
            <Orders />
          </>
        }
      />
      <Route
        path="orders-immediate"
        element={
          <>
            <Navbar />
            <CreateImmediateOrder />
          </>
        }
      />
      <Route
        path="profile"
        element={
          <>
            <Navbar />
            <Profile />
          </>
        }
      />
      
      {/* Admin protected route */}
      <Route
        path="admin/*"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />
      <Route
        path="admin/products"
        element={
          <AdminRoute>
            <AdminProduct />
          </AdminRoute>
        }
      />
      <Route
        path="admin/users"
        element={
          <AdminRoute>
            <AdminUserManagement />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
