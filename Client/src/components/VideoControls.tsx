import { Box, Button } from "grommet";
import {
  Microphone as MicrophoneIcon,
  Video as VideoIcon,
} from "grommet-icons";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateVideoMuted } from "../reducers/callSlice";
import { getVideoMuted } from "../selectors/callSelector";
import { SignalContext } from "../services/SignalService";
import BloomControls from "./EffectControls/BloomControls";
import ColorDepthControls from "./EffectControls/ColorDepthControls";
import NoiseControls from "./EffectControls/NoiseControls";
import PixelationControls from "./EffectControls/PixelationControls";

const VideoControls = () => {
  const dispatch = useDispatch();
  const signalService = useContext(SignalContext);
  const [mutedAudio, setMuteAudio] = useState(false);
  const mutedVideo = useSelector(getVideoMuted);

  const muteAudio = (muted: boolean) => {
    signalService.enableAudioStream(!muted);
    setMuteAudio(muted);
  };
  const muteVideo = (muted: boolean) => {
    dispatch(updateVideoMuted(muted));
  };

  return (
    <Box
      margin={{ top: "medium" }}
      pad={{ bottom: "medium" }}
      direction="row"
      justify="end"
      align="flex-start"
    >
      <NoiseControls />
      <PixelationControls />
      <ColorDepthControls />
      <BloomControls />

      <Box direction="row" align="center">
        <Button
          active
          margin={{ horizontal: "small" }}
          icon={<MicrophoneIcon color={mutedAudio ? "status-error" : "text"} />}
          onClick={() => muteAudio(!mutedAudio)}
        />
        <Button
          active
          icon={<VideoIcon color={mutedVideo ? "status-error" : "text"} />}
          onClick={() => muteVideo(!mutedVideo)}
        />
      </Box>
    </Box>
  );
};

export default VideoControls;
