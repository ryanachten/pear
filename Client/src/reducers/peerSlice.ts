import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PeerDisplay } from "../constants/interfaces";

export interface PeerState {
  serviceReady: boolean;
  peers: Array<PeerDisplay>;
}

const initialState: PeerState = {
  serviceReady: false,
  peers: [],
};

export const peerSlice = createSlice({
  name: "peer",
  initialState,
  reducers: {
    serviceIsReady: (state) => {
      state.serviceReady = true;
    },
    addPeer: (state, action: PayloadAction<PeerDisplay>) => {
      let peers = [...state.peers];
      const newPeer = action.payload;
      const existingPeer = peers.find(
        (x) => x.connectionId === newPeer.connectionId
      );
      if (!existingPeer) {
        peers.push(newPeer);
      }
      state.peers = peers;
    },
    removePeer: (state, action: PayloadAction<string>) => {
      const peers = state.peers.filter(
        (x) => x.connectionId !== action.payload
      );
      state.peers = peers;
    },
  },
});

export const { serviceIsReady, addPeer, removePeer } = peerSlice.actions;

export default peerSlice.reducer;
