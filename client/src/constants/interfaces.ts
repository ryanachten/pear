import { SignalData } from "simple-peer";

export type Message = {
  user: string;
  message: string;
};

export enum SignalEvent {
  SendMessage = "SendMessage",
  SendConnected = "SendConnected",
  SendNewInitiator = "SendNewInitiator",
  SendSignal = "SendSignal",
  ReceiveMessage = "ReceiveMessage",
  ReceiveNewPeer = "ReceiveNewPeer",
  ReceiveNewInitiator = "ReceiveNewInitiator",
  ReceiveSignal = "ReceiveSignal",
  ReceivePeerDisconnected = "ReceivePeerDisconnected",
}

export interface SignalRequest {
  sender: string;
  receiver: string;
  data: object;
}

export interface SignalResponse {
  sender: string;
  receiver: string;
  data: SignalData;
}
