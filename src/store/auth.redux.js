import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  loggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login(state) {
      state.loggedIn = true;
    },
    logout(state) {
      state.loggedIn = false;
    },
  },
});

//export the actions, so we can modify the variables from other components
export const authActions = authSlice.actions;

//export the auth slice, we can tell redux about the changes we created here
export default authSlice.reducer;
