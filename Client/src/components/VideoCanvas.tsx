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
import styled from "styled-components";

export interface IVideoCanvasProps {
  videoRef: RefObject<HTMLVideoElement>;
}

const FlippedCanvas = styled.canvas`
  transform: scaleX(-1);
`;

const VideoCanvas = ({ videoRef }: IVideoCanvasProps) => {
  const [bodyPixNet, setBodyPixNet] = useState<BodyPix>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundMode = useSelector(getBackgroundMode);
  const backgroundModeRef = useRef<VideoBackgroundMode>(backgroundMode);
  const animationFrame = useRef<number>();

  useEffect(() => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (!videoElement) return;

    // Trigger loading of model once video metadata has loaded
    videoElement.onloadedmetadata = () => {
      // Not sure why, but the bokeh effect seems to set the video element height and width to 0
      // causing a canvas error - hence we cache these values to video dimensions on component mount
      videoElement.height = videoElement.videoHeight;
      videoElement.width = videoElement.videoWidth;

      if (canvasElement) {
        canvasElement.height = videoElement.videoHeight;
        canvasElement.width = videoElement.videoWidth;
      }
      loadModel();
    };
  }, []);

  // Trigger animation once body pix model has loaded
  useEffect(() => {
    animationFrame.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [bodyPixNet]);

  // Apply background mode to ref to prevent stale state issues
  useEffect(() => {
    backgroundModeRef.current = backgroundMode;
  }, [backgroundMode]);

  async function loadModel() {
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

    // Does not receive updates from Redux store
    if (!canvas || !videoElement || !bodyPixNet) return;

    // Return early if no effect selected to avoid awaiting segmentation
    if (backgroundModeRef.current === VideoBackgroundMode.None) {
      drawVideo();
      animationFrame.current = requestAnimationFrame(animate);
      return;
    }

    const segmentation = await bodyPixNet.segmentPerson(videoElement);

    switch (backgroundModeRef.current) {
      case VideoBackgroundMode.Mask:
        maskBackground(segmentation);
        break;

      case VideoBackgroundMode.Blur:
        blurBackground(segmentation);
        break;

      default:
      // Do nothing - shouldn't render canvas if no background effect selected
    }

    animationFrame.current = requestAnimationFrame(animate);
  }

  function drawVideo() {
    const videoElement = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx && videoElement) {
      // Scale video to retain aspect ratio
      const maxHeight = Math.max(canvas.height, videoElement.videoHeight);
      const minHeight = Math.min(canvas.height, videoElement.videoHeight);
      const maxWidth = Math.max(canvas.width, videoElement.videoWidth);
      const scaledWidth = (minHeight / maxHeight) * maxWidth;

      ctx.drawImage(videoElement, 0, 0, scaledWidth, canvas.height);
    }
  }

  function blurBackground(segmentation: SemanticPersonSegmentation) {
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
      edgeBlurAmount
    );
  }

  function maskBackground(segmentation: SemanticPersonSegmentation) {
    const canvas = canvasRef.current;
    const videoElement = videoRef.current;
    if (!canvas || !videoElement || !bodyPixNet) return;

    const coloredPartImage = toMask(segmentation);

    const opacity = 0.7;
    const maskBlurAmount = 3;

    drawMask(canvas, videoElement, coloredPartImage, opacity, maskBlurAmount);
  }
  return <FlippedCanvas ref={canvasRef} />;
};

export default VideoCanvas;
