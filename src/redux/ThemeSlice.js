import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: false, // default is light
};

const ThemeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const { toggleTheme } = ThemeSlice.actions;
export default ThemeSlice.reducer;
