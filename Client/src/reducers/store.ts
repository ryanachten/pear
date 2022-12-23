import { configureStore } from "@reduxjs/toolkit";
import peerReducer from "./peerSlice";
import userReducer from "./userSlice";
import backgroundReducer from "./backgroundSlice";
import callReducer from "./callSlice";
import effectReducer from "./effectSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    peers: peerReducer,
    background: backgroundReducer,
    call: callReducer,
    effect: effectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
