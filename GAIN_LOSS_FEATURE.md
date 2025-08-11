# Gain/Loss Calculation Feature

## What's New

### 1. **Updated Asset Form**
- **Purchase Price**: Enter the price you bought each share/coin at
- **Quantity**: Enter the number of shares/coins you own
- **Auto Calculation**: Total amount invested is calculated automatically
- **Real-time Preview**: Shows total investment as you type

### 2. **Portfolio Display**
- **Current Price**: Real-time market price from APIs
- **Purchase Price**: Your original purchase price
- **Gain/Loss Amount**: Dollar amount gained or lost
- **Gain/Loss Percentage**: Percentage gained or lost
- **Color Coding**: Green for gains, red for losses

### 3. **Portfolio Summary**
- **Total Invested**: Sum of all your investments
- **Current Value**: Total value at current market prices
- **Total Gain/Loss**: Overall profit or loss across all assets

## How It Works

### Formula Used:
```
Gain/Loss = (Current Price × Quantity) - (Purchase Price × Quantity)
Percentage = (Gain/Loss ÷ Total Invested) × 100
```

### Example:
- **Purchase**: 10 shares of AAPL at $150 each = $1,500 invested
- **Current**: AAPL at $160 per share = $1,600 current value
- **Gain**: $100 profit (+6.67%)

## Visual Features

### Asset Cards Show:
- ✅ Asset name and type
- ✅ Current market price
- ✅ Your purchase price
- ✅ Quantity owned
- ✅ Current total value
- ✅ **Gain/Loss amount** (green/red)
- ✅ **Gain/Loss percentage** (green/red)

### Portfolio Summary Shows:
- ✅ Total number of assets
- ✅ Total amount invested
- ✅ Current portfolio value
- ✅ **Total gain/loss across all assets**

## How to Use

### Step 1: Add Assets
1. Click "Add Asset"
2. Enter symbol (e.g., AAPL, BTC)
3. Enter **purchase price per share/coin**
4. Enter **quantity owned**
5. Submit - total investment is calculated automatically

### Step 2: View Results
- Portfolio cards show real-time gain/loss
- Green background = profit
- Red background = loss
- Percentage and dollar amount displayed

### Step 3: Monitor Performance
- Real-time price updates from APIs
- Automatic gain/loss calculations
- Portfolio summary shows overall performance

## Benefits

1. **Accurate Tracking**: Know exactly how much you've gained or lost
2. **Real-time Updates**: Current market prices from reliable APIs
3. **Visual Feedback**: Color-coded gains and losses
4. **Portfolio Overview**: See total performance across all assets
5. **Easy Input**: Just enter purchase price and quantity

## Example Scenarios

### Profitable Investment:
- **AAPL**: Bought 10 shares at $150, now $160
- **Display**: +$100 (+6.67%) in green

### Loss Investment:
- **TSLA**: Bought 5 shares at $800, now $750
- **Display**: -$250 (-6.25%) in red

### Mixed Portfolio:
- Some assets in green (profit)
- Some assets in red (loss)
- Overall portfolio summary shows net gain/loss 