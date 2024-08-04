// src/pages/SignUp.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useSnackbar } from "notistack";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSignUp = async () => {
    try {
      await axios.post("http://localhost:4000/user/signup", {
        email,
        password,
        username,
      });
      enqueueSnackbar("Sign up successful! Please sign in.", {
        variant: "success",
      });
      navigate("/sign-in");
    } catch (err) {
      enqueueSnackbar(err.response.data.message || "Sign up failed", {
        variant: "error",
      });
    }
  };

  return (
    <div className="container my-32 mx-auto p-4">
      <h2 className="text-2xl mb-4">Sign Up</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <button
        onClick={handleSignUp}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign Up
      </button>
      <p className="mt-4">
        Already have an account?
        <Link to="/sign-in" className="text-blue-600">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
