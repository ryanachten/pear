import { RootState } from "../reducers/store";

export const isServiceLoading = (state: RootState) => !state.peers.serviceReady;
export const getPeers = (state: RootState) => state.peers.peerIds;
