import React, { useEffect } from "react";
import Peer from "simple-peer";

const VideoChat = () => {
  const requestVideoShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        // audio: true,
      });
      setupVideoSignal(stream);
    } catch (error) {
      console.log("Error getting media", error);
    }
  };

  const setupVideoSignal = (stream: MediaStream) => {
    const peer1 = new Peer({ initiator: true, stream: stream });
    const peer2 = new Peer();

    peer1.on("signal", (data) => {
      console.log("data", data);
      peer2.signal(data);
    });

    peer2.on("signal", (data) => {
      console.log("data", data);
      peer1.signal(data);
    });

    peer2.on("stream", (stream) => {
      console.log("stream", stream);

      // got remote video stream, now let's show it in a video tag
      const video = document.querySelector<HTMLVideoElement>("#video-self");
      if (video == null) {
        return console.error("No video element found");
      }

      if ("srcObject" in video) {
        video.srcObject = stream;
      } else {
        // video.src = window.URL.createObjectURL(stream) // for older browsers
      }
      video.play();
    });
  };

  return (
    <div>
      <video id="video-self" />
      <video id="video-peer" />
      <button onClick={requestVideoShare}>Turn on video</button>
    </div>
  );
};

export default VideoChat;
