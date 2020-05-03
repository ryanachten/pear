import { Injectable } from "@angular/core";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

@Injectable({
  providedIn: "root",
})
export class SignalService {
  connection: HubConnection;

  constructor() {
    this.initSignal();
  }

  async initSignal() {
    try {
      this.connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5000/stream")
        .build();
      await this.connection.start();
      this.connection.on("messageReceived", this.onMessageReceived);
    } catch (error) {
      console.error("Error initialising SignalR client", error);
    }
  }

  onMessageReceived(message: string) {
    console.log("onMessageReceived", message);
  }

  sendMessage() {
    this.connection.send("newMessage", "Testing sending message");
  }
}
