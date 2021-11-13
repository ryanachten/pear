import { Box, Button, Text, Video } from "grommet";
import {
  Microphone as MicrophoneIcon,
  Video as VideoIcon,
} from "grommet-icons";
import React, { Ref, useContext, useState } from "react";
import styled from "styled-components";
import { SignalContext } from "../services/SignalService";

interface IVideoPlayerProps {
  subtitle: string;
  videoRef: Ref<HTMLVideoElement>;
  muteByDefault?: boolean;
  showControls?: boolean;
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
  showControls,
}: IVideoPlayerProps) => {
  const signalService = useContext(SignalContext);
  const [mutedAudio, setMuteAudio] = useState(true);
  const [mutedVideo, setMuteVideo] = useState(false);

  const muteAudio = (muted: boolean) => {
    signalService.enableAudioStream(!muted);
    setMuteAudio(muted);
  };
  const muteVideo = (muted: boolean) => {
    signalService.enableVideoStream(!muted);
    setMuteVideo(muted);
  };

  return (
    <VideoWrapper background="light-4">
      <MetaWrapper>
        {showControls && (
          <>
            <Button
              active
              icon={
                <MicrophoneIcon color={mutedAudio ? "status-error" : "brand"} />
              }
              onClick={() => muteAudio(!mutedAudio)}
            />
            <Button
              active
              margin={{ horizontal: "small" }}
              icon={<VideoIcon color={mutedVideo ? "status-error" : "brand"} />}
              onClick={() => muteVideo(!mutedVideo)}
            />
          </>
        )}
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
