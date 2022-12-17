import React, { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import styled, { CSSProperties } from "styled-components";

import { getPeers } from "../selectors/peerSelectors";
import { getUserName } from "../selectors/userSelectors";
import { SignalContext } from "../services/SignalService";
import BodyPixCanvas from "./BodyPixCanvas";
import ThreeCanvas from "./ThreeCanvas";
import { VideoPlayer } from "./VideoPlayer";
import VideoWrapper from "./VideoWrapper";

const VideoGrid = styled.div`
  display: grid;
  grid-gap: 15px;
  grid-template-columns: repeat(auto-fit, minmax(25%, 1fr));
`;

const singleVideoStyles: CSSProperties = {
  alignItems: "center",
  display: "flex",
  height: "80vh",
  justifyContent: "center",
};

const VideoChat = () => {
  const signalService = useContext(SignalContext);
  const peers = useSelector(getPeers);
  const userName = useSelector(getUserName);

  const PeerVideos = useMemo(() => {
    const videos = signalService.peers.map((x) => {
      return (
        <VideoWrapper key={x.id} subtitle={x.userMetadata.userName || x.id}>
          <VideoPlayer
            key={x.id}
            videoRef={(ref) => {
              // Only configure stream if src hasn't alread been set
              if (ref && !ref.srcObject && x.stream) {
                ref.srcObject = x.stream;
                ref.play();
              }
            }}
          />
        </VideoWrapper>
      );
    });
    return videos;
  }, [peers]);

  const hasPeers = Boolean(peers.length);

  return (
    <VideoGrid style={!hasPeers ? singleVideoStyles : {}}>
      <VideoWrapper subtitle={userName}>
        {/* <BodyPixCanvas /> */}
        <ThreeCanvas />
      </VideoWrapper>
      {PeerVideos}
    </VideoGrid>
  );
};

export default VideoChat;
