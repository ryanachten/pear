import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PeerGroupMetadata, PeerDisplay } from "../constants/interfaces";

export interface PeerState {
  serviceReady: boolean;
  peers: Array<PeerDisplay>;
  group: PeerGroupMetadata | null;
}

const initialState: PeerState = {
  serviceReady: false,
  peers: [],
  group: null,
};

export const peerSlice = createSlice({
  name: "peer",
  initialState,
  reducers: {
    serviceIsReady: (state) => {
      state.serviceReady = true;
    },
    addGroup: (state, action: PayloadAction<PeerGroupMetadata>) => {
      state.group = action.payload;
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

export const { serviceIsReady, addPeer, addGroup, removePeer } =
  peerSlice.actions;

export default peerSlice.reducer;
