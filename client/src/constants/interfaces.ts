export type Message = {
  user: string;
  message: string;
};

export enum SignalEvent {
  SendMessage = "SendMessage",
  SendNewPeer = "SendNewPeer",
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
  data: object;
}

export interface SignalResponse {
  sender: string;
  data: {
    type: string;
  };
}
