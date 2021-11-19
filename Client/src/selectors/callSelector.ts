import { RootState } from "../reducers/store";

export const getBackgroundMode = ({ call }: RootState) => call.backgroundMode;
