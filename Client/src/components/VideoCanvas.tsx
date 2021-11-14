import { RefObject, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "@tensorflow/tfjs-backend-webgl";
import {
  BodyPix,
  drawBokehEffect,
  drawMask,
  load,
  SemanticPersonSegmentation,
  toMask,
} from "@tensorflow-models/body-pix";
import { VideoBackgroundMode } from "../constants/interfaces";
import { getBackgroundMode } from "../selectors/callSelector";

export interface IVideoCanvasProps {
  videoRef: RefObject<HTMLVideoElement>;
}

const VideoCanvas = ({ videoRef }: IVideoCanvasProps) => {
  const [bodyPixNet, setBodyPixNet] = useState<BodyPix>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [flipHorizontal] = useState(true);
  const backgroundMode = useSelector(getBackgroundMode);
  const [animationFrame, setAnimationFrame] = useState<number>();
  const [animationStarted, setAnimationStarted] = useState(false);

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
    // Cancel current animation
    if (animationStarted && animationFrame !== undefined) {
      cancelAnimationFrame(animationFrame);
      setAnimationFrame(undefined);
      setAnimationStarted(false);
    }
    if (backgroundMode !== VideoBackgroundMode.None && !animationStarted) {
      animate();
      setAnimationStarted(true);
    }
  }, [
    canvasRef.current,
    videoRef.current,
    bodyPixNet,
    backgroundMode,
    animationStarted,
  ]);

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

    console.log("backgroundMode", backgroundMode);

    switch (backgroundMode) {
      case VideoBackgroundMode.Mask:
        mask(segmentation);
        break;

      case VideoBackgroundMode.Blur:
        blur(segmentation);
        break;

      default:
      // Do nothing - shouldn't render canvas if no background effect selected
    }

    const raf = requestAnimationFrame(animate);
    setAnimationFrame(raf);
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
