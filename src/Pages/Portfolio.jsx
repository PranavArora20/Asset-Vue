import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAssetPrice } from "../services/apiService";
import { deleteAssetFromRealtimeDB } from "../services/firebaseService";
import AssetForm from "../components/AssetForm";
import AssetChart from "../components/AssetChart";
import "../components/portfolio.css";

export default function Portfolio() {
  const dispatch = useDispatch();
  const assets = useSelector((state) => state.portfolio.assets) || [];
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'stock' | 'bond' | 'crypto'
  const [showTimeValueCalculation, setShowTimeValueCalculation] = useState(false);
  const [timeValueYear, setTimeValueYear] = useState(new Date().getFullYear());

  // Derived counts for buttons
  const typeCounts = useMemo(() => {
    return assets.reduce(
      (acc, a) => {
        const key = (a.type || 'stock').toLowerCase();
        if (acc[key] != null) acc[key] += 1;
        return acc;
      },
      { stock: 0, bond: 0, crypto: 0 }
    );
  }, [assets]);

  // Filtered assets
  const filteredAssets = useMemo(() => {
    if (activeFilter === 'all') return assets;
    return assets.filter(a => (a.type || 'stock').toLowerCase() === activeFilter);
  }, [assets, activeFilter]);

  // Portfolio metrics based on filtered assets
  const overallMetrics = useMemo(() => {
    const totalInvested = filteredAssets.reduce((sum, a) => sum + (a.amountInvested || 0), 0);
    const currentValue = filteredAssets.reduce((sum, a) => {
      const p = prices[a.id] || 0;
      return sum + p * (a.quantity || 0);
    }, 0);
    const gainLoss = currentValue - totalInvested;
    const percentage = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;
    return { totalInvested, currentValue, gainLoss, percentage };
  }, [filteredAssets, prices]);

  // Calculate gain/loss percentage
  const calculateGainLoss = (purchasePrice, currentPrice, quantity) => {
    if (!purchasePrice || !currentPrice || !quantity) return null;
    const totalInvested = purchasePrice * quantity;
    const currentValue = currentPrice * quantity;
    const gainLoss = currentValue - totalInvested;
    const percentage = (gainLoss / totalInvested) * 100;
    return { gainLoss, percentage, currentValue, totalInvested };
  };

  // Calculate time value of money (inflation-adjusted profit/loss)
  const calculateTimeValueOfMoney = (targetYear = timeValueYear) => {
    const currentYear = new Date().getFullYear();
    const inflationRate = 0.03; // 3% average annual inflation rate
    let totalOriginalValue = 0;
    let totalInflationAdjustedValue = 0;
    let totalCurrentValue = 0;
    const assetCalculations = [];

    filteredAssets.forEach(asset => {
      const currentPrice = prices[asset.id] || 0;
      const originalValue = asset.amountInvested || 0;
      const currentValue = currentPrice * (asset.quantity || 0);
      const investmentYear = asset.createdAt ? new Date(asset.createdAt).getFullYear() : (currentYear - 5);
      const yearsInvested = targetYear - investmentYear;
      const inflationAdjustedValue = originalValue * Math.pow(1 + inflationRate, yearsInvested);
      totalOriginalValue += originalValue;
      totalInflationAdjustedValue += inflationAdjustedValue;
      totalCurrentValue += currentValue;
      assetCalculations.push({ name: asset.name, originalValue, inflationAdjustedValue, currentValue, yearsInvested });
    });

    const totalRealGainLoss = totalCurrentValue - totalInflationAdjustedValue;
    const totalRealPercentage = totalInflationAdjustedValue > 0 ? (totalRealGainLoss / totalInflationAdjustedValue) * 100 : 0;
    return { totalOriginalValue, totalInflationAdjustedValue, totalCurrentValue, totalRealGainLoss, totalRealPercentage, targetYear, assetCalculations };
  };

  const [timeValueData, setTimeValueData] = useState(null);

  // Calculate time value data when assets or prices change
  useEffect(() => {
    if (filteredAssets.length > 0 && Object.keys(prices).length > 0) {
      const data = calculateTimeValueOfMoney();
      setTimeValueData(data);
    }
  }, [filteredAssets, prices, timeValueYear]);

  // Fetch prices for all assets
  useEffect(() => {
    const fetchPrices = async () => {
      if (assets.length === 0) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      const updatedPrices = {};
      try {
      for (let asset of assets) {
        try {
            const symbol = asset.name;
            const price = await getAssetPrice(asset.type, symbol);
          updatedPrices[asset.id] = price || 0;
        } catch (err) {
          updatedPrices[asset.id] = 0;
        }
      }
      setPrices(updatedPrices);
      } catch (err) {
        setError("Failed to fetch asset prices");
      } finally {
      setLoading(false);
      }
    };
      fetchPrices();
  }, [assets]);

  const handleDelete = async (asset) => {
    const confirmed = window.confirm(`Remove ${asset.name} from your portfolio?`);
    if (!confirmed) return;
    try {
      await deleteAssetFromRealtimeDB(asset.id);
    } catch (error) {
      console.error("Failed to delete asset:", error);
      alert("Failed to delete asset. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="portfolio-loading">
        <h2>Loading portfolio data...</h2>
        <p>Please wait while we fetch your assets and current prices.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portfolio-error">
        <h2>Error Loading Portfolio</h2>
        <p>{error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      <div className="portfolio-header">
        <h1>My Portfolio</h1>
        <p>Track your investments and performance</p>
        <div className="portfolio-actions">
          <button 
            className="add-asset-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add Asset'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="add-asset-section">
          <AssetForm />
        </div>
      )}

      {/* Filters */}
      <div className="filter-section" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#374151' }}>Filter by Asset Type</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: `All Assets (${assets.length})` },
            { key: 'stock', label: `Stocks (${typeCounts.stock})` },
            { key: 'bond', label: `Bonds (${typeCounts.bond})` },
            { key: 'crypto', label: `Crypto (${typeCounts.crypto})` }
          ].map(btn => (
            <button
              key={btn.key}
              onClick={() => setActiveFilter(btn.key)}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeFilter === btn.key ? '#2563eb' : '#e5e7eb',
                color: activeFilter === btn.key ? 'white' : '#374151',
                fontWeight: 500
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {filteredAssets.length > 0 && (
        <div className="portfolio-summary">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
            <div className="comparison-metric">
              <h3>Total Invested</h3>
              <p>${overallMetrics.totalInvested.toLocaleString()}</p>
            </div>
            <div className="comparison-metric">
              <h3>Current Value</h3>
              <p>${overallMetrics.currentValue.toLocaleString()}</p>
            </div>
            <div
              className={`comparison-metric ${overallMetrics.gainLoss >= 0 ? 'gain' : 'loss'}`}
              style={{ borderRadius: 12, padding: 20, textAlign: 'center' }}
            >
              <h3>Total Gain/Loss</h3>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: 0 }}>
                {overallMetrics.gainLoss >= 0 ? '+' : ''}${overallMetrics.gainLoss.toLocaleString()}
              </p>
              <p style={{ margin: 0 }}>
                ({overallMetrics.gainLoss >= 0 ? '+' : ''}{overallMetrics.percentage.toFixed(2)}%)
              </p>
            </div>
          </div>
          
          {/* Time Value of Money Section */}
          <div className="time-value-section" style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Time Value of Money Analysis</h3>
              <button 
                className="time-value-btn"
                onClick={() => setShowTimeValueCalculation(!showTimeValueCalculation)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                {showTimeValueCalculation ? 'Hide' : 'Show'} Inflation-Adjusted Analysis
              </button>
            </div>
            
            {showTimeValueCalculation && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <label htmlFor="timeValueYear" style={{ fontWeight: '500', color: '#374151' }}>
                    Calculate for year:
                  </label>
                  <input
                    type="number"
                    id="timeValueYear"
                    value={timeValueYear}
                    onChange={(e) => setTimeValueYear(parseInt(e.target.value) || new Date().getFullYear())}
                    min="1900"
                    max="2100"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                {timeValueData && (
                  <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div className="comparison-metric">
                      <h4>Original Investment Value</h4>
                      <p>${timeValueData.totalOriginalValue.toLocaleString()}</p>
                    </div>
                    <div className="comparison-metric">
                      <h4>Inflation-Adjusted Value ({timeValueData.targetYear})</h4>
                      <p>${timeValueData.totalInflationAdjustedValue.toLocaleString()}</p>
                    </div>
                    <div className="comparison-metric">
                      <h4>Current Market Value</h4>
                      <p>${timeValueData.totalCurrentValue.toLocaleString()}</p>
                    </div>
                    <div className={`comparison-metric ${timeValueData.totalRealGainLoss >= 0 ? 'gain' : 'loss'}`}>
                      <h4>Real Profit/Loss (Inflation-Adjusted)</h4>
                      <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>
                        {timeValueData.totalRealGainLoss >= 0 ? '+' : ''}${timeValueData.totalRealGainLoss.toLocaleString()}
                      </p>
                      <p style={{ margin: '5px 0 0 0' }}>
                        ({timeValueData.totalRealGainLoss >= 0 ? '+' : ''}{timeValueData.totalRealPercentage.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                  
                  <div className="time-value-note" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                    <p style={{ margin: '0', fontSize: '0.9rem', color: '#64748b', textAlign: 'center' }}>
                      <em>This calculation accounts for 3% annual inflation rate and shows the "real" purchasing power of your investments over time.</em>
                    </p>
                  </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Charts */}
      {filteredAssets.length > 0 && (
        <div className="comparison-overview" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16, marginBottom: 24 }}>
          <div className="comparison-card">
            <h3>Allocation by Type</h3>
            <AssetChart assets={filteredAssets} prices={prices} variant="pie" height={280} />
          </div>
          <div className="comparison-card">
            <h3>Invested vs Current (per Asset)</h3>
            <AssetChart assets={filteredAssets} prices={prices} variant="bar" height={280} />
          </div>
        </div>
      )}

      {filteredAssets.length === 0 ? (
        <div className="portfolio-empty">
          <h2>No Assets Found</h2>
          <p>Try changing the filter or add assets to get started!</p>
        </div>
      ) : (
        <div className="portfolio-grid">
          {filteredAssets.map((asset) => {
            const currentPrice = prices[asset.id] || 0;
            const gainLoss = calculateGainLoss(asset.purchasePrice, currentPrice, asset.quantity);
            return (
        <div key={asset.id} className="portfolio-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>{asset.name}</h3>
                  <button className="delete-btn" onClick={() => handleDelete(asset)}>Remove</button>
                </div>
                <p className="portfolio-type">{asset.type}</p>
                <p className="portfolio-price">Current: ${currentPrice?.toLocaleString() || "N/A"}</p>
                <p className="portfolio-purchase-price">Purchase: ${asset.purchasePrice?.toLocaleString() || "N/A"}</p>
                <p className="portfolio-quantity">Qty: {asset.quantity}</p>
                <p className="portfolio-total">Current Value: ${(currentPrice * (asset.quantity || 0)).toLocaleString()}</p>
                {gainLoss && (
                  <div className={`gain-loss ${gainLoss.gainLoss >= 0 ? 'gain' : 'loss'}`}>
                    <p className="gain-loss-amount">
                      {gainLoss.gainLoss >= 0 ? '+' : ''}${gainLoss.gainLoss.toLocaleString()}
                    </p>
                    <p className="gain-loss-percentage">
                      ({gainLoss.gainLoss >= 0 ? '+' : ''}{gainLoss.percentage.toFixed(2)}%)
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
