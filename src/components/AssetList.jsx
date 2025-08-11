import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "./portfolio.css";

const FINNHUB_API_KEY = "YOUR_FINNHUB_API_KEY";
const FMP_API_KEY = "YOUR_FMP_API_KEY";

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch assets in real time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "assets"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAssets(data);
    });

    return () => unsub();
  }, []);

  // Fetch live prices whenever assets change
  useEffect(() => {
    const fetchPrices = async () => {
      let newPrices = {};

      for (let asset of assets) {
        try {
          if (asset.type === "stock") {
            const res = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${asset.name}&token=${FINNHUB_API_KEY}`
            );
            const data = await res.json();
            newPrices[asset.id] = data.c || null; // current price
          } else if (asset.type === "crypto") {
            const res = await fetch(
              `https://api.coingecko.com/api/v3/simple/price?ids=${asset.name.toLowerCase()}&vs_currencies=usd`
            );
            const data = await res.json();
            newPrices[asset.id] = data[asset.name.toLowerCase()]?.usd || null;
          } else if (asset.type === "bond") {
            const res = await fetch(
              `https://financialmodelingprep.com/api/v3/treasury?apikey=${FMP_API_KEY}`
            );
            const data = await res.json();
            newPrices[asset.id] = data[0]?.close || null; // example, adjust based on actual FMP bond API
          }
        } catch (error) {
          console.error("Error fetching price for", asset.name, error);
        }
      }

      setPrices(newPrices);
      setLoading(false);
    };

    if (assets.length > 0) {
      fetchPrices();
    } else {
      setLoading(false);
    }
  }, [assets]);

  if (loading) return <p>Loading prices...</p>;

  return (
    <div className="asset-grid">
      {assets.map((asset) => (
        <div key={asset.id} className="asset-card">
          <h3>{asset.name}</h3>
          <p className="asset-type">{asset.type.toUpperCase()}</p>
          <p>Invested: ${asset.amount}</p>
          <p>Quantity: {asset.quantity}</p>
          <p className="asset-price">
            Current Price:{" "}
            {prices[asset.id] ? `$${prices[asset.id].toFixed(2)}` : "N/A"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AssetList;
