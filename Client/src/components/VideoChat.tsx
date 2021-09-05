import { Grid } from "grommet";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SignalServiceEvent } from "../constants/interfaces";
import { SignalPeer } from "../models/SignalPeer";
import { SignalContext } from "../services/SignalService";

import "./VideoChat.css";

const VideoChat = () => {
  const videosEl = useRef<HTMLDivElement>(null);
  const selfVideoEl = useRef<HTMLVideoElement>(null);
  const signalService = useContext(SignalContext);
  const [peers, setPeers] = useState<Array<SignalPeer>>([]);

  useEffect(() => {
    signalService.stream && setupSelfVideo(signalService.stream);
  }, [signalService.stream, signalService.connection]);

  useEffect(() => {
    const addPeer = (e: CustomEventInit<SignalPeer>) => {
      const peer = e.detail;
      if (peer) {
        createVideo(peer);
        setPeers([...peers, peer]);
      }
    };
    document.addEventListener(SignalServiceEvent.OnPeerStream, addPeer);

    const removePeer = (e: CustomEventInit<SignalPeer>) => {
      const peer = e.detail;
      if (peer) {
        videosEl.current?.querySelector(`#${peer.id}`)?.remove();
        const newPeers = [...peers].filter((x) => x.id !== peer.id);
        setPeers(newPeers);
      }
    };
    document.addEventListener(SignalServiceEvent.OnPeerDestroy, removePeer);

    return () => {
      document.removeEventListener(SignalServiceEvent.OnPeerStream, addPeer);
      document.removeEventListener(
        SignalServiceEvent.OnPeerDestroy,
        removePeer
      );
    };
  }, [peers]);

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
