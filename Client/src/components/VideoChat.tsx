import React, { useContext, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { getPeers } from "../selectors/peerSelectors";
import { getUsername } from "../selectors/userSelectors";
import { SignalContext } from "../services/SignalService";

import "./VideoChat.css";
import { VideoPlayer } from "./VideoPlayer";
import VideoCanvas from "./VideoCanvas";

const VideoChat = () => {
  const videosEl = useRef<HTMLDivElement>(null);
  const selfVideoEl = useRef<HTMLVideoElement>(null);
  const signalService = useContext(SignalContext);
  const peers = useSelector(getPeers);
  const username = useSelector(getUsername);

  useEffect(() => {
    signalService.SendConnection();
  }, [signalService]);

  useEffect(() => {
    signalService.stream && setupSelfVideo(signalService.stream);
  }, [signalService.stream]);

  const PeerVideos = useMemo(() => {
    const videos = signalService.peers.map((x) => {
      return (
        <VideoPlayer
          key={x.id}
          subtitle={x.userMetadata.username || x.id}
          videoRef={(ref) => {
            // Only configure stream if src hasn't alread been set
            if (ref && !ref.srcObject && x.stream) {
              ref.srcObject = x.stream;
              ref.play();
            }
          }}
        />
      );
    });
    return videos;
  }, [peers]);

  const setupSelfVideo = (stream: MediaStream) => {
    if (selfVideoEl.current) {
      selfVideoEl.current.srcObject = stream;
      // selfVideoEl.current.play();
    }
  };

  return (
    <div className="VideoChat__Grid" ref={videosEl}>
      <div className="VideoChat__Element">
        <VideoCanvas videoRef={selfVideoEl} />
        <VideoPlayer subtitle={username} videoRef={selfVideoEl} />
      </div>
      {PeerVideos}
    </div>
  );
};

export default VideoChat;
