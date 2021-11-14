import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VideoBackgroundMode } from "../constants/interfaces";

export interface CallState {
  backgroundMode: VideoBackgroundMode;
}

const initialState: CallState = {
  backgroundMode: VideoBackgroundMode.None,
};

export const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    updateBackgroundMode: (
      state,
      action: PayloadAction<VideoBackgroundMode>
    ) => {
      state.backgroundMode = action.payload;
    },
  },
});

export const { updateBackgroundMode } = callSlice.actions;

export default callSlice.reducer;
