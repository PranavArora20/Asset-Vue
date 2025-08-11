// services/apiService.js
import axios from "axios";

// API Keys (Store them in .env for security)
const FINNHUB_KEY = "d2b3h41r01qrj4ik5pc0d2b3h41r01qrj4ik5pcg";
const FMP_KEY = "OBkreZ64TUQ7G1TR7mVg0oM2wWUoNkiP";

// Base URLs
const FINNHUB_BASE = "https://finnhub.io/api/v1";
const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
const FMP_BASE = "https://financialmodelingprep.com/api/v3";

// Rate limiting - track API calls
let apiCallCount = 0;
const MAX_CALLS_PER_MINUTE = 30;

// ===== STOCKS =====
export const getStockPrice = async (symbol) => {
  try {
    // Check rate limit
    if (apiCallCount >= MAX_CALLS_PER_MINUTE) {
      console.warn("API rate limit reached, using fallback data");
      return getFallbackStockPrice(symbol);
    }
    
    apiCallCount++;
    console.log(`Fetching stock price for ${symbol} from Finnhub...`);
    
    const res = await axios.get(`${FINNHUB_BASE}/quote`, {
      params: { symbol: symbol.toUpperCase(), token: FINNHUB_KEY },
      timeout: 10000, // 10 second timeout
    });
    
    if (res.data && res.data.c) {
      console.log(`Stock price for ${symbol}: $${res.data.c}`);
      return res.data.c;
    } else {
      console.warn(`No price data for ${symbol} from Finnhub`);
      return getFallbackStockPrice(symbol);
    }
  } catch (err) {
    console.error(`Error fetching stock price for ${symbol}:`, err.message);
    return getFallbackStockPrice(symbol);
  }
};

// ===== CRYPTO =====
export const getCryptoPrice = async (symbol) => {
  try {
    // Check rate limit
    if (apiCallCount >= MAX_CALLS_PER_MINUTE) {
      console.warn("API rate limit reached, using fallback data");
      return getFallbackCryptoPrice(symbol);
    }
    
    apiCallCount++;
    console.log(`Fetching crypto price for ${symbol} from CoinGecko...`);
    
    // Map common crypto symbols to CoinGecko IDs
    const cryptoMap = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'USDT': 'tether',
      'BNB': 'binancecoin',
      'SOL': 'solana',
      'ADA': 'cardano',
      'XRP': 'ripple',
      'DOT': 'polkadot',
      'DOGE': 'dogecoin',
      'AVAX': 'avalanche-2',
      'MATIC': 'matic-network',
      'LINK': 'chainlink',
      'UNI': 'uniswap',
      'LTC': 'litecoin',
      'BCH': 'bitcoin-cash',
      'XLM': 'stellar',
      'ATOM': 'cosmos',
      'ETC': 'ethereum-classic',
      'FIL': 'filecoin',
      'TRX': 'tron'
    };
    
    const coinId = cryptoMap[symbol.toUpperCase()] || symbol.toLowerCase();
    const res = await axios.get(`${COINGECKO_BASE}/simple/price`, {
      params: { ids: coinId, vs_currencies: "usd" },
      timeout: 10000,
    });
    
    if (res.data && res.data[coinId] && res.data[coinId].usd) {
      console.log(`Crypto price for ${symbol}: $${res.data[coinId].usd}`);
      return res.data[coinId].usd;
    } else {
      console.warn(`No price data for ${symbol} from CoinGecko`);
      return getFallbackCryptoPrice(symbol);
    }
  } catch (err) {
    console.error(`Error fetching crypto price for ${symbol}:`, err.message);
    return getFallbackCryptoPrice(symbol);
  }
};

// ===== BONDS =====
export const getBondPrice = async (symbol) => {
  try {
    // Check rate limit
    if (apiCallCount >= MAX_CALLS_PER_MINUTE) {
      console.warn("API rate limit reached, using fallback data");
      return getFallbackBondPrice(symbol);
    }
    
    apiCallCount++;
    console.log(`Fetching bond price for ${symbol} from FMP...`);
    
    const res = await axios.get(
      `${FMP_BASE}/treasury?symbol=${symbol}&apikey=${FMP_KEY}`,
      { timeout: 10000 }
    );
    
    if (Array.isArray(res.data) && res.data.length > 0 && res.data[0]?.price) {
      console.log(`Bond price for ${symbol}: $${res.data[0].price}`);
      return res.data[0].price;
    } else {
      console.warn(`No price data for ${symbol} from FMP`);
      return getFallbackBondPrice(symbol);
    }
  } catch (err) {
    console.error(`Error fetching bond price for ${symbol}:`, err.message);
    return getFallbackBondPrice(symbol);
  }
};

// ===== FALLBACK DATA =====
const getFallbackStockPrice = (symbol) => {
  const fallbackPrices = {
    'AAPL': 150.0,
    'GOOGL': 2800.0,
    'MSFT': 300.0,
    'AMZN': 3300.0,
    'TSLA': 800.0,
    'META': 300.0,
    'NVDA': 500.0,
    'NFLX': 500.0,
    'TEST': 100.0
  };
  return fallbackPrices[symbol.toUpperCase()] || 50.0;
};

const getFallbackCryptoPrice = (symbol) => {
  const fallbackPrices = {
    'BTC': 45000.0,
    'ETH': 3000.0,
    'USDT': 1.0,
    'BNB': 400.0,
    'SOL': 100.0,
    'ADA': 1.5,
    'XRP': 0.8,
    'DOT': 20.0,
    'DOGE': 0.15,
    'AVAX': 80.0,
    'MATIC': 1.2,
    'LINK': 20.0,
    'UNI': 25.0,
    'LTC': 150.0,
    'BCH': 400.0,
    'XLM': 0.3,
    'ATOM': 30.0,
    'ETC': 40.0,
    'FIL': 50.0,
    'TRX': 0.1
  };
  return fallbackPrices[symbol.toUpperCase()] || 10.0;
};

const getFallbackBondPrice = (symbol) => {
  const fallbackPrices = {
    'US10Y': 1.5,
    'US30Y': 2.0,
    'US5Y': 1.0,
    'US2Y': 0.5
  };
  return fallbackPrices[symbol.toUpperCase()] || 1.0;
};

// ===== UNIVERSAL FETCHER =====
export const getAssetPrice = async (type, symbol) => {
  if (!symbol) {
    console.error("No symbol provided for price fetch");
    return 0;
  }
  
  console.log(`Fetching ${type} price for symbol: ${symbol}`);
  
  switch (type.toLowerCase()) {
    case "stock":
      return await getStockPrice(symbol);
    case "crypto":
      return await getCryptoPrice(symbol);
    case "bond":
      return await getBondPrice(symbol);
    default:
      console.warn(`Unknown asset type: ${type}, using stock price fetch`);
      return await getStockPrice(symbol);
  }
};

// ===== PORTFOLIO FETCHER =====
export const getPortfolioAssets = async (assets = []) => {
  if (!Array.isArray(assets)) {
    console.error("Invalid assets provided to getPortfolioAssets:", assets);
    return [];
  }

  try {
    const results = await Promise.all(
      assets.map(async (asset) => ({
        ...asset,
        price: await getAssetPrice(asset.type, asset.symbol),
      }))
    );
    return results;
  } catch (err) {
    console.error("Error fetching portfolio assets:", err);
    return [];
  }
};

// Reset API call count every minute
setInterval(() => {
  apiCallCount = 0;
  console.log("API call count reset");
}, 60000);
