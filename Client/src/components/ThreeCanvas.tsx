import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  Bloom,
  Noise,
  Pixelation,
  Vignette,
  ColorDepth,
} from "@react-three/postprocessing";
import { useSelector } from "react-redux";
import { getEffect } from "../selectors/effectSelector";

const ThreeCanvas = () => {
  const audioTracksRef = useRef<Array<MediaStreamTrack>>([]);
  const [video, setVideo] = useState<HTMLVideoElement>();
  const currentNoise = useSelector(getEffect("noise"));
  const currentPixelation = useSelector(getEffect("pixelation"));
  const currentColorDepth = useSelector(getEffect("colorDepth"));
  const currentBloom = useSelector(getEffect("bloom"));

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

  // pixel
  // shockwave
  // color depth
  // glitch
  // scanline
  // outline
  // noise
  // bloom

  return (
    <Canvas>
      <EffectComposer>
        <Pixelation granularity={currentPixelation.granularity} />
        <Bloom
          intensity={currentBloom.intensity}
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
          height={300}
        />
        <Noise opacity={currentNoise.opacity} />
        <ColorDepth bits={currentColorDepth.bits} />
        {/* <Vignette eskil={false} offset={0.1} darkness={1.1} /> */}
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
