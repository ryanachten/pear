import { RootState } from "../reducers/store";

export const getBackgroundMode = ({ call }: RootState) => call.backgroundMode;

export const getBackgroundBlurAmount = ({ call }: RootState) =>
  call.backgroundBlurAmount;

export const getEdgeBlurAmount = ({ call }: RootState) => call.edgeBlurAmount;

export const getMaskOpacity = ({ call }: RootState) => call.maskOpacity;

export const getMaskBlurAmount = ({ call }: RootState) => call.maskBlurAmount;
