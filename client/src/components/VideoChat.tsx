import { useEffect, useRef, useState } from "react";
import { SignalEvent, SignalRequest } from "../constants/interfaces";
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
  const [selfPeerId, setSelfPeerId] = useState("");
  const [isRegistered, setRegistered] = useState(false);
  // const [peers, setPeers] = useState<Record<string, SignalPeer>>({});

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

      // Set peer ID to signalR connection ID
      const peerId = connection.connectionId;
      console.log("peerId", peerId);
      setSelfPeerId(peerId);

      const selfPeer = new SignalPeer({
        id: peerId,
        initiator: true,
        stream,
        connection,
      });

      connection.send(SignalEvent.SendNewPeer, {
        sender: peerId,
        // TODO: include peer metadata such as user information in the data property
      } as SignalRequest);
      setPeers({ ...peers, [peerId]: selfPeer });

      connection.on(SignalEvent.ReceiveNewPeer, (peer: SignalRequest) => {
        const newPeer = new SignalPeer({
          id: peer.sender,
          connection,
          // stream,
        });
        setPeers({ ...peers, [peer.sender]: newPeer });
        console.log("new peer!", peer, "total peers", peers);
      });

      // connection.on(SignalEvent.ReceiveNewInitiator, (peer: SignalRequest) => {
      //   console.log("new initiator!", peer);
      //   if (peer.sender !== peerId) {
      //     const newPeer = new SignalPeer({
      //       id: peer.sender,
      //       connection,
      //       stream,
      //       videoSelector: "#video-peer",
      //     });
      //     setPeers({ ...peers, [peer.sender]: newPeer });
      //   }
      // });

      connection.on(
        SignalEvent.ReceivePeerDisconnected,
        (peer: SignalRequest) => {
          const updatedPeers = { ...peers };
          updatedPeers[peer.sender].instance.destroy();
          // videosEl.current?.querySelector(`#${peerId}`)?.remove();
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

  // const requestVideoShare = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       // audio: true,
  //     });
  //     shareVideoSignal(stream);
  //   } catch (error) {
  //     console.log("Error getting media", error);
  //   }
  // };

  // const shareVideoSignal = (stream: MediaStream) => {
  //   if (!connection) return;

  //   connection.send(SignalEvent.SendNewInitiator, {
  //     sender: selfPeerId,
  //   } as SignalRequest);

  //   const newSelfPeer = new SignalPeer({
  //     connection,
  //     id: selfPeerId,
  //     videoSelector: "video-self",
  //     initiator: true,
  //     stream,
  //   });

  //   setPeers({ ...peers, [selfPeerId]: newSelfPeer });
  // };

  return (
    <div ref={videosEl} className="videos">
      <video ref={selfVideoEl} id="video-self" />
    </div>
  );
};

export default VideoChat;
