import React from "react";
import "./App.css";
import Chat from "./components/Chat";
import VideoChat from "./components/VideoChat";

function App() {
  console.log("env", process.env);

  return (
    <div className="App">
      {/* <Chat /> */}
      <VideoChat />
    </div>
  );
}

export default App;
