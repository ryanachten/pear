import { Ref } from "react";

interface IVideoPlayerProps {
  subtitle: string;
  videoRef: Ref<HTMLVideoElement>;
}

export const VideoPlayer = ({ subtitle, videoRef }: IVideoPlayerProps) => (
  <div>
    <p>{subtitle}</p>
    <video ref={videoRef} className="VideoChat__Element" />
  </div>
);
