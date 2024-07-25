"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");

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

  return (
    <>
      <Header />

      {/* Search product container */}
      <div className="container my-8 mx-auto p-4">
        <div className="text-green-500 text-center">{alert}</div>
        <h1 className="text-2xl font-semibold mb-4">Search a product</h1>
        <div className="flex w-full gap-2">
          <input
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
      <div className="container my-8  mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Current Stock</h1>
        <table className="min-w-full bg-white text-center">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Price</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((product) => (
                <tr key={product.slug}>
                  <td className="py-2 px-4 border-b">{product._id}</td>
                  <td className="py-2 px-4 border-b">{product.slug}</td>
                  <td className="py-2 px-4 border-b">{product.quantity}</td>
                  <td className="py-2 px-4 border-b">₹{product.price}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
