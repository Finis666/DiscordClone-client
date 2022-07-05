import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth.redux";
import userReducer from "./user.redux";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

export default store;
