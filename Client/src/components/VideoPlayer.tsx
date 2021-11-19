import { Video } from "grommet";
import React, { CSSProperties, Ref } from "react";
import styled from "styled-components";

interface IVideoPlayerProps {
  videoRef: Ref<HTMLVideoElement>;
  muteByDefault?: boolean;
  hidden?: boolean;
}

const FlippedVideo = styled(Video)`
  transform: scaleX(-1);
`;

export const VideoPlayer = ({
  muteByDefault,
  videoRef,
  hidden,
}: IVideoPlayerProps) => {
  const hiddenStyles: CSSProperties = {
    display: "none",
  };
  return (
    <FlippedVideo
      style={hidden ? hiddenStyles : {}}
      fit="cover"
      ref={videoRef}
      muted={muteByDefault}
      controls={false}
    />
  );
};
