import { useEffect, useState } from "react";
import { SignalEvent, SignalRequest } from "../constants/interfaces";
import { useHubConnection } from "../hooks/useHubConnection";
import { SignalPeer } from "../models/SignalPeer";

const VideoChat = () => {
  const connection = useHubConnection();
  const [selfPeerId, setSelfPeerId] = useState("");
  const [isRegistered, setRegistered] = useState(false);
  const [peers, setPeers] = useState<Record<string, SignalPeer>>({});
  useEffect(() => {
    init();
  }, [connection, connection?.connectionId, isRegistered]);

  const init = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      // audio: true,
    });
    if (connection && connection.connectionId && !isRegistered) {
      // Set peer ID to signalR connection ID
      const peerId = connection.connectionId;
      console.log("peerId", peerId);
      setSelfPeerId(peerId);

      const selfPeer = new SignalPeer({
        id: peerId,
        initiator: true,
        stream,
        connection,
        videoSelector: "#video-self",
      });

      connection.send(SignalEvent.SendNewPeer, {
        sender: peerId,
        // TODO: include peer metadata such as user information in the data property
      } as SignalRequest);
      setPeers({ ...peers, [peerId]: selfPeer });

      connection.on(SignalEvent.ReceiveNewPeer, (peer: SignalRequest) => {
        console.log("new peer!", peer);
        if (peer.sender !== peerId) {
          const newPeer = new SignalPeer({
            id: peer.sender,
            connection,
            // stream,
            videoSelector: "#video-peer",
          });
          setPeers({ ...peers, [peer.sender]: newPeer });
        }
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
          console.log("peer disconnected!", peer);
          const updatedPeers = { ...peers };
          updatedPeers[peerId].instance.destroy();
          delete updatedPeers[peerId];
          setPeers({ ...updatedPeers });
        }
      );

      setRegistered(true);
    }
  };

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
    if (!connection) return;

    connection.send(SignalEvent.SendNewInitiator, {
      sender: selfPeerId,
    } as SignalRequest);

    const newSelfPeer = new SignalPeer({
      connection,
      id: selfPeerId,
      videoSelector: "video-self",
      initiator: true,
      stream,
    });

    setPeers({ ...peers, [selfPeerId]: newSelfPeer });
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
