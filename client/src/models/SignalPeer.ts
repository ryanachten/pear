import { HubConnection } from "@microsoft/signalr";
import Peer, { Instance, SignalData } from "simple-peer";
import {
  SignalRequest,
  SignalEvent,
  SignalResponse,
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
  private config: SignalPeerConfig;
  private connection: HubConnection;

  constructor(config: SignalPeerConfig) {
    const { id, connection, initiator, stream } = config;
    this.id = id;
    this.config = config;
    this.connection = connection;
    this.instance = new Peer({
      initiator,
      stream,
    });

    this.registerEventListeners();
  }

  private registerEventListeners() {
    // When we receive a signal from signalR, we apply to peer
    this.connection.on(SignalEvent.ReceiveSignal, (signal: SignalResponse) => {
      const data = signal.data as SignalData;
      if (signal.sender !== this.id) {
        console.log(this.id, "received signal");

        this.instance.signal(data);
      }
    });

    // When peer receives a signal, transmit it via signalR
    this.instance.on("connect", () => console.log("Peer connected", this.id));

    // When peer receives a signal, transmit it via signalR
    this.instance.on("signal", (data) =>
      this.connection.send(SignalEvent.SendSignal, {
        sender: this.id,
        data,
      } as SignalRequest)
    );

    // When a peer receives a stream event, setup video playback
    this.instance.on("stream", (stream) => this.initVideoPlayback(stream));
  }

  private initVideoPlayback(stream: MediaStream) {
    const videos = document.querySelector(".videos");

    if (videos === null) {
      return console.error("No video element found");
    }

    const videoEl = document.createElement("video");
    const existingEl = document.getElementById(stream.id);
    if (existingEl) return;

    console.log("assigned video to stream", this.id, stream);

    videoEl.id = stream.id;
    videoEl.srcObject = stream;

    videos.append(videoEl);

    videoEl.play();
  }
}
