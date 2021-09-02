import { useState, useEffect, useRef } from "react";

import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import { Message, SignalEvent } from "../constants/interfaces";
import { useHubConnection } from "../hooks/useHubConnection";

const Chat = () => {
  const connection = useHubConnection();
  const [chat, setChat] = useState<Array<Message>>([]);
  const latestChat = useRef(chat);

  // TODO: check if necessary
  latestChat.current = chat;

  useEffect(() => {
    if (connection) {
      connection.on(SignalEvent.ReceiveMessage, (message) => {
        const updatedChat = [...latestChat.current];
        updatedChat.push(message);

        setChat(updatedChat);
      });
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
        await connection.send(SignalEvent.SendMessage, chatMessage);
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
