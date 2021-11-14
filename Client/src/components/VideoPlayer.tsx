import { Box, Text, Video } from "grommet";
import React, { Ref } from "react";
import styled from "styled-components";

interface IVideoPlayerProps {
  subtitle: string;
  videoRef: Ref<HTMLVideoElement>;
  muteByDefault?: boolean;
}

const VideoWrapper = styled(Box)`
  position: relative;
  max-height: calc(100vh - 60px);
`;

const MetaWrapper = styled.div`
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 2;
`;

export const VideoPlayer = ({
  muteByDefault,
  subtitle,
  videoRef,
}: IVideoPlayerProps) => {
  return (
    <VideoWrapper background="light-4">
      <MetaWrapper>
        <Text>{subtitle}</Text>
      </MetaWrapper>
      <Video
        fit="cover"
        ref={videoRef}
        muted={muteByDefault}
        controls={false}
      />
    </VideoWrapper>
  );
};
