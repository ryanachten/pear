import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Chat from "./components/Chat";
import VideoChat from "./components/VideoChat";

function App() {
  return (
    <div className="App">
      <Chat />
      <VideoChat />
    </div>
  );
}

export default App;
