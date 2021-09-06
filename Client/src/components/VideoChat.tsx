import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { SignalPeer } from "../models/SignalPeer";
import { getPeers } from "../selectors/peerSelectors";
import { SignalContext } from "../services/SignalService";

import "./VideoChat.css";

const VideoChat = () => {
  const videosEl = useRef<HTMLDivElement>(null);
  const selfVideoEl = useRef<HTMLVideoElement>(null);
  const signalService = useContext(SignalContext);
  const peerIds = useSelector(getPeers);
  const [peersVideos, setPeersVideos] = useState<Array<string>>([]);

  useEffect(() => {
    signalService.stream && setupSelfVideo(signalService.stream);
  }, [signalService.stream]);

  useEffect(() => {
    const peersNeedingVideos = signalService.peers.filter(
      (x) => !peersVideos.includes(x.id)
    );
    const peersNeedingRemoval = peersVideos.filter(
      (id) => !signalService.peers.find((x) => x.id === id)
    );

    peersNeedingVideos.forEach((peer) => {
      createVideo(peer);
      setPeersVideos([...peersVideos, peer.id]);
    });

    peersNeedingRemoval.forEach((peerId) => {
      videosEl.current?.querySelector(`#${peerId}`)?.remove();
      setPeersVideos(peersVideos.filter((x) => x !== peerId));
    });
  }, [signalService.peers, peerIds, peersVideos]);

  const createVideo = (peer: SignalPeer) => {
    const videoEl = document.createElement("video");
    videoEl.id = peer.id;
    if (peer.stream) {
      videoEl.className = "VideoChat__Element";
      videoEl.srcObject = peer.stream;
      videosEl.current?.append(videoEl);
      videoEl.play();
    }
  };

  const setupSelfVideo = (stream: MediaStream) => {
    if (selfVideoEl.current) {
      selfVideoEl.current.srcObject = stream;
      selfVideoEl.current.play();
    }
  };

  return (
    <div className="VideoChat__Grid" ref={videosEl}>
      <video ref={selfVideoEl} className="VideoChat__Element" />
    </div>
  );
};

export default VideoChat;
