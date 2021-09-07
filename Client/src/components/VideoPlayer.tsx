import { Text } from "grommet";
import { Ref } from "react";

import "./VideoPlayer.css";

interface IVideoPlayerProps {
  subtitle: string;
  videoRef: Ref<HTMLVideoElement>;
}

export const VideoPlayer = ({ subtitle, videoRef }: IVideoPlayerProps) => (
  <div className="VideoPlayer">
    <video ref={videoRef} className="VideoPlayer__video" />
    <Text className="VideoPlayer__text">{subtitle}</Text>
  </div>
);
