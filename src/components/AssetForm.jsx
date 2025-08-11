import React, { useState } from "react";
import { addAssetToRealtimeDB } from "../services/firebaseService";
import "./portfolio.css";

const AddAssetForm = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("stock");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !purchasePrice || !quantity) {
      alert("Please fill all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const amountInvested = parseFloat(purchasePrice) * parseFloat(quantity);
      
      const assetData = {
        name: name.trim().toUpperCase(),
        type,
        purchasePrice: parseFloat(purchasePrice),
        quantity: parseFloat(quantity),
        amountInvested: amountInvested,
        createdAt: new Date().toISOString(),
      };

      console.log("Adding asset to Realtime Database:", assetData);
      
      await addAssetToRealtimeDB(assetData);

      // Clear form
      setName("");
      setType("stock");
      setPurchasePrice("");
      setQuantity("");
      
      alert("Asset added successfully!");
      console.log("Asset added successfully to Realtime Database");
    } catch (error) {
      console.error("Error adding asset:", error);
      alert(`Error adding asset: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-asset-form">
      <h2>Add New Asset</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ticker / Symbol (e.g. AAPL, BTC)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSubmitting}
        />

        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          disabled={isSubmitting}
        >
          <option value="stock">Stock</option>
          <option value="crypto">Crypto</option>
          <option value="bond">Bond</option>
        </select>

        <input
          type="number"
          step="0.01"
          placeholder="Purchase Price per Share/Coin"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          required
          disabled={isSubmitting}
        />

        <input
          type="number"
          step="0.01"
          placeholder="Quantity (Number of Shares/Coins)"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          disabled={isSubmitting}
        />

        {purchasePrice && quantity && (
          <div className="investment-summary">
            <p>Total Amount Invested: ${(parseFloat(purchasePrice || 0) * parseFloat(quantity || 0)).toLocaleString()}</p>
          </div>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding Asset...' : 'Add Asset'}
        </button>
      </form>
    </div>
  );
};

export default AddAssetForm;
