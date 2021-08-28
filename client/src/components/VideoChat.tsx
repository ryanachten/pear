import { useEffect, useRef, useState } from "react";
import {
  SignalEvent,
  SignalRequest,
  SignalResponse,
} from "../constants/interfaces";
import { useHubConnection } from "../hooks/useHubConnection";
import { SignalPeer } from "../models/SignalPeer";

let peers: Record<string, SignalPeer> = {};
const setPeers = (newPeers: Record<string, SignalPeer>) => {
  peers = newPeers;
};

const VideoChat = () => {
  const connection = useHubConnection();
  const videosEl = useRef<HTMLDivElement>(null);
  const selfVideoEl = useRef<HTMLVideoElement>(null);
  const [isRegistered, setRegistered] = useState(false);

  useEffect(() => {
    init();
  }, [connection, connection?.connectionId, isRegistered]);

  const init = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      // audio: true,
    });
    if (connection && connection.connectionId && !isRegistered) {
      setupSelfVideo(stream);

      // // Set peer ID to signalR connection ID
      const peerId = connection.connectionId;
      console.log("peerId", peerId);

      connection.send(SignalEvent.SendConnected, {
        sender: peerId,
      });

      connection.on(SignalEvent.ReceiveNewPeer, (peer: SignalRequest) => {
        const newPeer = new SignalPeer({
          id: peer.sender,
          connection,
          stream,
        });
        setPeers({ ...peers, [peer.sender]: newPeer });
        console.log("new peer!", peer, "total peers", peers);

        connection.send(SignalEvent.SendNewInitiator, {
          sender: peerId,
          receiver: peer.sender,
        } as SignalRequest);
      });

      connection.on(SignalEvent.ReceiveNewInitiator, (peer: SignalRequest) => {
        console.log("new initiator!", peer);
        const newPeer = new SignalPeer({
          id: peer.sender,
          initiator: true,
          connection,
          stream,
        });
        setPeers({ ...peers, [peer.sender]: newPeer });
      });

      // When we receive a signal from signalR, we apply to peer
      connection.on(SignalEvent.ReceiveSignal, (signal: SignalResponse) =>
        peers[signal.sender].instance.signal(signal.data)
      );

      connection.on(
        SignalEvent.ReceivePeerDisconnected,
        (peer: SignalRequest) => {
          const updatedPeers = { ...peers };
          updatedPeers[peer.sender].instance.destroy();
          videosEl.current?.querySelector(`#${peer.sender}`)?.remove();
          delete updatedPeers[peer.sender];
          setPeers({ ...updatedPeers });
          console.log("peer disconnected!", peer, "total peers", peers);
        }
      );

      setRegistered(true);
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
