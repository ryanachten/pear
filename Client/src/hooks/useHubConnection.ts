import { useState, useEffect } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { Routes } from "./routes";

export const useHubConnection = () => {
  const [connection, setConnection] = useState<HubConnection>();
  const [loading, setLoading] = useState(true);

  async function startConnection() {
    if (connection) {
      try {
        await connection.start();
        console.log("Connected!", connection.state);
        setConnection(connection);
        setLoading(false);
      } catch (error) {
        console.error("Connection failed: ", error);
      }
    }
  }

  useEffect(() => {
    const { origin } = window.location;
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${origin}${Routes.StreamHub}`)
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
