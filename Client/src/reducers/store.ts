import { configureStore } from "@reduxjs/toolkit";
import peerReducer from "./peerSlice";

export const store = configureStore({
  reducer: {
    peers: peerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
