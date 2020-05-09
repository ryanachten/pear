import { Injectable } from "@angular/core";
import {
  HubConnection,
  HubConnectionBuilder,
  Subject,
} from "@microsoft/signalr";
import { environment } from "src/environments/environment";
import { User, Signal } from "../models";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StreamService {
  private connection: HubConnection;

  public newPeer = new Subject<User>();
  // Replacement for public newPeer$ = this.newPeer.asObservable(); no idea if this will work
  public newPeer$ = new Observable(() => this.newPeer.subscribe);
  public helloAnswer = new Subject<User>();
  public disconnectedPeer = new Subject<User>();
  private signal = new Subject<Signal>();

  constructor() {}

  public async startConnection(currentUser: string): Promise<void> {
    try {
      // Start SignalR connection
      this.connection = new HubConnectionBuilder()
        .withUrl(`${environment.apiUrl}/stream`)
        .build();
      await this.connection.start();

      // Define event handers
      this.connection.on("NewUserArrived", (data) => {
        this.newPeer.next(JSON.parse(data));
      });
      this.connection.on("UserSaidHello", (data) => {
        this.helloAnswer.next(JSON.parse(data));
      });
      this.connection.on("UserDisconnect", (data) => {
        this.disconnectedPeer.next(JSON.parse(data));
      });
      this.connection.on("UserDisconnect", (data) => {
        this.disconnectedPeer.next(JSON.parse(data));
      });
      this.connection.on("SendSignal", (user, signal) => {
        this.signal.next({ user, signal });
      });

      // Invoke new user event
      this.connection.invoke("NewUser", currentUser);
    } catch (error) {
      console.error("Error initialising stream client", error);
    }
  }

  public sendSignalToUser(signal: string, user: string) {
    this.connection.invoke("SendSignal", signal, user);
  }

  public sayHello(user: string, recipient: string) {
    this.connection.invoke("HelloUser", user, recipient);
  }
}
