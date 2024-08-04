// src/pages/SignIn.jsx

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../reducers/authSlice";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
    enqueueSnackbar("Login successful", { variant: "success" });
    navigate("/");
  };

  return (
    <div className="container  my-32 mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">Sign In</h2>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="border p-2 mb-4 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="border p-2 mb-4 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign In
        </button>
      </form>
      <p className="mt-4">
        Don't have an account?
        <Link to="/sign-up" className="text-blue-500">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
