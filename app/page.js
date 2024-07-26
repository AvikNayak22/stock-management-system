"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdown, setDropdown] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product");
        const jsonResponse = await response.json();
        setProducts(jsonResponse.products);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        console.log("Product added successfully");
        // Handle success (e.g., clear form fields, show success message)
        setAlert("Your product has been added!");
        setProductForm({});
      } else {
        console.error("Failed to add product");
        // Handle error
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const onDropDownEdit = async (e) => {
    setQuery(e.target.value);
    if (!loading) {
      setLoading(true);
      setDropdown([]);
      const response = await fetch(`/api/search?query=${query}`);
      const jsonResponse = await response.json();
      setDropdown(jsonResponse.products);
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      {/* Search product container */}
      <div className="container my-8 mx-auto p-4">
        <div className="text-green-500 text-center">{alert}</div>
        <h1 className="text-2xl font-semibold mb-4">Search a product</h1>
        <div className="flex w-full gap-2 mb-2">
          <input
            onBlur={() => {
              setDropdown([]);
            }}
            onChange={onDropDownEdit}
            type="text"
            placeholder="Search for product name..."
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 basis-4/5"
          />
          <select className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 basis-1/5">
            <option value="">Select Category</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            <option value="category3">Category 3</option>
          </select>
        </div>
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              stroke="#000"
            >
              <g fill="none" fillRule="evenodd">
                <g transform="translate(1 1)" strokeWidth="2">
                  <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
                  <path d="M36 18c0-9.94-8.06-18-18-18">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 18 18"
                      to="360 18 18"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              </g>
            </svg>
          </div>
        )}
        <div className="drop-container absolute w-[72vw] border-1 bg-purple-100 rounded-md ">
          {dropdown.map((item) => {
            return (
              <div
                className="container flex justify-between my-1 p-2 border-b-2"
                key={item.slug}
              >
                <span className="slug">
                  {item.slug} ({item.quantity} available for ₹{item.price})
                </span>
                <div className="mx-5">
                  <span
                    className="subtract cursor-pointer px-2 py-1 bg-purple-400 text-white rounded-lg text-lg 
                  font-semibold  hover:bg-purple-600 transition duration-300 ease-in-out"
                  >
                    -
                  </span>
                  <span className="quantity mx-3">{item.quantity}</span>
                  <span
                    className="add cursor-pointer px-2 py-1 bg-purple-400 text-white rounded-lg text-lg 
                  font-semibold hover:bg-purple-600 transition duration-300 ease-in-out"
                  >
                    +
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add stock container */}
      <div className="container my-8 mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Add a product</h1>
        <form className="mb-8">
          <div className="mb-4">
            <label className="block text-gray-700">Product Slug</label>
            <input
              name="slug"
              value={productForm?.slug || ""}
              onChange={handleChange}
              type="text"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Quantity</label>
            <input
              onChange={handleChange}
              value={productForm?.quantity || ""}
              type="number"
              name="quantity"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              onChange={handleChange}
              value={productForm?.price || ""}
              type="text"
              name="price"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            onClick={addProduct}
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* display stock container */}
      <div className="container my-8 mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Current Stock</h1>
        <table className="min-w-full bg-purple-50 text-center">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((product) => (
                <tr key={product.slug}>
                  <td className="border px-4 py-2">{product._id}</td>
                  <td className="border px-4 py-2">{product.slug}</td>
                  <td className="border px-4 py-2">{product.quantity}</td>
                  <td className="border px-4 py-2">₹{product.price}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
