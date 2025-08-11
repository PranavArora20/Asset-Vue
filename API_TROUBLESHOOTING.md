# API Troubleshooting Guide

## Current Status
Your portfolio page is now running with improved API handling, fallback data, and debugging tools.

## What I've Fixed

### 1. **Enhanced API Service**
- Added rate limiting (30 calls per minute)
- Added timeout handling (10 seconds)
- Added comprehensive fallback data for when APIs fail
- Better error handling and logging

### 2. **Fallback Data**
When APIs fail, the system now uses realistic fallback prices:
- **Stocks**: AAPL ($150), GOOGL ($2800), MSFT ($300), etc.
- **Crypto**: BTC ($45000), ETH ($3000), etc.
- **Bonds**: US10Y (1.5%), US30Y (2.0%), etc.

### 3. **Debug Tools Added**
- **Test APIs Button**: Tests stock and crypto APIs directly
- **Test Firebase Button**: Tests Firebase connection
- **Refresh Prices Button**: Manually refresh all prices
- **Debug Info Section**: Shows detailed price information

## How to Test

### Step 1: Test APIs
1. Go to your portfolio page (`http://localhost:5174/portfolio`)
2. Click **"Test APIs"** button
3. Check the console and message for results

### Step 2: Add Test Assets
1. Click **"Add Asset"** button
2. Add these test assets:
   - **Stock**: AAPL, 10 shares, $1500 invested
   - **Crypto**: BTC, 0.1 coins, $4500 invested
   - **Stock**: GOOGL, 5 shares, $14000 invested

### Step 3: Check Results
1. Look for the portfolio cards with prices
2. Click **"Debug Info"** to see detailed price data
3. Use **"Refresh Prices"** to manually update prices

## Common Issues and Solutions

### Issue 1: "No Data Showing"
**Symptoms**: Portfolio page shows "No Assets Found"
**Solution**: 
1. Click "Test Firebase" to verify Firebase connection
2. Add assets using the "Add Asset" form
3. Check browser console for errors

### Issue 2: "Prices Not Loading"
**Symptoms**: Assets show but prices are "N/A"
**Solution**:
1. Click "Test APIs" to check API connectivity
2. Click "Refresh Prices" to manually fetch prices
3. Check browser console for API errors

### Issue 3: "API Rate Limit"
**Symptoms**: Console shows "API rate limit reached"
**Solution**:
1. Wait 1 minute for rate limit to reset
2. Use fallback data (prices will still show)
3. Consider upgrading API keys for higher limits

### Issue 4: "CORS Errors"
**Symptoms**: Console shows CORS-related errors
**Solution**:
1. This is normal for some APIs in development
2. Fallback data will be used automatically
3. In production, use a proxy or backend API

## API Status Check

### Finnhub (Stocks)
- **Status**: Free tier with rate limits
- **Rate Limit**: 60 calls/minute
- **Common Issues**: Rate limiting, invalid symbols

### CoinGecko (Crypto)
- **Status**: Free tier with rate limits
- **Rate Limit**: 50 calls/minute
- **Common Issues**: Rate limiting, symbol mapping

### Financial Modeling Prep (Bonds)
- **Status**: Free tier with rate limits
- **Rate Limit**: 250 calls/day
- **Common Issues**: Limited bond symbols

## Debug Information

### Console Logs to Look For
```
✅ Good: "Fetching stock price for AAPL from Finnhub..."
✅ Good: "Stock price for AAPL: $150.25"
❌ Bad: "Error fetching stock price for AAPL: Request failed"
❌ Bad: "API rate limit reached, using fallback data"
```

### Expected Behavior
1. **First Load**: Shows loading, then portfolio data
2. **API Success**: Real prices from APIs
3. **API Failure**: Fallback prices (still functional)
4. **Rate Limit**: Fallback prices with warning

## Testing Checklist

- [ ] Portfolio page loads without errors
- [ ] "Test APIs" button works and shows prices
- [ ] "Test Firebase" button works and adds test asset
- [ ] "Add Asset" form works and saves to Firebase
- [ ] Assets appear in portfolio with prices
- [ ] "Refresh Prices" button updates prices
- [ ] Debug info shows detailed price data
- [ ] Console shows API call logs

## Next Steps

1. **Test the APIs**: Use the "Test APIs" button
2. **Add Assets**: Use the form to add some test assets
3. **Monitor Console**: Check for any error messages
4. **Check Prices**: Verify prices are loading (real or fallback)

If you're still having issues, please share:
1. What you see in the browser console
2. What happens when you click "Test APIs"
3. Any error messages displayed on the page 