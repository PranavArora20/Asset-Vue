import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAssetPrice } from "../services/apiService";
import "../components/portfolio.css";

function Compare() {
  const assets = useSelector((state) => state.portfolio.assets) || [];
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comparisonData, setComparisonData] = useState({
    stocks: { assets: [], totalInvested: 0, currentValue: 0, gainLoss: 0, percentage: 0 },
    bonds: { assets: [], totalInvested: 0, currentValue: 0, gainLoss: 0, percentage: 0 },
    crypto: { assets: [], totalInvested: 0, currentValue: 0, gainLoss: 0, percentage: 0 }
  });
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'stocks', 'bonds', 'crypto'

  // Debug logging
  useEffect(() => {
    console.log("🔍 Compare page - Assets from Redux:", assets);
    console.log("🔍 Compare page - Assets length:", assets.length);
    if (assets.length > 0) {
      console.log("🔍 Compare page - First asset sample:", assets[0]);
    }
  }, [assets]);

  // Calculate gain/loss for an asset
  const calculateGainLoss = (purchasePrice, currentPrice, quantity) => {
    if (!purchasePrice || !currentPrice || !quantity) return null;
    
    const totalInvested = purchasePrice * quantity;
    const currentValue = currentPrice * quantity;
    const gainLoss = currentValue - totalInvested;
    const percentage = (gainLoss / totalInvested) * 100;
    
    return {
      gainLoss,
      percentage,
      currentValue,
      totalInvested
    };
  };

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
        console.log("Fetching prices for comparison:", assets);
        for (let asset of assets) {
          try {
            const symbol = asset.symbol || asset.name;
            console.log(`Fetching price for ${asset.type}: ${symbol}`);
            const price = await getAssetPrice(asset.type, symbol);
            console.log(`Price for ${symbol}: ${price}`);
            updatedPrices[asset.id] = price || 0;
          } catch (err) {
            console.error(`Error fetching ${asset.type} price for ${asset.name}`, err);
            updatedPrices[asset.id] = 0;
          }
        }

        setPrices(updatedPrices);
      } catch (err) {
        console.error("Error fetching prices:", err);
        setError("Failed to fetch asset prices");
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [assets]);

  // Calculate comparison data when prices change
  useEffect(() => {
    if (Object.keys(prices).length === 0) return;

    const calculateComparison = () => {
      const comparison = {
        stocks: { assets: [], totalInvested: 0, currentValue: 0, gainLoss: 0, percentage: 0 },
        bonds: { assets: [], totalInvested: 0, currentValue: 0, gainLoss: 0, percentage: 0 },
        crypto: { assets: [], totalInvested: 0, currentValue: 0, gainLoss: 0, percentage: 0 }
      };

      assets.forEach(asset => {
        const currentPrice = prices[asset.id] || 0;
        const gainLoss = calculateGainLoss(asset.purchasePrice, currentPrice, asset.quantity);
        
        const assetData = {
          ...asset,
          currentPrice,
          gainLoss
        };

        // Map asset types to comparison keys
        let comparisonKey = 'stocks'; // default
        if (asset.type.toLowerCase() === 'bond') {
          comparisonKey = 'bonds';
        } else if (asset.type.toLowerCase() === 'crypto') {
          comparisonKey = 'crypto';
        }
        
        if (comparison[comparisonKey]) {
          comparison[comparisonKey].assets.push(assetData);
          comparison[comparisonKey].totalInvested += asset.amountInvested || 0;
          comparison[comparisonKey].currentValue += gainLoss?.currentValue || 0;
          comparison[comparisonKey].gainLoss += gainLoss?.gainLoss || 0;
        }
        
        console.log(`🔍 Asset ${asset.name} (${asset.type}) mapped to ${comparisonKey}`);
      });

      // Calculate percentages for each type
      Object.keys(comparison).forEach(type => {
        if (comparison[type].totalInvested > 0) {
          comparison[type].percentage = (comparison[type].gainLoss / comparison[type].totalInvested) * 100;
        }
      });

      console.log("🔍 Final comparison data:", comparison);
      setComparisonData(comparison);
    };

    calculateComparison();
  }, [prices, assets]);

  // Calculate overall portfolio metrics
  const overallMetrics = {
    totalInvested: Object.values(comparisonData).reduce((sum, type) => sum + type.totalInvested, 0),
    currentValue: Object.values(comparisonData).reduce((sum, type) => sum + type.currentValue, 0),
    gainLoss: Object.values(comparisonData).reduce((sum, type) => sum + type.gainLoss, 0),
    percentage: Object.values(comparisonData).reduce((sum, type) => sum + type.totalInvested, 0) > 0 
      ? (Object.values(comparisonData).reduce((sum, type) => sum + type.gainLoss, 0) / 
         Object.values(comparisonData).reduce((sum, type) => sum + type.totalInvested, 0)) * 100 
      : 0
  };

  if (loading) {
    return (
      <div className="portfolio-loading">
        <h2>Loading comparison data...</h2>
        <p>Please wait while we fetch your assets and current prices.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portfolio-error">
        <h2>Error Loading Comparison</h2>
        <p>{error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      <div className="portfolio-header">
        <h1>Portfolio Comparison</h1>
        <p>Compare performance across different asset types</p>
      </div>

      {/* Filter Buttons */}
      <div className="filter-section" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#374151' }}>Filter by Asset Type</h3>
        <div className="filter-buttons" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveFilter('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeFilter === 'all' ? '#2563eb' : '#e5e7eb',
              color: activeFilter === 'all' ? 'white' : '#374151',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            All Assets
          </button>
          <button
            onClick={() => setActiveFilter('stocks')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeFilter === 'stocks' ? '#2563eb' : '#e5e7eb',
              color: activeFilter === 'stocks' ? 'white' : '#374151',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            Stocks ({comparisonData.stocks.assets.length})
          </button>
          <button
            onClick={() => setActiveFilter('bonds')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeFilter === 'bonds' ? '#2563eb' : '#e5e7eb',
              color: activeFilter === 'bonds' ? 'white' : '#374151',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            Bonds ({comparisonData.bonds.assets.length})
          </button>
          <button
            onClick={() => setActiveFilter('crypto')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeFilter === 'crypto' ? '#2563eb' : '#e5e7eb',
              color: activeFilter === 'crypto' ? 'white' : '#374151',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            Crypto ({comparisonData.crypto.assets.length})
          </button>
        </div>
      </div>

      {/* Overall Portfolio Summary */}
      <div className="portfolio-summary">
        <h2>Overall Portfolio Performance</h2>
        <div className="comparison-overview">
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
            style={{
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}
          >
            <h3>Total Gain/Loss</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '5px 0' }}>
              {overallMetrics.gainLoss >= 0 ? '+' : ''}${overallMetrics.gainLoss.toLocaleString()}
            </p>
            <p style={{ fontSize: '1.1rem', margin: '5px 0' }}>
              ({overallMetrics.gainLoss >= 0 ? '+' : ''}{overallMetrics.percentage.toFixed(2)}%)
            </p>
          </div>
        </div>
      </div>

      {/* Asset Type Comparison */}
      <div className="comparison-grid">
        {/* Stocks */}
        {(activeFilter === 'all' || activeFilter === 'stocks') && (
          <div className="comparison-card">
            <h2>Stocks</h2>
            <div className="comparison-summary">
              <p>Total Invested: ${comparisonData.stocks.totalInvested.toLocaleString()}</p>
              <p>Current Value: ${comparisonData.stocks.currentValue.toLocaleString()}</p>
              <div className={`gain-loss ${comparisonData.stocks.gainLoss >= 0 ? 'gain' : 'loss'}`} style={{ marginTop: '10px' }}>
                <p className="gain-loss-amount">
                  {comparisonData.stocks.gainLoss >= 0 ? '+' : ''}${comparisonData.stocks.gainLoss.toLocaleString()}
                </p>
                <p className="gain-loss-percentage">
                  ({comparisonData.stocks.gainLoss >= 0 ? '+' : ''}{comparisonData.stocks.percentage.toFixed(2)}%)
                </p>
              </div>
            </div>
            <div className="asset-list">
              <h3>Individual Assets</h3>
              {comparisonData.stocks.assets.length > 0 ? (
                comparisonData.stocks.assets.map(asset => (
                  <div key={asset.id} className="asset-item">
                    <h4>{asset.name}</h4>
                    <p>Invested: ${asset.amountInvested?.toLocaleString()}</p>
                    <p>Current: ${asset.gainLoss?.currentValue?.toLocaleString()}</p>
                    <div className={`gain-loss ${asset.gainLoss?.gainLoss >= 0 ? 'gain' : 'loss'}`} style={{ marginTop: '8px' }}>
                      <p className="gain-loss-amount">
                        {asset.gainLoss?.gainLoss >= 0 ? '+' : ''}${asset.gainLoss?.gainLoss?.toLocaleString()}
                      </p>
                      <p className="gain-loss-percentage">
                        ({asset.gainLoss?.gainLoss >= 0 ? '+' : ''}{asset.gainLoss?.percentage?.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No stocks in portfolio</p>
              )}
            </div>
          </div>
        )}

        {/* Bonds */}
        {(activeFilter === 'all' || activeFilter === 'bonds') && (
          <div className="comparison-card">
            <h2>Bonds</h2>
            <div className="comparison-summary">
              <p>Total Invested: ${comparisonData.bonds.totalInvested.toLocaleString()}</p>
              <p>Current Value: ${comparisonData.bonds.currentValue.toLocaleString()}</p>
              <div className={`gain-loss ${comparisonData.bonds.gainLoss >= 0 ? 'gain' : 'loss'}`} style={{ marginTop: '10px' }}>
                <p className="gain-loss-amount">
                  {comparisonData.bonds.gainLoss >= 0 ? '+' : ''}${comparisonData.bonds.gainLoss.toLocaleString()}
                </p>
                <p className="gain-loss-percentage">
                  ({comparisonData.bonds.gainLoss >= 0 ? '+' : ''}{comparisonData.bonds.percentage.toFixed(2)}%)
                </p>
              </div>
            </div>
            <div className="asset-list">
              <h3>Individual Assets</h3>
              {comparisonData.bonds.assets.length > 0 ? (
                comparisonData.bonds.assets.map(asset => (
                  <div key={asset.id} className="asset-item">
                    <h4>{asset.name}</h4>
                    <p>Invested: ${asset.amountInvested?.toLocaleString()}</p>
                    <p>Current: ${asset.gainLoss?.currentValue?.toLocaleString()}</p>
                    <div className={`gain-loss ${asset.gainLoss?.gainLoss >= 0 ? 'gain' : 'loss'}`} style={{ marginTop: '8px' }}>
                      <p className="gain-loss-amount">
                        {asset.gainLoss?.gainLoss >= 0 ? '+' : ''}${asset.gainLoss?.gainLoss?.toLocaleString()}
                      </p>
                      <p className="gain-loss-percentage">
                        ({asset.gainLoss?.gainLoss >= 0 ? '+' : ''}{asset.gainLoss?.percentage?.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No bonds in portfolio</p>
              )}
            </div>
          </div>
        )}

        {/* Crypto */}
        {(activeFilter === 'all' || activeFilter === 'crypto') && (
          <div className="comparison-card">
            <h2>Cryptocurrency</h2>
            <div className="comparison-summary">
              <p>Total Invested: ${comparisonData.crypto.totalInvested.toLocaleString()}</p>
              <p>Current Value: ${comparisonData.crypto.currentValue.toLocaleString()}</p>
              <div className={`gain-loss ${comparisonData.crypto.gainLoss >= 0 ? 'gain' : 'loss'}`} style={{ marginTop: '10px' }}>
                <p className="gain-loss-amount">
                  {comparisonData.crypto.gainLoss >= 0 ? '+' : ''}${comparisonData.crypto.gainLoss.toLocaleString()}
                </p>
                <p className="gain-loss-percentage">
                  ({comparisonData.crypto.gainLoss >= 0 ? '+' : ''}{comparisonData.crypto.percentage.toFixed(2)}%)
                </p>
              </div>
            </div>
            <div className="asset-list">
              <h3>Individual Assets</h3>
              {comparisonData.crypto.assets.length > 0 ? (
                comparisonData.crypto.assets.map(asset => (
                  <div key={asset.id} className="asset-item">
                    <h4>{asset.name}</h4>
                    <p>Invested: ${asset.amountInvested?.toLocaleString()}</p>
                    <p>Current: ${asset.gainLoss?.currentValue?.toLocaleString()}</p>
                    <div className={`gain-loss ${asset.gainLoss?.gainLoss >= 0 ? 'gain' : 'loss'}`} style={{ marginTop: '8px' }}>
                      <p className="gain-loss-amount">
                        {asset.gainLoss?.gainLoss >= 0 ? '+' : ''}${asset.gainLoss?.gainLoss?.toLocaleString()}
                      </p>
                      <p className="gain-loss-percentage">
                        ({asset.gainLoss?.gainLoss >= 0 ? '+' : ''}{asset.gainLoss?.percentage?.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No cryptocurrency in portfolio</p>
              )}
            </div>
          </div>
        )}
      </div>

      {assets.length === 0 && (
        <div className="portfolio-empty">
          <h2>No Assets Found</h2>
          <p>Your portfolio is empty. Add some assets to see comparisons!</p>
          <p>Go to the Portfolio page to add stocks, crypto, or bonds.</p>
        </div>
      )}
    </div>
  );
}

export default Compare;
