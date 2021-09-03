import React from "react";

interface IMessageTextProps {
  user: string;
  message: string;
}

const MessageText = ({ user, message }: IMessageTextProps) => (
  <div>
    <p>
      <strong>{user}</strong> says:
    </p>
    <p>{message}</p>
  </div>
);

export default MessageText;
