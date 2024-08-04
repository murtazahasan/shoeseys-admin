// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/authSlice";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-white p-4 sticky top-0 shadow-md">
      <Link to="/" className="flex items-center flex-shrink-0 mr-6">
        <img className="h-16 w-20 rounded-xl" src="logo1.png" alt="Logo" />
      </Link>

      <div className="block md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-2 border rounded text-gray-400 border-gray-400 hover:text-gray-700 hover:border-gray-700"
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>

      <div
        className={`w-full flex-grow md:flex md:items-center md:w-auto ${
          isOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="md:flex-grow">
          <NavLink
            to="/add-product"
            className="block mt-5 font-bold text-xl md:inline-block md:mt-0 text-gray-800 hover:text-gray-500 mr-4"
          >
            Add Product
          </NavLink>
          <NavLink
            to="/products-list"
            className="block mt-4 font-bold text-xl md:inline-block md:mt-0 text-gray-800 hover:text-gray-500 mr-4"
          >
            Product List
          </NavLink>
          <NavLink
            to="/OrderList"
            className="block mt-4 font-bold text-xl md:inline-block md:mt-0 text-gray-800 hover:text-gray-500 mr-4"
          >
            Order List
          </NavLink>
        </div>

        <div>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="block mt-4 md:inline-block md:mt-0 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Log out
            </button>
          ) : (
            <Link
              to="/sign-in"
              className="block mt-4 md:inline-block md:mt-0 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
