import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { createContext } from "react";
import {
  PeerGroupRequest,
  NewUserRequest,
  SignalEvent,
  SignalRequest,
  SignalResponse,
} from "../constants/interfaces";
import { Routes } from "../constants/routes";
import { SignalPeer } from "../models/SignalPeer";
import { addGroup, removePeer, serviceIsReady } from "../reducers/peerSlice";
import { store } from "../reducers/store";

export class SignalService {
  public stream: MediaStream | undefined;
  public connection: HubConnection | undefined;
  public peers: Array<SignalPeer> = [];
  private loggingEnabled: boolean = false;

  constructor() {
    this.init();
  }

  public SendNewGroup(groupName: string) {
    if (this.connection) {
      this.connection.send(SignalEvent.SendNewGroup, {
        sender: this.connection.connectionId,
        data: {
          groupName,
        },
      } as PeerGroupRequest);
    }
  }

  public SendConnection() {
    if (this.connection) {
      this.connection.send(SignalEvent.SendConnected, {
        sender: this.connection.connectionId,
        data: {
          userName: store.getState().user.userName,
        },
      } as NewUserRequest);
    }
  }

  private async init() {
    await this.initSignalConnection();
    await this.getStream();
    this.registerEventListeners();

    store.dispatch(serviceIsReady());
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
      // Set peer ID to signalR connection ID
      const peerId = this.connection.connectionId;
      this.log("peerId", peerId);

      connection.on(
        SignalEvent.ReceivePeerGroup,
        (response: PeerGroupRequest) => store.dispatch(addGroup(response.data))
      );

      connection.on(SignalEvent.ReceiveNewPeer, (peer: NewUserRequest) => {
        const newPeer = new SignalPeer({
          id: peer.sender,
          connection,
          stream: this.stream,
          userMetadata: peer.data,
        });
        this.addPeer(newPeer);
        this.log("new peer", peer);

        connection.send(SignalEvent.SendNewInitiator, {
          sender: peerId,
          receiver: peer.sender,
          data: {
            userName: store.getState().user.userName,
          },
        } as NewUserRequest);
      });

      connection.on(SignalEvent.ReceiveNewInitiator, (peer: NewUserRequest) => {
        this.log("new initiator", peer);
        const newPeer = new SignalPeer({
          id: peer.sender,
          initiator: true,
          connection,
          stream: this.stream,
          userMetadata: peer.data,
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
    store.dispatch(removePeer(peer.id));
  };

  private getPeerById = (id: string) => this.peers.find((x) => x.id === id);

  private log = (...args: any[]) =>
    this.loggingEnabled && console.log(`SignalService:\n`, ...args);
}

export const serviceSignalInstance = new SignalService();
export const SignalContext = createContext<SignalService>(
  serviceSignalInstance
);
