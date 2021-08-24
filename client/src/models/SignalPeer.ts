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
  videoSelector: string;
  initiator?: boolean;
  stream?: MediaStream;
}

export class SignalPeer {
  public id: string;
  public instance: Instance;
  private config: SignalPeerConfig;
  private connection: HubConnection;

  constructor(config: SignalPeerConfig) {
    const { id, connection, initiator } = config;
    this.id = id;
    this.config = config;
    this.connection = connection;
    this.instance = new Peer({ initiator, trickle: false });

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
    const { videoSelector } = this.config;
    const video = document.querySelector<HTMLVideoElement>(videoSelector);
    if (video === null) {
      return console.error("No video element found");
    }

    if ("srcObject" in video) {
      console.log("assigned video to stream", stream);
      video.srcObject = stream;
    } else {
      // video.src = window.URL.createObjectURL(stream) // for older browsers
    }
    video.onloadedmetadata = function (e) {
      console.log("metadata loaded, playing video");

      video.play();
    };
  }
}
