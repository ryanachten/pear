import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Effect = {
  isActive: boolean;
};

export interface EffectState {
  noise: Effect & {
    opacity: number;
  };
  pixelation: Effect & {
    granularity: number;
  };
  colorDepth: Effect & {
    bits: number;
  };
  bloom: Effect & {
    intensity: number;
  };
}

export const initialEffectState: EffectState = {
  noise: {
    isActive: false,
    opacity: 0,
  },
  pixelation: {
    isActive: false,
    granularity: 0,
  },
  colorDepth: {
    isActive: false,
    bits: 32,
  },
  bloom: {
    isActive: false,
    intensity: 0,
  },
};

export const effectSlice = createSlice({
  name: "effects",
  initialState: initialEffectState,
  reducers: {
    updateEffect: <Key extends keyof EffectState>(
      state: EffectState,
      action: PayloadAction<{ key: Key; value: EffectState[Key] }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const { updateEffect } = effectSlice.actions;

export default effectSlice.reducer;
