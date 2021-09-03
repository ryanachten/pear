import { useState, useEffect } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

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
    const { REACT_APP_PROTOCOL, REACT_APP_ORIGIN, REACT_APP_PORT } =
      process.env;
    // TODO: pass port from server
    const newConnection = new HubConnectionBuilder()
      .withUrl(
        `${REACT_APP_PROTOCOL}://${REACT_APP_ORIGIN}:${REACT_APP_PORT}/hubs/chat`
      )
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
