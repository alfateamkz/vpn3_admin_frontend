import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  baseURL: process.env.REACT_APP_URL || "",
  telegramBot: null,
  support: null,
  loaded: false,
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setConfig(state, action) {
      state.baseURL = action.payload.baseURL || state.baseURL;
      state.telegramBot = action.payload.telegramBot || null;
      state.support = action.payload.support || null;
      state.loaded = true;
    },
  },
});

export const { setConfig } = configSlice.actions;
export default configSlice.reducer;

