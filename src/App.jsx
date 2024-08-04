// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import AddProduct from "./pages/AddProduct";
import SignIn from "./pages/SignIn";
import ProductList from "./pages/ProductList";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "./pages/Home";
import OrderList from "./pages/OrderList";
import { useDispatch } from "react-redux";
import { loadUserFromToken } from "../src/reducers/authSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/add-product"
          element={
            <ProtectedRoute adminOnly>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products-list"
          element={
            <ProtectedRoute adminOnly>
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orderList"
          element={
            <ProtectedRoute adminOnly>
              <OrderList />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
