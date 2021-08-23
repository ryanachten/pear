import { useEffect } from "react";
import Peer from "simple-peer";
import { SignalEvent } from "../constants/interfaces";
import { useHubConnection } from "../hooks/useHubConnection";

const VideoChat = () => {
  const connection = useHubConnection();
  useEffect(() => {
    if (connection) {
      console.log("connection set", connection);

      connection.on(SignalEvent.ReceiveStream, (stream) => {
        console.log("stream received", stream);
      });
      connection.on(SignalEvent.ReceiveSignal, (signal) => {
        console.log("signal received", signal);
        const peer = new Peer();
        peer.signal(signal);
        peer.on("connect", () => {
          console.log("peer connected!");
        });

        peer.on("data", (data) => {
          console.log("data", data);
        });
        peer.on("stream", (stream) => {
          console.log("received stream!", stream);
          // got remote video stream, now let's show it in a video tag
          const video = document.querySelector<HTMLVideoElement>("#video-peer");
          if (video === null) {
            return console.error("No video element found");
          }

          if ("srcObject" in video) {
            console.log("assigned video to stream", stream);
            video.srcObject = stream;
          } else {
            // video.src = window.URL.createObjectURL(stream) // for older browsers
          }
          video.onloadedmetadata = function (e) {
            console.log("metadata loaded, playing video");

            video.play();
          };
        });
      });
    }
  }, [connection]);

  const requestVideoShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        // audio: true,
      });
      shareVideoSignal(stream);
    } catch (error) {
      console.log("Error getting media", error);
    }
  };

  const shareVideoSignal = (stream: MediaStream) => {
    const peer = new Peer({ initiator: true, stream: stream });

    peer.on("signal", (data) => {
      // console.log("signal", data);
      connection?.send(SignalEvent.SendSignal, data);
    });

    peer.on("stream", (stream) => {
      // console.log("stream", stream);
      connection?.send(SignalEvent.SendStream, stream);
    });

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
  };

  return (
    <div>
      <video id="video-self" />
      <video id="video-peer" autoPlay />
      <button onClick={requestVideoShare}>Turn on video</button>
    </div>
  );
};

export default VideoChat;
