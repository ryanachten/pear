import { Button, Select } from "grommet";
import {
  Microphone as MicrophoneIcon,
  Video as VideoIcon,
} from "grommet-icons";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { VideoBackgroundMode } from "../constants/interfaces";
import { updateBackgroundMode } from "../reducers/callSlice";
import { getBackgroundMode } from "../selectors/callSelector";
import { SignalContext } from "../services/SignalService";

const VideoControls = () => {
  const dispatch = useDispatch();
  const signalService = useContext(SignalContext);
  const [mutedAudio, setMuteAudio] = useState(true);
  const [mutedVideo, setMuteVideo] = useState(false);
  const backgroundMode = useSelector(getBackgroundMode);

  const muteAudio = (muted: boolean) => {
    signalService.enableAudioStream(!muted);
    setMuteAudio(muted);
  };
  const muteVideo = (muted: boolean) => {
    signalService.enableVideoStream(!muted);
    setMuteVideo(muted);
  };

  return (
    <div>
      <Button
        active
        icon={<MicrophoneIcon color={mutedAudio ? "status-error" : "brand"} />}
        onClick={() => muteAudio(!mutedAudio)}
      />
      <Button
        active
        margin={{ horizontal: "small" }}
        icon={<VideoIcon color={mutedVideo ? "status-error" : "brand"} />}
        onClick={() => muteVideo(!mutedVideo)}
      />
      <Select
        options={Object.values(VideoBackgroundMode)}
        value={backgroundMode}
        onChange={({ option }) => dispatch(updateBackgroundMode(option))}
      />
    </div>
  );
};

export default VideoControls;
