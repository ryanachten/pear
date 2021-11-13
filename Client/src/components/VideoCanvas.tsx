import { RefObject, useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs-backend-webgl";
import {
  BodyPix,
  drawBokehEffect,
  drawMask,
  load,
  SemanticPersonSegmentation,
  toMask,
} from "@tensorflow-models/body-pix";

export enum BackgroundMode {
  Blur,
  Mask,
}

export interface IVideoCanvasProps {
  videoRef: RefObject<HTMLVideoElement>;
}

const VideoCanvas = ({ videoRef }: IVideoCanvasProps) => {
  const [bodyPixNet, setBodyPixNet] = useState<BodyPix>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [flipHorizontal] = useState(true);
  const [backgroundMode] = useState<BackgroundMode>(BackgroundMode.Blur);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.onloadedmetadata = () => {
      // Not sure why, but the bokeh effect seems to set the video element height and width to 0
      // causing a canvas error - hence we cache these values to video dimensions on component mount
      videoElement.height = videoElement.videoHeight;
      videoElement.width = videoElement.videoWidth;
      loadAndPredict();
    };
  }, []);

  useEffect(() => {
    animate();
  }, [canvasRef.current, videoRef.current, bodyPixNet]);

  async function loadAndPredict() {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const net = await load({
      architecture: "MobileNetV1",
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2,
    });

    setBodyPixNet(net);
  }

  async function animate() {
    const canvas = canvasRef.current;
    const videoElement = videoRef.current;
    if (!canvas || !videoElement || !bodyPixNet) return;

    const segmentation = await bodyPixNet.segmentPerson(videoElement);

    switch (backgroundMode) {
      case BackgroundMode.Mask:
        mask(segmentation);
        break;

      case BackgroundMode.Blur:
      default:
        blur(segmentation);
        break;
    }

    requestAnimationFrame(animate);
  }

  function blur(segmentation: SemanticPersonSegmentation) {
    const canvas = canvasRef.current;
    const videoElement = videoRef.current;
    if (!canvas || !videoElement || !bodyPixNet) return;

    const backgroundBlurAmount = 3;
    const edgeBlurAmount = 3;

    drawBokehEffect(
      canvas,
      videoElement,
      segmentation,
      backgroundBlurAmount,
      edgeBlurAmount,
      flipHorizontal
    );
  }

  function mask(segmentation: SemanticPersonSegmentation) {
    const canvas = canvasRef.current;
    const videoElement = videoRef.current;
    if (!canvas || !videoElement || !bodyPixNet) return;

    const coloredPartImage = toMask(segmentation);

    const opacity = 0.7;
    const maskBlurAmount = 3;

    drawMask(
      canvas,
      videoElement,
      coloredPartImage,
      opacity,
      maskBlurAmount,
      flipHorizontal
    );
  }

  return <canvas ref={canvasRef} />;
};

export default VideoCanvas;
