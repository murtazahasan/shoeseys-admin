// src/components/Home.jsx
import React from "react";

function Home() {
  return (
    <div className="bg-gray-100 my-52  mx-5 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-4">Hey, Welcome, Admin!</h1>
        <p className="text-gray-400 mt-4">
          Please sign in with correct email address to access admin
          features.
        </p>
      </div>
    </div>
  );
}

export default Home;
