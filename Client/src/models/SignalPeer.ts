import { HubConnection } from "@microsoft/signalr";
import Peer, { Instance } from "simple-peer";
import {
  SignalRequest,
  SignalEvent,
  SignalServiceEvent,
} from "../constants/interfaces";

export interface SignalPeerConfig {
  id: string;
  connection: HubConnection;
  initiator?: boolean;
  stream?: MediaStream;
}

export class SignalPeer {
  public id: string;
  public instance: Instance;
  private connection: HubConnection;
  public stream: MediaStream | undefined = undefined;

  constructor(config: SignalPeerConfig) {
    const { id, connection, initiator, stream } = config;
    this.id = id;
    this.connection = connection;
    this.instance = new Peer({
      initiator,
      stream,
    });

    this.registerEventListeners();
  }

  private registerEventListeners() {
    // When peer receives a signal, transmit it via signalR
    this.instance.on("connect", () => console.log("Peer connected", this.id));

    // When peer receives a signal, transmit it via signalR
    this.instance.on("signal", (data) =>
      this.connection.send(SignalEvent.SendSignal, {
        receiver: this.id,
        data,
      } as SignalRequest)
    );

    // When a peer receives a stream event, setup video playback
    this.instance.on("stream", (stream) => {
      this.stream = stream;
      const event = new CustomEvent(SignalServiceEvent.OnPeerStream, {
        detail: this,
      });
      document.dispatchEvent(event);
    });
  }
}
