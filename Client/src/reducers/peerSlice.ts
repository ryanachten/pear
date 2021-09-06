import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PeerState {
  serviceReady: boolean;
  peerIds: Array<string>;
}

const initialState: PeerState = {
  serviceReady: false,
  peerIds: [],
};

export const peerSlice = createSlice({
  name: "peer",
  initialState,
  reducers: {
    serviceIsReady: (state) => {
      state.serviceReady = true;
    },
    addPeer: (state, action: PayloadAction<string>) => {
      let peers = [...state.peerIds];
      const peerId = action.payload;
      const existingPeer = peers.find((x) => x === peerId);
      if (!existingPeer) {
        peers.push(peerId);
      }
      state.peerIds = peers;
    },
    removePeer: (state, action: PayloadAction<string>) => {
      const peers = state.peerIds.filter((x) => x !== action.payload);
      state.peerIds = peers;
    },
  },
});

export const { serviceIsReady, addPeer, removePeer } = peerSlice.actions;

export default peerSlice.reducer;
