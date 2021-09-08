import { Text } from "grommet";
import { Ref } from "react";
import styled from "styled-components";

interface IVideoPlayerProps {
  subtitle: string;
  videoRef: Ref<HTMLVideoElement>;
}

const Video = styled.video`
  width: 100%;
  max-height: 100%;
`;

const Subtitle = styled(Text)`
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 2;
`;

const VideoWrapper = styled.div`
  position: relative;
`;

export const VideoPlayer = ({ subtitle, videoRef }: IVideoPlayerProps) => (
  <VideoWrapper>
    <Video ref={videoRef} />
    <Subtitle>{subtitle}</Subtitle>
  </VideoWrapper>
);
