import { configureStore } from "@reduxjs/toolkit";
import peerReducer from "./peerSlice";
import userReducer from "./userSlice";
import callReducer from "./callSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    peers: peerReducer,
    call: callReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
