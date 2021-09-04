import { useContext, useEffect, useRef, useState } from "react";
import { SignalServiceEvent } from "../constants/interfaces";
import { SignalPeer } from "../models/SignalPeer";
import { SignalContext } from "../services/SignalService";

const VideoChat = () => {
  const videosEl = useRef<HTMLDivElement>(null);
  const selfVideoEl = useRef<HTMLVideoElement>(null);
  const signalService = useContext(SignalContext);
  const [peers, setPeers] = useState<Array<SignalPeer>>([]);

  useEffect(() => {
    signalService.stream && setupSelfVideo(signalService.stream);
  }, [signalService.connection]);

  useEffect(() => {
    document.addEventListener(
      SignalServiceEvent.OnPeerStream,
      (e: CustomEventInit<SignalPeer>) => {
        const peer = e.detail;
        if (peer) {
          createVideo(peer);
          setPeers([...peers, peer]);
        }
      }
    );

    document.addEventListener(
      SignalServiceEvent.OnPeerDestroy,
      (e: CustomEventInit<SignalPeer>) => {
        const peer = e.detail;
        if (peer) {
          videosEl.current?.querySelector(`#${peer.id}`)?.remove();
          const newPeers = [...peers].filter((x) => x.id !== peer.id);
          setPeers(newPeers);
        }
      }
    );
  }, []);

  const createVideo = (peer: SignalPeer) => {
    const videoEl = document.createElement("video");
    videoEl.id = peer.id;
    if (peer.stream) {
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
    <div ref={videosEl} className="videos">
      <video ref={selfVideoEl} id="video-self" />
    </div>
  );
};

export default VideoChat;
