import React, { useState } from "react";
import AddProduct from "./components/AddProduct";
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

  return (
    <div className="App">
      <AddProduct addProduct={addProduct} />
    </div>
  );
}

export default App;
