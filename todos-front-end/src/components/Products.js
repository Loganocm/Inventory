// src/components/Products.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("/api/products")  // This will call http://localhost:5000/api/products
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching products!", error);
      });
  }, []);

  return (
    <div>
    <h1>Products</h1>
    <ul>
      {products.length === 0 ? (
        <li>No products available</li>
      ) : (
        products.map((product) => (
          <li key={product._id}>{product.name}</li>
        ))
      )}
    </ul>
  </div>
);
};

export default Products;