import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing";

const ThreeCanvas = () => {
  const audioTracksRef = useRef<Array<MediaStreamTrack>>([]);
  const [video, setVideo] = useState<HTMLVideoElement>();

  useEffect(() => {
    init();
  }, []);

  async function init() {
    await requestUserMedia();

    // const videoElement = videoRef.current;
    // const canvasElement = canvasRef.current;
    // if (!videoElement || !canvasElement) return;

    // // Set canvas as stream source and initiate peer connection
    // const maxFrameRate = 25;
    // const stream = canvasElement.captureStream(maxFrameRate);

    // // Assign microphone audio output to stream
    // audioTracksRef.current.forEach((track) => stream.addTrack(track));

    // signalContext.stream = stream;
    // signalContext.sendConnection();
  }

  async function requestUserMedia() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const tracks = stream.getAudioTracks();
    audioTracksRef.current = tracks;

    const video = document.createElement("video");
    video.srcObject = stream;
    video.muted = true;
    video.play();

    setVideo(video);
  }

  if (!video) return <span>loading canvas</span>;

  return (
    <Canvas>
      <EffectComposer>
        <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={2}
          height={480}
        />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0.5]}>
        <planeGeometry args={[3.2, 1.9]} />
        <meshBasicMaterial>
          <videoTexture
            attach="map"
            encoding={THREE.sRGBEncoding}
            args={[video]}
          />
        </meshBasicMaterial>
      </mesh>
    </Canvas>
  );
};

export default ThreeCanvas;
