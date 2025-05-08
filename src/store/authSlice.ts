import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    setInitialized(state, action) {
      state.isInitialized = action.payload;
    }
  },
});

export const { setLoggedIn, setInitialized } = authSlice.actions;
export default authSlice.reducer;
