import { VideoBackgroundMode } from "../constants/interfaces";
import { RootState } from "../reducers/store";

export const getBackgroundMode = ({ call }: RootState) => call.backgroundMode;

export const showVideoCanvas = ({ call }: RootState) => {
  return call.backgroundMode !== VideoBackgroundMode.None;
};
