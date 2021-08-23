import { useState, useEffect } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

export const useHubConnection = () => {
  const [connection, setConnection] = useState<HubConnection>();
  const [loading, setLoading] = useState(true);

  async function startConnection() {
    if (connection) {
      try {
        await connection.start();
        console.log("Connected!");
      } catch (error) {
        console.error("Connection failed: ", error);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:5001/hubs/chat")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    startConnection();
  }, [connection]);

  if (!loading) {
    return connection;
  }
};
