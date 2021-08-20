import React, { useState, useEffect, useRef } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import { Message } from "../constants/interfaces";

const Chat = () => {
  const [connection, setConnection] = useState<HubConnection>();
  const [chat, setChat] = useState<Array<Message>>([]);
  const latestChat = useRef(chat);

  // TODO: check if necessary
  latestChat.current = chat;

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:5001/hubs/chat")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          console.log("Connected!");

          connection.on("ReceiveMessage", (message) => {
            const updatedChat = [...latestChat.current];
            updatedChat.push(message);

            setChat(updatedChat);
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection]);

  const sendMessage = async (user: string, message: string) => {
    const chatMessage = {
      user: user,
      message: message,
    };

    // if (connection.connectionStarted) {
    if (connection?.state === "Connected") {
      try {
        await connection.send("SendMessage", chatMessage);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("No connection to server yet.");
    }
  };

  return (
    <div>
      <ChatInput sendMessage={sendMessage} />
      <hr />
      <ChatWindow chat={chat} />
    </div>
  );
};

export default Chat;
