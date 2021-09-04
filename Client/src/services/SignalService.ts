import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { createContext } from "react";
import {
  SignalEvent,
  SignalRequest,
  SignalResponse,
  SignalServiceEvent,
} from "../constants/interfaces";
import { Routes } from "../constants/routes";
import { SignalPeer } from "../models/SignalPeer";

export interface SignalServiceConfig {
  onCompleteSetup: () => void;
}

export class SignalService {
  public stream: MediaStream | undefined;
  public connection: HubConnection | undefined;
  public peers: Array<SignalPeer> = [];
  public initialising: boolean = true;
  private config: SignalServiceConfig;

  constructor(config: SignalServiceConfig) {
    this.init();
    this.config = config;
  }

  private async init() {
    await this.initSignalConnection();
    await this.getStream();
    this.registerEventListeners();

    this.initialising = false;
    this.config.onCompleteSetup();
  }

  private async initSignalConnection() {
    const connection = new HubConnectionBuilder()
      .withUrl(`${origin}${Routes.StreamHub}`)
      .withAutomaticReconnect()
      .build();

    await connection.start();

    this.connection = connection;
  }

  private async getStream() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      // audio: true,
    });
    this.stream = stream;
  }

  private registerEventListeners() {
    if (this.connection && this.connection.connectionId) {
      const connection = this.connection as HubConnection;
      // // Set peer ID to signalR connection ID
      const peerId = this.connection.connectionId;
      console.log("peerId", peerId);

      connection.send(SignalEvent.SendConnected, {
        sender: peerId,
      });

      connection.on(SignalEvent.ReceiveNewPeer, (peer: SignalRequest) => {
        const newPeer = new SignalPeer({
          id: peer.sender,
          connection,
          stream: this.stream,
        });
        this.addPeer(newPeer);
        console.log("new peer!", peer, "total peers", this.peers);

        connection.send(SignalEvent.SendNewInitiator, {
          sender: peerId,
          receiver: peer.sender,
        } as SignalRequest);
      });

      connection.on(SignalEvent.ReceiveNewInitiator, (peer: SignalRequest) => {
        console.log("new initiator!", peer);
        const newPeer = new SignalPeer({
          id: peer.sender,
          initiator: true,
          connection,
          stream: this.stream,
        });
        this.addPeer(newPeer);
      });

      // When we receive a signal from signalR, we apply to peer
      connection.on(SignalEvent.ReceiveSignal, (signal: SignalResponse) =>
        this.getPeerById(signal.sender)?.instance.signal(signal.data)
      );

      connection.on(
        SignalEvent.ReceivePeerDisconnected,
        (request: SignalRequest) => {
          const peer = this.getPeerById(request.sender);
          if (peer) {
            this.destroyPeer(peer);
            const event = new CustomEvent(SignalServiceEvent.OnPeerDestroy, {
              detail: peer,
            });
            document.dispatchEvent(event);
          }
        }
      );
    }
  }

  private addPeer = (peer: SignalPeer) => {
    let peers = [...this.peers];
    const existingPeer = peers.find((x) => x.id === peer.id);
    if (existingPeer) {
      peers = peers.filter((x) => x.id !== peer.id);
    }
    this.peers = [...peers, peer];
  };

  private destroyPeer = (peer: SignalPeer) => {
    peer.instance.destroy();
    this.peers = [...this.peers].filter((x) => x.id !== peer.id);
  };

  private getPeerById = (id: string) => this.peers.find((x) => x.id === id);
}

export const SignalContext = createContext<SignalService | null>(null);
