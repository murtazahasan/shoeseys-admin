import React, { useState, useEffect } from "react";
import axios from "axios";
import { RxCrossCircled, RxPencil1 } from "react-icons/rx";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(null); // New state for editing

  const categories = [
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
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/products?page=${currentPage}&search=${search}&category=${category}`
        );
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        console.log("Fetched products:", response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [currentPage, search, category]);

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const startEditing = (product) => {
    console.log("Editing product:", product);
    setEditingProduct(product);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  const saveEdit = async () => {
    try {
      console.log("Saving edited product:", editingProduct);
      await axios.put(
        `http://localhost:4000/products/${editingProduct._id}`,
        editingProduct
      );
      setProducts(
        products.map((product) =>
          product._id === editingProduct._id ? editingProduct : product
        )
      );
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="container mx-auto my-10 p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Product List
      </h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products"
          className="px-4 py-2 border rounded-md"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="py-2 border rounded-md ml-4"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.replace(/-/g, " ")}
            </option>
          ))}
        </select>
      </div>
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products available</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    No.
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product Id
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    discount Price
                  </th>
                  <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    discount Percentage
                  </th>
                  <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sold
                  </th>
                  <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-50"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id}>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 font-medium text-gray-900">
                        {index + 1}:
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 font-medium text-gray-900">
                        {product._id}
                      </div>
                    </td>
                    <td className="px-1 py-2 whitespace-no-wrap border-b border-gray-200">
                      <img
                        src={product.imageUrl[0]}
                        alt={product.name}
                        className=" w-80 h-16 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-gray-600">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-gray-600">
                        {product.category}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-gray-600">
                        {product.stock}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-gray-600">
                        RS. {product.price}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-gray-600">
                        RS. {product.discountPrice}
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-gray-600">
                        {product.discountPercentage}%
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-gray-600">
                        {product.sold}
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-gray-600">
                        {product.version}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-200 text-right text-sm leading-5 font-medium">
                      <button
                        onClick={() => startEditing(product)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <RxPencil1 size={24} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <RxCrossCircled size={24} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {editingProduct && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Edit Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={handleEditChange}
                  placeholder="Name"
                  className="px-4 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="description"
                  value={editingProduct.description}
                  onChange={handleEditChange}
                  placeholder="Description"
                  className="px-4 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="category"
                  value={editingProduct.category}
                  onChange={handleEditChange}
                  placeholder="Category"
                  className="px-4 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="stock"
                  value={editingProduct.stock}
                  onChange={handleEditChange}
                  placeholder="stock"
                  className="px-4 py-2 border rounded-md"
                />
                <input
                  type="number"
                  name="price"
                  value={editingProduct.price}
                  onChange={handleEditChange}
                  placeholder="Price"
                  className="px-4 py-2 border rounded-md"
                />
                <input
                  type="number"
                  name="discountPrice"
                  value={editingProduct.discountPrice}
                  onChange={handleEditChange}
                  placeholder="Discount Price"
                  className="px-4 py-2 border rounded-md"
                />
                <input
                  type="number"
                  name="discountPercentage"
                  value={editingProduct.discountPercentage}
                  onChange={handleEditChange}
                  placeholder="Discount Percentage"
                  className="px-4 py-2 border rounded-md"
                />
                <input
                  type="number"
                  name="sold"
                  value={editingProduct.sold}
                  onChange={handleEditChange}
                  placeholder="sold"
                  className="px-4 py-2 border rounded-md"
                />
                <input
                  type="number"
                  name="version"
                  value={editingProduct.version}
                  onChange={handleEditChange}
                  placeholder="version"
                  className="px-4 py-2 border rounded-md"
                />
                <button
                  onClick={saveEdit}
                  className="col-span-1 md:col-span-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          )}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`mx-1 px-3 py-1 rounded-md ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 border"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
