
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("userDetails") || null,
  token: localStorage.getItem("userToken") || null, // default role for now
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token; // allow dynamic role
      localStorage.setItem("userToken", action.payload.token);
      localStorage.setItem("userDetails", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem("userToken");
      localStorage.removeItem("userDetails");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
