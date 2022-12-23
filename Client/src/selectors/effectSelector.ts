import { RootState } from "../reducers/store";
import { EffectState } from "../reducers/effectSlice";

export const getEffect =
  <Key extends keyof EffectState>(key: Key) =>
  ({ effect }: RootState) =>
    effect[key];
