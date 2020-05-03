import { Injectable } from "@angular/core";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class StreamService {
  connection: HubConnection;

  constructor() {
    this.initStream();
  }

  async initStream() {
    try {
      this.connection = new HubConnectionBuilder()
        .withUrl(`${environment.apiUrl}/stream`)
        .build();
      await this.connection.start();
      this.connection.on("messageReceived", this.onMessageReceived);
    } catch (error) {
      console.error("Error initialising stream client", error);
    }
  }

  onMessageReceived(message: string) {
    console.log("onMessageReceived", message);
  }

  sendMessage() {
    this.connection.send("newMessage", "Testing sending message");
  }
}
