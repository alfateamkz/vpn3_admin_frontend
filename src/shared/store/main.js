import { createSlice } from "@reduxjs/toolkit";
import placeholder_picture from ".././images/placeholder_user.png";

const initialState = {
  token: "",
  number: "",
  isAuth: false,
  user: {},
};

const mainSlice = createSlice({
  name: "mainSlice",
  initialState,
  reducers: {
    setUserData(state, action) {
      state.isAuth = true;
      state.user = action.payload;
    },
    setAuth(state, action) {
      state.isAuth = action.payload;
    },
    /* eslint-disable */
    setResetData(state, action) {
      (state.number = action.payload.number),
        (state.token = action.payload.token);
    },
  },
});

export const { setAuth, setResetData, setUserData } = mainSlice.actions;

export default mainSlice.reducer;
