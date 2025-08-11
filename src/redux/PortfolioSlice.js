// src/redux/portfolioSlice.js
import { createSlice } from "@reduxjs/toolkit";

const PortfolioSlice = createSlice({
  name: "portfolio",
  initialState: {
    assets: [] // default empty array
  },
  reducers: {
    setAssets: (state, action) => {
      state.assets = action.payload;
    }
  }
});

export const { setAssets } = PortfolioSlice.actions;
export default PortfolioSlice.reducer;
