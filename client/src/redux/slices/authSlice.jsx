<<<<<<< HEAD
=======

>>>>>>> 94cc5fe703341e7e671d68578a0b03dbb031bc59
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("userDetails") || null,
<<<<<<< HEAD
  token: localStorage.getItem("userToken") || null,
};
// const initialState = {
//   user: JSON.parse(localStorage.getItem("userDetails")) || null,
//   token: localStorage.getItem("userToken") || null,
// };

=======
  token: localStorage.getItem("userToken") || null, // default role for now
};
>>>>>>> 94cc5fe703341e7e671d68578a0b03dbb031bc59

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
<<<<<<< HEAD
      state.token = action.payload.token;
=======
      state.token = action.payload.token; // allow dynamic role
      localStorage.setItem("userToken", action.payload.token);
      localStorage.setItem("userDetails", JSON.stringify(action.payload.user));
>>>>>>> 94cc5fe703341e7e671d68578a0b03dbb031bc59
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
<<<<<<< HEAD
=======
      state.role = null;
>>>>>>> 94cc5fe703341e7e671d68578a0b03dbb031bc59
      localStorage.removeItem("userToken");
      localStorage.removeItem("userDetails");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
<<<<<<< HEAD

=======
>>>>>>> 94cc5fe703341e7e671d68578a0b03dbb031bc59
export default authSlice.reducer;
