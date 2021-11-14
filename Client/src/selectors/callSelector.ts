import { RootState } from "../reducers/store";

export const getBackgroundMode = (state: RootState) =>
  state.call.backgroundMode;
