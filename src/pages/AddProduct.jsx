import React, { useState, useEffect } from "react";
import axios from "axios";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    discountPrice: "",
    discountPercentage: "",
    description: "",
    category: "",
    stock: 0,
    imageUrl: [],
  });
  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    setCategories([
      "men-all",
      "men-sneakers-casual-shoes",
      "men-formal-shoes",
      "men-sports-shoes",
      "men-sandals-slippers",
      "men-peshawari-chappal",
      "men-women-socks",
      "shoe-care-products",
      "women-all",
      "women-pumps-khusa",
      "women-heels-sandals",
      "women-loafers",
      "women-sneakers-casual-shoes",
      "women-slippers-chappal",
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = [];

      if (selectedFiles.length) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("images", file);
        });

        const uploadResponse = await axios.post(
          "http://localhost:4000/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = uploadResponse.data.imageUrl;
      }

      const productData = { ...product, imageUrl };
      const response = await axios.post(
        "http://localhost:4000/products",
        productData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Product added:", response.data);

      setProduct({
        name: "",
        price: "",
        discountPrice: "",
        discountPercentage: "",
        description: "",
        category: "",
        stock: 0,
        imageUrl: [],
      });
      setSelectedFiles([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("There was an error adding the product!", error);
    }
  };

  return (
    <div className="max-w-lg mx-4 my-10 p-6 bg-white rounded-lg shadow-md sm:mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Add Product
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Discount Price
          </label>
          <input
            type="number"
            name="discountPrice"
            value={product.discountPrice}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            discount Percentage
          </label>
          <input
            type="number"
            name="discountPercentage"
            value={product.discountPercentage}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Category
          </label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Stock</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Images</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {imagePreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Selected ${index}`}
                className="w-full h-48 object-cover rounded-md"
              />
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
