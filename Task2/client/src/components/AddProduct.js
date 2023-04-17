import React, { useState } from "react";
import "./AddProduct.css";

const AddProduct = ({ addProduct }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [showPopup, setShowPopup] = useState(false); // Add state for popup

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct({ name, price, quantity });
    setName("");
    setPrice("");
    setQuantity("");
    setShowPopup(true); // Show popup on successful submission
    setTimeout(() => setShowPopup(false), 5000); // Hide popup after 5 seconds
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Price:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Add Product</button>
      </form>
      {showPopup && <div className="popup">Product added successfully</div>}
    </div>
  );
};

export default AddProduct;
