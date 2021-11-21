import { configureStore } from "@reduxjs/toolkit";
import peerReducer from "./peerSlice";
import userReducer from "./userSlice";
import backgroundReducer from "./backgroundSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    peers: peerReducer,
    background: backgroundReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
