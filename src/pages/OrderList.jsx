// src/components/OrderList.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  editOrder,
  deleteOrder,
  searchOrders,
  filterOrdersByStatus,
  getSalesData,
} from "../reducers/orderSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import { formatDateToPST } from "../utils/formatDate";

function OrderList() {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.orders);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [timeRange, setTimeRange] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    console.log("Fetching orders...");
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    handleFetchSalesData();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchOrders(searchQuery));
    } else {
      dispatch(fetchOrders());
    }
  };

  // Add handleStatusFilterChange function
  const handleStatusFilterChange = (e) => {
    console.log("Status filter changed:", e.target.value);
    setStatusFilter(e.target.value);
    if (e.target.value === "") {
      dispatch(fetchOrders());
    } else {
      dispatch(filterOrdersByStatus(e.target.value));
    }
  };

  const handleTimeRangeChange = (e) => {
    const { name, value } = e.target;
    setTimeRange((prev) => ({ ...prev, [name]: value }));
  };
  // for sales data
  const handleFetchSalesData = async () => {
    if (statusFilter) {
      dispatch(filterOrdersByStatus(statusFilter))
        .unwrap()
        .then((filteredOrders) => {
          // Use filteredOrders for calculating sales data
          console.log("Filtered orders:", filteredOrders);
          const totalAmount = filteredOrders.reduce(
            (acc, order) => acc + order.totalAmount,
            0
          );
          const totalQuantity = filteredOrders.reduce(
            (acc, order) =>
              acc + order.items.reduce((acc2, item) => acc2 + item.quantity, 0),
            0
          );
          setSalesData({ totalAmount, totalQuantity });
        })
        .catch((error) =>
          console.error("Error fetching filtered orders:", error)
        );
    } else {
      dispatch(getSalesData(timeRange))
        .unwrap()
        .then((data) => {
          console.log("Sales data received:", data);
          setSalesData(data);
        })
        .catch((error) => console.error("Error fetching sales data:", error));
    }
  };

  useEffect(() => {
    handleFetchSalesData();
  }, [dispatch, timeRange]);

  //
  const handleEditClick = (order) => {
    setEditingOrderId(order._id);
    setEditForm({ ...order, ...order.shippingAddress });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = (orderId) => {
    const {
      status,
      fullName,
      addressLine,
      city,
      country,
      postalCode,
      phoneNumber,
      email,
      message,
    } = editForm;
    const updateData = {
      "shippingAddress.status": status,
      "shippingAddress.fullName": fullName,
      "shippingAddress.addressLine": addressLine,
      "shippingAddress.city": city,
      "shippingAddress.country": country,
      "shippingAddress.postalCode": postalCode,
      "shippingAddress.phoneNumber": phoneNumber,
      "shippingAddress.email": email,
      "shippingAddress.message": message,
    };
    dispatch(editOrder({ orderId, updateData }));
    setEditingOrderId(null);
  };

  const handleDeleteClick = (orderId) => {
    dispatch(deleteOrder(orderId));
  };

  if (isLoading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    console.error("Error fetching orders:", error);
    return <p>Error fetching orders: {error}</p>;
  }
  console.log("Orders fetched successfully:", orders);

  return (
    <>
      <div className="container mx-auto py-5 px-4">
        <h2 className="text-2xl font-semibold mb-4">Order List</h2>
        <form onSubmit={handleSearch} className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="px-4 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Search
          </button>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className=" ml-4 bg-gray-200 border-gray-300 mb-4"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="confirm">Confirm</option>
            <option value="delivered">Delivered</option>
            <option value="warning">Warning</option>
          </select>
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200  ">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Orders
                </th>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  FullName
                </th>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PostalCode
                </th>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PhoneNumber
                </th>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-2 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edit
                </th>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders
                .slice()
                .sort((a, b) => {
                  const dateA = new Date(a.createdAt);
                  const dateB = new Date(b.createdAt);
                  return dateB - dateA;
                })
                .map((order, index) => (
                  <tr className=" " key={order._id}>
                    <td className=" font-bold pl-4 pr-1 py-2 whitespace-nowrap">
                      {index + 1}:
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{order._id}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {order.userId.username}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {order.userId.email}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      Rs {order.totalAmount}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {formatDateToPST(order.createdAt)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {editingOrderId === order._id ? (
                        <input
                          type="text"
                          name="fullName"
                          value={editForm.fullName}
                          onChange={handleChange}
                          className="bg-lime-100 border-gray-300"
                        />
                      ) : (
                        order.shippingAddress.fullName
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {editingOrderId === order._id ? (
                        <input
                          type="text"
                          name="addressLine"
                          value={editForm.addressLine}
                          onChange={handleChange}
                          className="bg-lime-100 border-gray-300"
                        />
                      ) : (
                        order.shippingAddress.addressLine
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {editingOrderId === order._id ? (
                        <input
                          type="text"
                          name="city"
                          value={editForm.city}
                          onChange={handleChange}
                          className="bg-lime-100 border-gray-300"
                        />
                      ) : (
                        order.shippingAddress.city
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {editingOrderId === order._id ? (
                        <input
                          type="text"
                          name="country"
                          value={editForm.country}
                          onChange={handleChange}
                          className="bg-lime-100 border-gray-300"
                        />
                      ) : (
                        order.shippingAddress.country
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {editingOrderId === order._id ? (
                        <input
                          type="text"
                          name="postalCode"
                          value={editForm.postalCode}
                          onChange={handleChange}
                          className=" bg-lime-100 border-y-gray-600"
                        />
                      ) : (
                        order.shippingAddress.postalCode
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {editingOrderId === order._id ? (
                        <input
                          type="text"
                          name="phoneNumber"
                          value={editForm.phoneNumber}
                          onChange={handleChange}
                          className=" bg-lime-100 border-gray-300"
                        />
                      ) : (
                        order.shippingAddress.phoneNumber
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {editingOrderId === order._id ? (
                        <input
                          type="text"
                          name="email"
                          value={editForm.email}
                          onChange={handleChange}
                          className=" bg-lime-100 border-green-800"
                        />
                      ) : (
                        order.shippingAddress.email
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {editingOrderId === order._id ? (
                        <input
                          type="text"
                          name="message"
                          value={editForm.message}
                          onChange={handleChange}
                          className=" bg-blue-200 border-gray-300"
                        />
                      ) : (
                        order.shippingAddress.message
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {editingOrderId === order._id ? (
                        <select
                          name="status"
                          value={editForm.status}
                          onChange={handleChange}
                          className="border-gray-300"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirm">Confirm</option>
                          <option value="delivered">Delivered</option>
                          <option value="warning">Warning</option>
                        </select>
                      ) : (
                        order.shippingAddress.status
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {editingOrderId === order._id ? (
                        <>
                          <button
                            onClick={() => handleEditSave(order._id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-500 hover:text-red-700"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(order)}
                            className="text-green-500 hover:text-green-700 mr-2"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(order._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <ul>
                        {order.items.map((item) => (
                          <li
                            key={`${order._id}-${item.productId._id}`}
                            className="mb-2"
                          >
                            <img
                              src={item.productId.imageUrl[0]}
                              alt={item.productId.name}
                              className=" w-16 h-16 object-cover inline-block mr-2"
                            />
                            <div className="inline-block align-middle">
                              <p className="font-bold">
                                product Id:
                                <span className="pl-2  pr-2 font-medium text-gray-700">
                                  {item.productId._id}
                                </span>
                              </p>
                              <p className="font-bold">
                                Name:
                                <span className="pl-2 font-medium text-gray-700">
                                  {item.productId.name}
                                </span>
                              </p>
                              <p className=" font-bold">
                                Quantity:
                                <span className="pl-2 font-medium text-gray-700">
                                  {item.quantity}
                                </span>
                              </p>
                              <p className=" font-bold">
                                Price:
                                <span className="pl-2 font-medium text-gray-700">
                                  Rs {item.productId.price}
                                </span>
                              </p>
                              <p className=" font-bold">
                                Discount Price:
                                <span className="pl-2 font-medium text-gray-700">
                                  Rs {item.productId.discountPrice}
                                </span>
                              </p>
                              <p className=" font-bold">
                                Description:
                                <span className="pl-2 font-medium text-gray-700">
                                  {item.productId.description}
                                </span>
                              </p>
                              <p className=" font-bold">
                                Category:
                                <span className="pl-2 font-medium text-gray-700">
                                  {item.productId.category}
                                </span>
                              </p>
                              <p className=" text-yellow-900">
                                sold:
                                <span className="pl-2 font-medium text-gray-700">
                                  {item.productId.sold}
                                </span>
                              </p>
                              <p className=" text-yellow-800">
                                version:
                                <span className="pl-2 font-medium text-gray-700">
                                  {item.productId.version}
                                </span>
                              </p>
                              <p className=" text-yellow-800">
                                stock:
                                <span className="pl-2 font-medium text-gray-700">
                                  {item.productId.stock}
                                </span>
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="my-10 mx-9">
        <h3 className="text-xl font-semibold mb-2">Sales Data</h3>
        <div>
          <label htmlFor="startDate">Start Date: </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={timeRange.startDate}
            onChange={handleTimeRangeChange}
            className="border border-gray-300 rounded my-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="endDate" className="ml-1">
            End Date:{" "}
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={timeRange.endDate}
            onChange={handleTimeRangeChange}
            className="border border-gray-300 rounded my-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white ml-3  rounded"
            onClick={handleFetchSalesData}
          >
            Fetch Sales Data
          </button>
        </div>
        {salesData &&
        (salesData.totalAmount > 0 || salesData.totalQuantity > 0) ? (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-4 py-2 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 whitespace-nowrap">Total Amount</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {salesData.totalAmount}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 whitespace-nowrap">Total Quantity</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {salesData.totalQuantity}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No sales data available</p>
        )}
      </div>
    </>
  );
}

export default OrderList;
