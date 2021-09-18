import { Button, Text } from "grommet";
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

const Video = styled.video`
  width: 100%;
  max-height: 100%;
`;

const VideoWrapper = styled.div`
  position: relative;
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
  const [mutedAudio, setMuteAudio] = useState(false);
  const [mutedVideo, setMuteVideo] = useState(false);

  const muteAudio = (muted: boolean) => {
    var tracks = signalService.stream?.getAudioTracks();
    tracks?.forEach((track) => {
      track.enabled = !muted;
    });

    setMuteAudio(muted);
  };
  const muteVideo = (muted: boolean) => {
    var tracks = signalService.stream?.getVideoTracks();
    tracks?.forEach((track) => {
      track.enabled = !muted;
    });
    setMuteVideo(muted);
  };

  return (
    <VideoWrapper>
      <MetaWrapper>
        <Text>{subtitle}</Text>
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
              icon={<VideoIcon color={mutedVideo ? "status-error" : "brand"} />}
              onClick={() => muteVideo(!mutedVideo)}
            />
          </>
        )}
      </MetaWrapper>
      <Video ref={videoRef} muted={muteByDefault} />
    </VideoWrapper>
  );
};
