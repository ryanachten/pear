export type Message = {
  user: string;
  message: string;
};

export enum SignalEvent {
  SendMessage = "SendMessage",
  SendStream = "SendStream",
  SendSignal = "SendSignal",
  ReceiveMessage = "ReceiveMessage",
  ReceiveStream = "ReceiveStream",
  ReceiveSignal = "ReceiveSignal",
}
