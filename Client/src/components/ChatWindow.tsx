import React from "react";

import { Message } from "../constants/interfaces";
import MessageText from "./MessageText";

interface IChatWindowProps {
  chat: Array<Message>;
}

const ChatWindow = (props: IChatWindowProps) => {
  const chat = props.chat.map((m) => (
    <MessageText
      key={Date.now() * Math.random()}
      user={m.user}
      message={m.message}
    />
  ));

  return <div>{chat}</div>;
};

export default ChatWindow;
