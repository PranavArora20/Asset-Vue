import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./ThemeSlice";
import portfolioReducer from "./PortfolioSlice";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    portfolio: portfolioReducer,
  },
});

export default store;
