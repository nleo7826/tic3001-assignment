import React, { useState } from "react";
import AddProduct from "./components/AddProduct";
import ListProducts from "./components/ProductList";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);

  const addProduct = async (product) => {
    try {
      const res = await axios.post("/api/products", product);
      setProducts([...products, res.data]);
      return { success: true, message: "Product added successfully" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Failed to add product" };
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <AddProduct addProduct={addProduct} />
      {/* <ListProducts products={products} fetchProducts={fetchProducts} /> */}
    </div>
  );
}

export default App;
