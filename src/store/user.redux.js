import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  username: "",
  userId: "",
  isAdmin: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setUsername(state, action) {
      state.username = action.payload.data;
    },
    setUserId(state, action) {
      state.userId = action.payload.data;
    },
    setIsAdmim(state, action) {
      state.isAdmin = action.payload.data;
    },
  },
});

//export the actions, so we can modify the variables from other components
export const userActions = userSlice.actions;

//export the auth slice, we can tell redux about the changes we created here
export default userSlice.reducer;
