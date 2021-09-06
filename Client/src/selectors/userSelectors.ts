import { RootState } from "../reducers/store";
import { serviceSignalInstance } from "../services/SignalService";

export const getUsername = (state: RootState) =>
  state.user.username || serviceSignalInstance.connection?.connectionId || "";
